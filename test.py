#!/usr/bin/env python3
"""
Test script for Resume Parser
Run this to verify the parser is working correctly
"""

import json
from resume_parser import ResumeParser

# Sample resume texts for testing
sample_resumes = {
    "software_engineer": """
    Sarah Johnson
    Senior Software Engineer
    Email: sarah.johnson@techmail.com
    Phone: (555) 123-4567

    PROFESSIONAL EXPERIENCE
    Senior Software Engineer at Google (2021 - Present)
    • Developed scalable web applications using Python, Django, and React
    • Implemented microservices architecture with Docker and Kubernetes
    • Managed PostgreSQL databases and Redis caching
    • Built REST APIs and GraphQL endpoints
    
    Software Developer at Microsoft (2019 - 2021)
    • Created machine learning models with TensorFlow and PyTorch
    • Worked on cloud infrastructure using Azure and AWS
    • Collaborated with cross-functional teams using Agile methodology

    EDUCATION
    Master of Computer Science, Stanford University (2017-2019)
    Bachelor of Computer Engineering, UC Berkeley (2013-2017)

    TECHNICAL SKILLS
    Languages: Python, JavaScript, Java, C++, SQL
    Frameworks: React, Django, Flask, Node.js, Express
    Databases: PostgreSQL, MongoDB, MySQL, Redis
    Cloud: AWS, Azure, Docker, Kubernetes
    AI/ML: TensorFlow, PyTorch, scikit-learn, pandas, numpy
    """,
    
    "data_scientist": """
    Michael Chen
    Data Scientist
    michael.chen@datamail.com
    +1-555-987-6543

    WORK EXPERIENCE
    Senior Data Scientist at Netflix (2020 - Present)
    • Built recommendation systems using deep learning and NLP
    • Analyzed user behavior data with Python, pandas, and SQL
    • Deployed ML models using TensorFlow and AWS SageMaker
    
    Data Analyst at Spotify (2018 - 2020)
    • Created data visualizations using Tableau and matplotlib
    • Performed statistical analysis with R and Python
    • Worked with big data using Spark and Hadoop

    EDUCATION
    PhD in Statistics, MIT (2014-2018)
    BS in Mathematics, Caltech (2010-2014)

    SKILLS
    Python, R, SQL, TensorFlow, PyTorch, scikit-learn, pandas, numpy
    Tableau, PowerBI, Spark, Hadoop, AWS, machine learning, deep learning
    statistics, data analysis, computer vision, natural language processing
    """
}

def test_resume_parser():
    """Test the resume parser with sample data"""
    parser = ResumeParser()
    
    print("🧪 Testing Resume Parser...")
    print("=" * 50)
    
    for resume_type, resume_text in sample_resumes.items():
        print(f"\n📄 Testing {resume_type.replace('_', ' ').title()} Resume:")
        print("-" * 40)
        
        try:
            # Parse the resume
            result = parser.parse_resume(
                file_content=resume_text.encode(), 
                file_type='txt'
            )
            
            # Display results
            print(f"✅ Name: {result['name']}")
            print(f"📧 Email: {result['email']}")
            print(f"📱 Phone: {result['phone']}")
            print(f"🛠️ Skills Found: {len(result['skills'])}")
            print(f"   Skills: {', '.join(result['skills'][:10])}{'...' if len(result['skills']) > 10 else ''}")
            print(f"💼 Experience Entries: {len(result['experience'])}")
            print(f"🎓 Education Entries: {len(result['education'])}")
            
        except Exception as e:
            print(f"❌ Error parsing resume: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Resume Parser Testing Complete!")

def test_with_json_output():
    """Test parser and show full JSON output"""
    parser = ResumeParser()
    
    print("\n🔍 Detailed JSON Output Test:")
    print("=" * 50)
    
    # Test with software engineer resume
    result = parser.parse_resume(
        file_content=sample_resumes["software_engineer"].encode(), 
        file_type='txt'
    )
    
    # Pretty print JSON
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    test_resume_parser()
    
    # Uncomment to see detailed JSON output
    # test_with_json_output()