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

### 2. Backend Setup

Navigate to the `backend` directory and install the dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
GOOGLE_CLIENT_ID=your_google_client_id
```

Start the backend server:
```bash
npm run dev
# The server will start on http://localhost:5000
```

### 3. Frontend Setup

Open a new terminal, navigate to the project root, and install the frontend dependencies:

```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
# The app will be available at http://localhost:5173
```

## 🔒 Authentication

Currently, the platform includes a temporary **Instant Demo Login** to explore the features easily without external authentication setups. Click "Instant Demo Login" in the navigation bar to access the dashboard.
(Google OAuth integration is included in the codebase and can be easily toggled back on for production).

## 📄 License

This project is licensed under the MIT License.


