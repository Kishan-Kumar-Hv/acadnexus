# Project Diary: AcadNexus Future AI
**Date:** April 2026
**Project Type:** Smart Study Planner & Career Guidance Web Platform

---

## 🚀 1. What Has Been Completed So Far
We have successfully established the frontend architecture, professional design system, and core secure authentication layers of the platform.

### A. System Architecture & UI/UX Design
* **Project Initialization:** Bootstrapped the core foundation of the app using a modular UI structure.
* **Enterprise UI Engineering:** Implemented a high-end, responsive "Software-as-a-Service" (SaaS) visual layout mirroring top-tier tech platforms using minimalist cards, subtle blurs, and animated interactions.
* **Component Development:**
    * **Navbar Module:** A dynamic sticky glass-navbar reacting to user scroll states.
    * **Home Dashboard (Marketing):** Built a custom-coded CSS application dashboard mockup on the homepage emphasizing value propositions (Smart Planning, Aptitude mapping). 
    * **About & Features:** Replaced heavy "walls of text" with highly engaging, animated layouts—such as an interactive accordion for project objectives, and a "Live Terminal" visual simulating AI processing logic.

### B. Core Authentication Pipeline
* **Google OAuth 2.0 Integration:** Bridged the application to Google Cloud APIs to enable a secure, 1-click "Sign in with Google" workflow.
* **JWT Identity Resolution:** Successfully configured the client to parse raw JSON Web Tokens (JWT) returned by Google, natively extracting the user's First Name, Email, and verified Profile Avatar.
* **Dynamic Access Control:** Lifted user state to the root application. The system intelligently monitors authentication:
    * *Logged Out:* Displays the standard marketing pages (Home, About, Features).
    * *Logged In:* Destroys external links and immediately routes the user into the internal portal system.

### C. Portal & User Management Setup
* **Profile Configuration Module:** Built out the initial internal dashboard (`Profile.jsx`).
* **Verified Data Rendering:** Extracted Google Identity data auto-fills directly into the form (locking email to prevent alterations).
* **International Input Standards:** Added a robust telephone input module complete with an embedded dropdown cataloging global country codes and their correlated flags.

---

## 🛠 2. Technology Stacks Utilized
1. **React 18:** Core component library driving the Single Page Application (SPA).
2. **Vite:** High-performance frontend build tool resulting in rapid hot-module reloading and optimized bundling.
3. **Tailwind CSS:** Executed pure utility-first styling frameworks handling deep Flexbox/Grid layouts, interactive hover states, and smooth CSS keyframe animations (like `animate-fade-in-up` and `animate-float`).
4. **Google Identity Services (`@react-oauth/google`):** Handling standard implicit OAuth 2.0 authentication flows directly on the client.
5. **JWT Decode (`jwt-decode`):** Cryptographic utility parsing secure payloads to authorize users securely.
6. **Lucide React:** Consistent, lightweight scalable vector graphics (SVGs) for iconography.
7. **Node.js Environment & NPM:** Governing package installations and local development server environments.

---

## 🔮 3. What is Planned Next (Upcoming Features)

Now that the core frontend UI and auth mechanisms are functioning, the project moves primarily towards logic formulation, system integrations, and backend deployment:

* **Backend Environment Setup:** Establishing a dedicated server (Node.js/Express or Python/FastAPI) and a Database (MongoDB or PostgreSQL) to actually store user profiles, study histories, and save the phone numbers added out of the Profile module.
* **Aptitude Assessment Module (The Core AI):** Designing the interactive testing sequences. Users will answer logical reasoning scenarios and the platform must accurately store and calculate a proficiency ranking score.
* **Smart Calendar Generation Algorithms:** Writing the algorithm that accepts a user's target "Exams" or "Subjects," divides them by remaining days, and outputs a daily calendar roadmap.
* **Missed Session / Adaptive Rescheduling Logic:** Building the contingency logic. If a user fails to check off "Math Chapter 2", the algorithm must dynamically push it to tomorrow, re-calculating the rest of the schedule symmetrically.
* **Career Path Matching:** Connecting the outputs from the Aptitude Assessment to a pre-defined matrix of real-world careers, surfacing the highest-matching trajectory on the user dashboard.
* **SMS/Email Notifications (Optional but related to Phone setting):** Utilizing APIs like Twilio or SendGrid to fire the actual revision reminders to the student's registered phone number.
