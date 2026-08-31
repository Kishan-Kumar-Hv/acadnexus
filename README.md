# AcadNexus Future AI

AcadNexus is a comprehensive, AI-powered academic and career planning platform designed to empower students. It provides intelligent insights, study planning, aptitude assessments, and dynamic career matching, wrapping it all in a premium, modern SaaS user interface.

## 🚀 Features

- **Personalized Dashboard**: A rich, modern user interface displaying upcoming tasks, study progress, and notifications.
- **Study Planner**: Organize coursework, assignments, and study sessions effectively.
- **Aptitude Assessment & Prep**: AI-driven assessments to understand your strengths and prepare for technical or general aptitude rounds.
- **Campus Matchmaker**: Intelligent college finder that recommends the best campuses based on your profile and goals.
- **AI Tutor**: A 24/7 personal AI assistant ready to resolve doubts and explain complex concepts simply.
- **Smart Calendar**: Keep track of classes, deadlines, and extracurricular activities.
- **Flashcards & Resources**: Create interactive flashcards and access a curated hub of academic materials.
- **Community Q&A**: An anonymous platform to ask questions, share insights, and connect with peers.

## 💻 Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS** (for modern, responsive styling)
- **Lucide React** (beautiful iconography)
- **Google Generative AI** (for AI Tutor integration)
- **Axios** (API requests)

### Backend
- **Node.js** & **Express**
- **MongoDB** (Mongoose ORM)
- **Google Auth Library** (for robust authentication)

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas cluster)

### 1. Clone the repository

```bash
git clone <repository-url>
cd acadnexus
```

### 2. Quick Start (Frontend + Backend)

From the project root directory, run:

```bash
npm run dev:all
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5001](http://localhost:5001)

### 3. Running Separately

If you prefer to run services individually:

**Backend**:
```bash
npm run server
# Server will start on http://localhost:5001
```

**Frontend**:
```bash
npm run dev
# Frontend will start on http://localhost:5173
```

## 🔒 Authentication

Currently, the platform includes a temporary **Instant Demo Login** to explore the features easily without external authentication setups. Click "Instant Demo Login" in the navigation bar to access the dashboard.
(Google OAuth integration is included in the codebase and can be easily toggled back on for production).

## 📄 License

This project is licensed under the MIT License.


