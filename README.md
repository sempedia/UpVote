# 🗳️ UpVote – Feature Voting System

Welcome to **UpVote**, a simple full-stack application that lets users post feature ideas and upvote others. This project demonstrates a basic end-to-end voting system for features, including a backend API, a database, and a mobile-friendly frontend built with React Native (Expo). This project was developed with the assistance of a large language model to build a complete, end-to-end feature voting app in under 2 hours.

## 📌 Overview

**UpVote** is a feature suggestion and voting platform where users can:

* ✅ Submit new feature ideas
* 🔼 Upvote features they want implemented
* 📱 Use the app on a mobile device or via a web interface

## 🧠 Challenge Goals

This challenge simulates the type of work expected from an AI-powered developer:

| Category | Goal |
| :--- | :--- |
| Prompting Skills | Clear, layered, iterative prompts to AI models |
| Tool Orchestration | Use AI to scaffold backend, frontend, DB, docs, and more |
| System Thinking | End-to-end logical data and component flow |
| Functionality | A working full-stack MVP experience |
| Multi-Platform Output | Functional UI for both web and mobile |
| Debugging / Edge Cases | Smart design decisions, error resilience |
| Prompt Logs | Included at the bottom of this README |

---

## ⚙️ Tech Stack

| Layer | Tool |
| :--- | :--- |
| Frontend | React Native (Expo) |
| Backend | Django and Django Rest Framework (DRF) |
| Database | PostgreSQL |
| AI Helped By | Claude Sonet 4 |
| Dev Tools | Docker, `psycopg2-binary` |

---

## 🔩 Features

* ✅ Add new features via form input
* 🔼 Upvote existing features
* 📜 List all feature requests with vote counts
* 🔁 Persistent storage using PostgreSQL
* 🚀 Easily extensible to web or other platforms

## 📂 Project Structure

UpVote/
├── backend/
│   ├── upvote_project/       # Django project
│   ├── manage.py
│   ├── core/               # Django app for core logic
│   ├── requirements.txt
│   └── Dockerfile          # Backend Docker image
├── frontend/
│   ├── App.js              # Main entry
│   ├── src/
│   └── package.json
├── docker-compose.yml      # Docker Compose file
├── .gitignore
├── README.md
└── prompts.txt             # 🧠 AI prompting log


---

## 🚀 Setup Instructions

1.  **Clone the Repo**

    ```bash
    git clone [https://github.com/sempedia/UpVote.git](https://github.com/sempedia/UpVote.git)
    cd upvote
    ```

2.  **Run with Docker Compose (Recommended)**

    Make sure you have Docker and Docker Compose installed. This will start both the backend and frontend services.

    ```bash
    docker-compose up --build -d
    ```

    * The **Backend API** will be accessible at: `http://localhost:8000`
    * The **Frontend** will be accessible via Expo's QR code for mobile or in your browser at `http://localhost:19006`.

    To stop the services:
    ```bash
    docker-compose down
    ```

3.  **Backend Setup (Manual)**

    If you want to run the backend manually without Docker, ensure you have Python 3.9+ and PostgreSQL installed.

    ```bash
    cd backend
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
    ```

    The API will be available at: `http://localhost:8000`

---

## 🧪 Sample API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/features/` | List all features |
| `POST` | `/api/features/` | Create a new feature |
| `POST` | `/api/features/{id}/vote/` | Upvote a feature |

---

## 🧠 Prompting Strategy & AI Logs

* **Prompting** was done using Claude Sonet 4.
* **Logs** are saved in `prompts.txt`, showing:
    * Scaffolding of the backend and frontend
    * Architecture decisions
    * Error fixing
    * Git setup and `.gitignore`
    * AI-generated documentation templates

---

## 🧹 Known Limitations

* No authentication (public voting)
* Minimal validation on input
* Flat data model (no user linkage or comments)

## ✅ Future Improvements

* 🔐 User login and roles
* 🧠 AI-assisted feature prioritization
* 💬 Comments per feature
* 📊 Sorting, filtering, and search
* ☁️ Cloud DB and deployment

---



## 🧑‍💻 Author

[Alina Bazavan](https://github.com/sempedia) ([@sempedia](https://github.com/sempedia))

## 🪄 License

**MIT License** – free to use, adapt, or build on.