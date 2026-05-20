# 📄 Product Requirements Document (PRD)
## 🧠 Online Examination & Proctoring Platform (PRO Dashboard)

---

## 1. 📌 Overview

The **Online Examination & Proctoring Platform** is a secure, scalable web application designed to conduct exams remotely with real-time monitoring and analytics.

It supports multiple question formats (MCQ, coding, descriptive) and ensures academic integrity through proctoring mechanisms like tab-switch detection, fullscreen enforcement, and activity tracking.

---

## 2. 🎯 Objectives

- Enable secure online examinations
- Provide real-time monitoring dashboard for admins
- Prevent cheating using proctoring techniques
- Automate evaluation and result generation
- Support scalable exam conduction for institutions

---

## 3. 👥 Stakeholders

- **Students** → Take exams
- **Admins** → Create/manage exams & monitor activity
- **Institutions/Colleges** → Use platform for assessments

---

## 4. 🧑‍💻 User Roles & Permissions

### 👨‍🎓 Student
- Login/Register
- View assigned exams
- Attempt exam
- Submit answers
- View results

### 🧑‍💼 Admin
- Create exams
- Add questions
- Schedule exams
- Monitor students live
- View analytics & reports

---

## 5. 🧩 Features & Requirements

### 5.1 🧪 Exam Engine
- Support:
  - MCQs
  - Coding Questions
  - Descriptive Answers
- Per-question timer
- Auto-save answers
- Auto-submit on timeout
- Randomized questions

---

### 5.2 👁️ Proctoring System
- Tab-switch detection
- Fullscreen enforcement
- Activity logging
- Warning system for suspicious behavior

---

### 5.3 📊 Real-Time Dashboard
- Live student monitoring
- Active exam status
- Suspicious activity alerts
- Real-time progress tracking

---

### 5.4 🛠️ Admin Panel
- Create/edit/delete exams
- Manage question bank
- Assign exams to batches
- Schedule exams

---

### 5.5 📈 Results & Analytics
- Instant result generation
- Score calculation
- Performance analytics
- Leaderboard

---

## 6. ⚙️ Functional Requirements

| ID | Requirement |
|----|------------|
| FR1 | User authentication (JWT-based) |
| FR2 | Role-based access control |
| FR3 | Exam creation & scheduling |
| FR4 | Question randomization |
| FR5 | Timer & auto-submit |
| FR6 | Tab-switch detection |
| FR7 | Real-time updates using WebSockets |
| FR8 | Result calculation |
| FR9 | Admin monitoring dashboard |

---

## 7. 🚫 Non-Functional Requirements

| Category | Requirement |
|----------|------------|
| Security | Encrypted authentication, anti-cheating |
| Performance | Handle 1000+ concurrent users |
| Scalability | Modular backend (Node + Express) |
| Reliability | Auto-save answers |
| Usability | Clean UI with minimal latency |

---

## 8. 🏗️ System Architecture

### Frontend
- React + Vite
- State management (Context API / Redux)

### Backend
- Node.js + Express

### Database
- MongoDB

### Real-Time
- Socket.io

---

## 9. 🔄 User Flow

### Student Flow
1. Login
2. View exam
3. Start exam
4. Answer questions
5. Submit / Auto-submit
6. View result

### Admin Flow
1. Login
2. Create exam
3. Add questions
4. Schedule exam
5. Monitor students
6. View analytics

---

## 10. 🗄️ Data Models

### User
- name
- email
- password
- role

### Exam
- title
- duration
- questions
- schedule

### Question
- type
- question
- options
- correct answer

### Submission
- studentId
- examId
- answers
- score

---

## 11. 📊 Success Metrics

- Exam completion rate
- Number of cheating incidents detected
- System uptime
- Average response time
- User satisfaction

---

## 12. 🚀 Milestones

| Phase | Description |
|------|------------|
| Phase 1 | Authentication & basic UI |
| Phase 2 | Exam engine |
| Phase 3 | Proctoring system |
| Phase 4 | Real-time dashboard |
| Phase 5 | Analytics & deployment |

---

## 13. ⚠️ Risks & Challenges

- Cheating prevention limitations
- High concurrent user load
- Browser restrictions for fullscreen
- Network interruptions during exams

---

## 14. 🔮 Future Enhancements

- AI-based proctoring
- Face recognition
- Voice monitoring
- Plagiarism detection
- Mobile app support

---

## 15. 📦 Tech Stack Summary

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Realtime: Socket.io

---

## 16. 📌 Conclusion

This platform aims to deliver a **secure, scalable, and intelligent online examination system** with strong proctoring and analytics capabilities, suitable for real-world institutional use.

---