import spacy
import re
import json
import io
import numpy as np
from typing import Dict, List, Any, Optional
from datetime import datetime

# FastAPI imports
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# ML/AI imports
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# File processing imports
import PyPDF2
from docx import Document

# ================================
# PYDANTIC MODELS
# ================================

class JobDescription(BaseModel):
    title: str
    description: str
    requirements: Optional[str] = ""

class ResumeData(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    skills: List[str] = []
    experience: List[Dict[str, str]] = []
    education: List[Dict[str, str]] = []
    raw_text: str = ""

class MatchResult(BaseModel):
    overall_score: float
    score_breakdown: Dict[str, float]
    matched_skills: List[str]
    missing_skills: List[str]
    candidate_info: Dict[str, Any]

# ================================
# RESUME PARSER CLASS
# ================================

class ResumeParser:
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except IOError:
            print("SpaCy model not found. Install with: python -m spacy download en_core_web_sm")
            self.nlp = None
    
    def extract_text_from_pdf(self, pdf_file) -> str:
        try:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            print(f"Error extracting PDF: {e}")
            return ""
    
    def extract_text_from_docx(self, docx_file) -> str:
        try:
            doc = Document(docx_file)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            print(f"Error extracting DOCX: {e}")
            return ""
    
    def extract_email(self, text: str) -> str:
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        return emails[0] if emails else ""
    
    def extract_phone(self, text: str) -> str:
        phone_pattern = r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, text)
        return ''.join(phones[0]) if phones else ""
    
    def extract_name(self, text: str) -> str:
        if not self.nlp:
            # Fallback: extract from first few lines
            lines = text.split('\n')[:3]
            for line in lines:
                line = line.strip()
                if len(line) > 5 and len(line) < 50 and not '@' in line:
                    return line
            return ""
        
        doc = self.nlp(text[:500])
        names = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
        return names[0] if names else ""
    
    def extract_skills(self, text: str) -> List[str]:
        skill_keywords = [
            # Programming languages
            'python', 'java', 'javascript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
            'swift', 'kotlin', 'typescript', 'r', 'matlab', 'scala', 'perl',
            
            # Web technologies
            'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django',
            'flask', 'spring', 'bootstrap', 'jquery', 'sass', 'webpack', 'next.js',
            
            # Databases
            'mysql', 'postgresql', 'mongodb', 'sqlite', 'redis', 'elasticsearch',
            'oracle', 'sql server', 'cassandra', 'dynamodb', 'sql',
            
            # Cloud & DevOps
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git',
            'terraform', 'ansible', 'nginx', 'apache', 'linux',
            
            # AI/ML
            'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
            'pandas', 'numpy', 'opencv', 'nlp', 'computer vision', 'ai', 'ml',
            
            # Blockchain
            'blockchain', 'solidity', 'ethereum', 'web3', 'smart contracts', 'defi',
            
            # Other
            'api', 'rest', 'graphql', 'microservices', 'agile', 'scrum', 'devops',
            'data analysis', 'statistics', 'hadoop', 'spark', 'kafka'
        ]
        
        text_lower = text.lower()
        found_skills = []
        
        for skill in skill_keywords:
            if skill in text_lower:
                found_skills.append(skill)
        
        return list(set(found_skills))
    
    def extract_experience(self, text: str) -> List[Dict[str, str]]:
        experience_pattern = r'(\d{4})\s*[-–]\s*(\d{4}|present|current)'
        experiences = []
        
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if any(keyword in line.lower() for keyword in ['experience', 'work', 'employment', 'job', 'position']):
                for j in range(i+1, min(i+5, len(lines))):
                    if re.search(experience_pattern, lines[j], re.IGNORECASE):
                        experiences.append({
                            'period': lines[j].strip(),
                            'description': lines[j].strip()
                        })
        
        return experiences
    
    def extract_education(self, text: str) -> List[Dict[str, str]]:
        education_keywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'diploma']
        education = []
        
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in education_keywords):
                education.append({'degree': line.strip()})
        
        return education
    
    def parse_resume(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        # Determine file type
        file_type = filename.lower().split('.')[-1] if '.' in filename else 'txt'
        
        # Extract text
        if file_type == 'pdf':
            text = self.extract_text_from_pdf(io.BytesIO(file_content))
        elif file_type in ['docx', 'doc']:
            text = self.extract_text_from_docx(io.BytesIO(file_content))
        else:
            text = file_content.decode('utf-8', errors='ignore')
        
        # Extract structured information
        parsed_data = {
            'name': self.extract_name(text),
            'email': self.extract_email(text),
            'phone': self.extract_phone(text),
            'skills': self.extract_skills(text),
            'experience': self.extract_experience(text),
            'education': self.extract_education(text),
            'raw_text': text[:2000] + '...' if len(text) > 2000 else text
        }
        
        return parsed_data

# ================================
# JOB MATCHER CLASS
# ================================

class JobMatcher:
    def __init__(self):
        print("Loading sentence transformer model...")
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = None
    
    def extract_jd_requirements(self, job_description: str) -> Dict[str, Any]:
        jd_lower = job_description.lower()
        
        # Extract required skills
        skill_keywords = [
            'python', 'java', 'javascript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
            'react', 'angular', 'vue', 'node.js', 'django', 'flask', 'spring',
            'mysql', 'postgresql', 'mongodb', 'redis', 'aws', 'azure', 'docker',
            'kubernetes', 'machine learning', 'ai', 'data science', 'tensorflow',
            'pytorch', 'blockchain', 'solidity', 'ethereum', 'git', 'agile', 'scrum'
        ]
        
        required_skills = [skill for skill in skill_keywords if skill in jd_lower]
        
        # Extract experience level
        experience_years = 0
        exp_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of\s+)?experience',
            r'(\d+)\+?\s*years?\s*(?:of\s+)?exp',
            r'minimum\s*(\d+)\s*years?',
            r'at least\s*(\d+)\s*years?'
        ]
        
        for pattern in exp_patterns:
            match = re.search(pattern, jd_lower)
            if match:
                experience_years = int(match.group(1))
                break
        
        return {
            'required_skills': required_skills,
            'experience_years': experience_years,
            'raw_text': job_description
        }
    
    def calculate_skill_match_score(self, resume_skills: List[str], jd_skills: List[str]) -> float:
        if not jd_skills:
            return 0.0
        
        resume_skills_lower = [skill.lower() for skill in resume_skills]
        jd_skills_lower = [skill.lower() for skill in jd_skills]
        
        matched_skills = set(resume_skills_lower) & set(jd_skills_lower)
        skill_match_score = len(matched_skills) / len(jd_skills_lower)
        
        return min(skill_match_score, 1.0)
    
    def calculate_experience_score(self, resume_experience: List[Dict], required_years: int) -> float:
        if required_years == 0:
            return 1.0
        
        experience_entries = len(resume_experience)
        estimated_years = experience_entries * 2
        
        return min(estimated_years / required_years, 1.0) if required_years > 0 else 1.0
    
    def calculate_semantic_similarity(self, resume_text: str, jd_text: str) -> float:
        if not self.model:
            return 0.0
        
        try:
            resume_clean = re.sub(r'\s+', ' ', resume_text).strip()[:1000]
            jd_clean = re.sub(r'\s+', ' ', jd_text).strip()[:1000]
            
            embeddings = self.model.encode([resume_clean, jd_clean])
            similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
            return float(similarity)
        except Exception as e:
            print(f"Error calculating semantic similarity: {e}")
            return 0.0
    
    def match_resume_to_job(self, resume_data: Dict[str, Any], job_description: str) -> Dict[str, Any]:
        weights = {'skills': 0.4, 'semantic': 0.4, 'experience': 0.2}
        
        jd_data = self.extract_jd_requirements(job_description)
        
        skill_score = self.calculate_skill_match_score(
            resume_data['skills'], jd_data['required_skills']
        )
        
        experience_score = self.calculate_experience_score(
            resume_data['experience'], jd_data['experience_years']
        )
        
        semantic_score = self.calculate_semantic_similarity(
            resume_data['raw_text'], jd_data['raw_text']
        )
        
        overall_score = (
            weights['skills'] * skill_score +
            weights['semantic'] * semantic_score +
            weights['experience'] * experience_score
        )
        
        matched_skills = list(set(resume_data['skills']) & set(jd_data['required_skills']))
        missing_skills = list(set(jd_data['required_skills']) - set(resume_data['skills']))
        
        return {
            'overall_score': round(overall_score, 3),
            'score_breakdown': {
                'skill_match': round(skill_score, 3),
                'semantic_similarity': round(semantic_score, 3),
                'experience_match': round(experience_score, 3)
            },
            'matched_skills': matched_skills,
            'missing_skills': missing_skills,
            'candidate_info': {
                'name': resume_data.get('name', 'Unknown'),
                'email': resume_data.get('email', ''),
                'phone': resume_data.get('phone', ''),
                'total_skills': len(resume_data['skills'])
            }
        }

