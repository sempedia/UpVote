# 🗳️ UpVote – Feature Voting System

Welcome to **UpVote** — Feature Voting Full-Stack App

UpVote is a simple full-stack application that lets users post feature ideas and upvote others. It includes a backend API, a database, and a mobile-friendly frontend built with React Native (Expo). This project demonstrates a basic end-to-end voting system for features. **AI-assisted development** (OpenAI + Claude) to build a complete, end-to-end feature voting app in under 2 hours.

---

## 📌 Overview

**UpVote** is a feature suggestion and voting platform where users can:

- ✅ Submit new feature ideas
- 🔼 Upvote features they want implemented
- 📱 Use the app on **mobile (Android via Expo)**

---

## 🧠 Challenge Goals

This challenge simulates the type of work expected from an AI-powered developer:

| Category              | Goal                                                                 |
|-----------------------|----------------------------------------------------------------------|
| Prompting Skills       | Clear, layered, iterative prompts to AI models                       |
| Tool Orchestration     | Use AI to scaffold backend, frontend, DB, docs, and more            |
| System Thinking        | End-to-end logical data and component flow                          |
| Functionality          | Working full-stack MVP experience                                   |
| Multi-Platform Output  | Functional mobile UI (via Expo)                                     |
| Debugging / Edge Cases | Smart design decisions, error resilience                            |
| Prompt Logs            | Included at the bottom of this README                               |

---

## ⚙️ Tech Stack

| Layer        | Tool                     |
|--------------|--------------------------|
| Frontend     | React Native (Expo)      |
| Backend      | Django and DRF                 |
| Database     | PostgreSQL   |
| AI Helped By | Claude Sonet 4 |
| Dev Tools    | Virtualenv, Docker |

---

## 🔩 Features

- ✅ Add new features via form input
- 🔼 Upvote existing features
- 📜 List all feature requests with vote counts
- 🔁 Persistent storage using SQLite
- 🚀 Easily extensible to web or other platforms

---

## 📂 Project Structure

UpVote/
├── backend/
│ ├── main.py # FastAPI entrypoint
│ ├── models.py # SQLModel schema
│ ├── database.py # DB setup
│ └── routes/ # API routes
│ └── Dockerfile # Backend Docker image
├── frontend/
│ ├── App.js # Main entry
│ ├── src/
│ │ ├── screens/ # Feature list, add form
│ │ ├── services/ # API calls
│ │ └── components/ # Reusable UI components
│ └── Dockerfile # Frontend Docker image (optional)
├── docker-compose.yml # Docker Compose file
├── .gitignore
├── README.md
└── prompts.txt # 🧠 AI prompting log



---

## 🚀 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/sempedia/UpVote.git
cd UpVote
2. Run with Docker Compose (Recommended)
Make sure you have Docker and Docker Compose installed.

Start the entire stack (backend + frontend):


docker-compose up --build
Backend API will be accessible at: http://localhost:8000

Expo frontend will start with a QR code for mobile app access.

To stop:


docker-compose down
3. Backend Setup (Manual)
If you want to run backend manually without Docker:

cd backend
python3 -m venv venv
source venv/bin/activate         # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

API available at: http://localhost:8000

4. Frontend Setup (Manual)
To run frontend manually:


cd frontend
npm install
npm start
Use Expo app on your mobile device or run on web:

Android: npm run android

iOS: npm run ios (macOS only)

Web: npm run web

🧪 Sample API Endpoints
Method	Endpoint	Description
GET	/features	List all features
POST	/features	Create a new feature
POST	/features/{id}/vote	Upvote a feature

🧠 Prompting Strategy & AI Logs
Prompting was done using Claude 3  Logs are saved in prompts.txt, showing:

Scaffolding of backend and frontend

Architecture decisions

Error fixing

Git setup and .gitignore

AI-generated doc templates

🧹 Known Limitations
No authentication (public voting)

Minimal validation on input

Flat data model (no user linkage or comments)

✅ Future Improvements
🔐 User login and roles

🧠 AI-assisted feature prioritization

💬 Comments per feature

📊 Sorting, filtering, and search

☁️ Cloud DB and deployment

🧑‍💻 Author
Alina @sempedia



🪄 License
MIT – free to use, adapt, or build on