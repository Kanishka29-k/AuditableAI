
AI Resume Screening API

An AI-powered resume screening and candidate-job matching system built with FastAPI, SpaCy, and SentenceTransformers. This project extracts structured information (name, skills, experience, education) from resumes (PDF/DOCX/TXT), evaluates them against job descriptions, and provides match scores, rankings, and detailed insights into candidate-job fit.

⸻

🚀 Features
	•	📄 Resume Parsing → Extracts name, email, phone, skills, experience, and education from PDF/DOCX/TXT resumes.
	•	🤖 AI Job Matching → Uses semantic similarity (BERT), skill matching, and experience analysis to compute match scores.
	•	📊 Candidate Ranking → Ranks multiple candidates against a given job description.
	•	⚡ REST API with FastAPI → Endpoints for uploading resumes, parsing, job matching, and ranking candidates.
	•	🌍 CORS enabled → Easy integration with frontend applications.
	•	🧹 In-memory database → Stores uploaded candidates (can be swapped with a real DB).

⸻

🛠️ Tech Stack
	•	Backend: FastAPI, Uvicorn
	•	NLP/AI: SpaCy, SentenceTransformers (all-MiniLM-L6-v2)
	•	File Processing: PyPDF2, python-docx
	•	ML: scikit-learn (cosine similarity)
	•	Other: Regex-based parsing, JSON APIs

⸻

📦 Installation
	1.	Clone the repo

git clone https://github.com/your-username/ai-resume-screening-api.git
cd ai-resume-screening-api


	2.	Create a virtual environment & activate

python -m venv venv
source venv/bin/activate   # (Linux/Mac)
venv\Scripts\activate      # (Windows)


	3.	Install dependencies

pip install -r requirements.txt


	4.	Download SpaCy model (if not installed)

python -m spacy download en_core_web_sm


	5.	Run the server

uvicorn main:app --reload



⸻

📌 API Endpoints

1️⃣ Root

GET / → API metadata and available endpoints.

⸻

2️⃣ Parse Resume

POST /parse-resume
	•	Upload a resume file (PDF/DOCX/TXT).
	•	Returns structured candidate info.

⸻

3️⃣ Upload Resume

POST /upload-resume
	•	Stores candidate in in-memory DB.
	•	Returns candidate ID and parsed info.

⸻

4️⃣ Match Job

POST /match-job
	•	Inputs: job_title, job_description (and optional candidate_id).
	•	Returns match score breakdown, matched/missing skills, and candidate fit.

⸻

5️⃣ Rank Candidates

POST /rank-candidates
	•	Ranks all uploaded candidates against a job description.
	•	Returns top k matches (default: 10).

⸻

6️⃣ Get Candidates

GET /candidates → List all uploaded candidates.

7️⃣ Delete Candidate

DELETE /candidates/{candidate_id} → Remove specific candidate.

8️⃣ Clear All Candidates

DELETE /candidates → Clear database.

9️⃣ Health Check

GET /health → System health and loaded models.

⸻

🧪 Example Usage

Upload Resume

curl -X POST "http://127.0.0.1:8000/upload-resume" \
-F "file=@resume.pdf"

Match Job

curl -X POST "http://127.0.0.1:8000/match-job" \
-F "job_title=AI Engineer" \
-F "job_description=Looking for Python, NLP, and ML experience"


⸻

📂 Project Structure

├── main.py               # FastAPI app with endpoints
├── requirements.txt      # Dependencies
├── README.md             # Project documentation
└── (models, uploads...)  # Future extensions


⸻

🔮 Future Improvements
	•	🗄️ Integrate with PostgreSQL / MongoDB instead of in-memory DB.
	•	📑 Add support for image-based resumes (OCR).
	•	🎯 Improve skill extraction with NER models.
	•	🌐 Add frontend dashboard for recruiters.

⸻

👨‍💻 Author

Built with Kanishka Patwal

⸻

