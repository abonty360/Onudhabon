# ONUDHABON
**Empowering Communities Through Education and Collaboration**

---

## 📖 Overview
**Volunteering-based educational platform focused on helping underprivileged children.**  
Onudhabon connects local guardians, educators, and donors to create a collaborative ecosystem where children from underprivileged backgrounds can access quality learning materials, mentorship, and resources.

---

## ✨ Features

### 👥 Volunteer Roles
- **Local Guardians**  
  - Register children in their area with necessary details.  
  - Track and update each child’s progress.  
  - Distribute educational materials and evaluate exam results.

- **Educators**  
  - Upload online lectures or conduct physical sessions in specific regions.  
  - Can be anyone from anywhere in the world willing to contribute.  
  - Provide evaluation materials for student assessments.

- **Donation Providers**  
  - Fund printing of materials and cover convenience costs.  
  - Support the platform’s operational needs.

---

### 📚 Learning & Resource Access
- Lecture materials, online lectures, and evaluation resources available for **anyone** to watch or download.
- Filter lectures and materials by:
  - **Class → Subject → Topic**
- Student progress tracking for volunteers.
- Forum for volunteers to collaborate and share insights.

---

### 🖥 Website Segments
- **Login / Registration** – Secure authentication for volunteers and contributors.
- **Lectures** – Filterable by class, subject, and topic.
- **Materials** – Downloadable resources, also filterable.
- **Student Progress Check** – Volunteer-only dashboard for tracking.
- **Volunteer Forum** – Discussion space for collaboration.
- **Home** – Posts/articles about the organization (managed by developers).
- **About** – Mission, vision, and team details.
- **Profile** – Shows details of the volunteer's information.

---

## 📂 Project Structure
- **Structure:**
  ```structure
  Onudhabon/ 
  │
  ├── server/ # Express.js backend API 
  │ ├── models/ # Mongoose schemas 
  │ ├── routes/ # API route definitions 
  │ ├── controllers/ # Business logic 
  │ ├── middleware/ # Authentication, validation 
  │ └── config/ # Environment variables, DB connection 
  │ 
  ├── client/ # React.js frontend 
  │ ├── components/ # Reusable UI components 
  │ ├── pages/ # Page-level components 
  │ └── assets/ # Images, styles 
  │ 
  ├── .env # Example environment variables 
  ├── package.json # Dependencies and scripts 
  └── README.md # Project documentation
   
## 🛠 Prerequisites
Before running the project locally, ensure you have:
- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Cloudinary account** (for file storage)
- `.env` file configured with:
  ```env
  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  JWT_SECRET=your_jwt_secret

## Getting Started
1.  Clone the repository
2.  Install dependencies (npm install)
3.  Set up .env file
4.  Run the backend server (cd server & npm run dev)
5.  Run the frontend client (cd client & npm start)

## 📌 Tech Stack
- Frontend: React, React Bootstrap, Axios
- Backend: Node.js, Express.js, Mongoose
- Database: MongoDB
- File Storage: Cloudinary
- Other Tools: npm, Nodemon, dotenv, JSON, Markdown, Bootstrap