# ================================
# INITIALIZE COMPONENTS
# ================================

# Initialize FastAPI app
app = FastAPI(
    title="AI Resume Screening API",
    description="Blockchain-powered AI resume screening and candidate matching system",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize global components
resume_parser = ResumeParser()
job_matcher = JobMatcher()

# Store candidates in memory (in production, use a database)
candidates_db = []

# ================================
# API ENDPOINTS
# ================================

@app.get("/")
async def root():
    return {
        "message": "AI Resume Screening API",
        "version": "1.0.0",
        "endpoints": {
            "parse_resume": "/parse-resume",
            "match_job": "/match-job",
            "upload_resume": "/upload-resume",
            "rank_candidates": "/rank-candidates",
            "get_candidates": "/candidates"
        }
    }

@app.post("/parse-resume")
async def parse_resume_endpoint(file: UploadFile = File(...)):
    """Parse uploaded resume file and extract structured data"""
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.docx', '.doc', '.txt')):
            raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, DOCX, or TXT files.")
        
        # Read file content
        content = await file.read()
        
        # Parse resume
        parsed_data = resume_parser.parse_resume(content, file.filename)
        
        return {
            "status": "success",
            "filename": file.filename,
            "parsed_data": parsed_data,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and store resume in candidates database"""
    try:
        content = await file.read()
        parsed_data = resume_parser.parse_resume(content, file.filename)
        
        # Add to candidates database
        candidate = {
            "id": len(candidates_db),
            "filename": file.filename,
            "uploaded_at": datetime.now().isoformat(),
            "data": parsed_data
        }
        
        candidates_db.append(candidate)
        
        return {
            "status": "success",
            "message": "Resume uploaded and parsed successfully",
            "candidate_id": candidate["id"],
            "candidate_name": parsed_data.get("name", "Unknown"),
            "skills_found": len(parsed_data.get("skills", [])),
            "total_candidates": len(candidates_db)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading resume: {str(e)}")

@app.post("/match-job")
async def match_job_endpoint(
    job_title: str = Form(...),
    job_description: str = Form(...),
    candidate_id: Optional[int] = Form(None)
):
    """Match job description with specific candidate or all candidates"""
    try:
        if candidate_id is not None:
            # Match specific candidate
            if candidate_id >= len(candidates_db):
                raise HTTPException(status_code=404, detail="Candidate not found")
            
            candidate = candidates_db[candidate_id]
            match_result = job_matcher.match_resume_to_job(
                candidate["data"], job_description
            )
            
            return {
                "status": "success",
                "job_title": job_title,
                "candidate": candidate,
                "match_result": match_result
            }
        else:
            # Match all candidates
            if not candidates_db:
                raise HTTPException(status_code=400, detail="No candidates found. Upload resumes first.")
            
            matches = []
            for candidate in candidates_db:
                match_result = job_matcher.match_resume_to_job(
                    candidate["data"], job_description
                )
                matches.append({
                    "candidate": candidate,
                    "match_result": match_result
                })
            
            # Sort by overall score
            matches.sort(key=lambda x: x["match_result"]["overall_score"], reverse=True)
            
            return {
                "status": "success",
                "job_title": job_title,
                "total_candidates": len(matches),
                "matches": matches
            }
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error matching job: {str(e)}")

@app.post("/rank-candidates")
async def rank_candidates_endpoint(
    job_title: str = Form(...),
    job_description: str = Form(...),
    top_k: int = Form(10)
):
    """Rank all candidates for a job and return top K matches"""
    try:
        if not candidates_db:
            raise HTTPException(status_code=400, detail="No candidates found. Upload resumes first.")
        
        matches = []
        for candidate in candidates_db:
            match_result = job_matcher.match_resume_to_job(
                candidate["data"], job_description
            )
            matches.append({
                "candidate_id": candidate["id"],
                "candidate_name": candidate["data"].get("name", "Unknown"),
                "filename": candidate["filename"],
                "overall_score": match_result["overall_score"],
                "score_breakdown": match_result["score_breakdown"],
                "matched_skills": match_result["matched_skills"],
                "missing_skills": match_result["missing_skills"],
                "candidate_info": match_result["candidate_info"]
            })
        
        # Sort and get top K
        matches.sort(key=lambda x: x["overall_score"], reverse=True)
        top_matches = matches[:top_k]
        
        return {
            "status": "success",
            "job_title": job_title,
            "total_candidates_evaluated": len(matches),
            "top_matches_returned": len(top_matches),
            "top_candidates": top_matches,
            "summary": {
                "best_match_score": top_matches[0]["overall_score"] if top_matches else 0,
                "average_score": sum(m["overall_score"] for m in matches) / len(matches) if matches else 0,
                "candidates_above_threshold": len([m for m in matches if m["overall_score"] > 0.5])
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error ranking candidates: {str(e)}")

@app.get("/candidates")
async def get_candidates():
    """Get all uploaded candidates"""
    return {
        "status": "success",
        "total_candidates": len(candidates_db),
        "candidates": [
            {
                "id": candidate["id"],
                "filename": candidate["filename"],
                "name": candidate["data"].get("name", "Unknown"),
                "email": candidate["data"].get("email", ""),
                "skills_count": len(candidate["data"].get("skills", [])),
                "uploaded_at": candidate["uploaded_at"]
            }
            for candidate in candidates_db
        ]
    }

@app.delete("/candidates/{candidate_id}")
async def delete_candidate(candidate_id: int):
    """Delete a specific candidate"""
    if candidate_id >= len(candidates_db):
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    deleted_candidate = candidates_db.pop(candidate_id)
    
    # Update IDs for remaining candidates
    for i, candidate in enumerate(candidates_db):
        candidate["id"] = i
    
    return {
        "status": "success",
        "message": f"Candidate '{deleted_candidate['data'].get('name', 'Unknown')}' deleted successfully",
        "remaining_candidates": len(candidates_db)
    }

@app.delete("/candidates")
async def clear_all_candidates():
    """Clear all candidates from database"""
    count = len(candidates_db)
    candidates_db.clear()
    
    return {
        "status": "success",
        "message": f"All {count} candidates cleared from database"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "components": {
            "resume_parser": "ok" if resume_parser else "error",
            "job_matcher": "ok" if job_matcher.model else "error",
            "spacy_nlp": "ok" if resume_parser.nlp else "warning"
        },
        "candidates_count": len(candidates_db),
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)