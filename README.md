# 📅 Capstone Project: Event Planner Web Application

## 🔍 Project Description
The **Event Planner Web Application** is a full-stack app to create, manage, and attend events. Users can sign up, create events with detailed information, invite others, and track RSVP responses (Yes, No, Maybe). A calendar view helps visualize upcoming events. The platform is ideal for organizing personal, study group, or community events.

---

## 🚀 Tech Stack
- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based
- **Calendar Integration**: FullCalendar or react-calendar

---

## 📈 Future Enhancements
- Email notifications
- Comments and discussion
- Recurring events
- QR code check-in system

---

## 📅 6-Week Capstone Plan

### Week 1: Project Setup, Design, and Backend Basics
- **Day 1**: Low-fidelity design sketches
- **Day 2**: High-fidelity design (Figma)
- **Day 3**: Setup GitHub repo and README
- **Day 4**: Basic Express.js backend + GET /events API
- **Day 5**: POST /events API
- **Day 6**: MongoDB Schemas (Event, User)
- **Day 7**: Backend deployment and Postman testing

### Week 2: Database, Frontend Setup, and Integration
- **Day 8**: CRUD with Mongoose
- **Day 9**: Setup relationships (created_by, RSVP)
- **Day 10**: Initialize React app (Vite)
- **Day 11**: Deploy frontend
- **Day 12**: EventCard, EventForm, EventList components
- **Day 13**: Match UI with designs
- **Day 14**: Connect frontend to backend

### Week 3: Add Key Features
- **Day 15**: Image upload for events
- **Day 16**: User authentication (bcrypt)
- **Day 17**: JWT for protected routes
- **Day 18**: User roles (admin/guest)
- **Day 19**: Edit/Delete event
- **Day 20**: RSVP tracking
- **Day 21**: Test & deploy updates

### Week 4: Refinement
- **Day 22**: Event filtering
- **Day 23**: Pagination
- **Day 24**: Backend error handling
- **Day 25**: Frontend validation & error handling
- **Day 26**: Event search
- **Day 27**: Cross-browser UI testing
- **Day 28**: Final feature testing

### Week 5: Testing, Security & Performance
- **Day 29**: Jest unit tests
- **Day 30**: Dockerize app
- **Day 31**: Lazy loading, caching
- **Day 32**: Secure app (XSS, CSRF)
- **Day 33**: Mobile responsiveness
- **Day 34**: Code cleanup & best practices
- **Day 35**: JWT and role validation

### Week 6: Final Touches and Deployment
- **Day 36**: UI polish & animation
- **Day 37**: Calendar view integration
- **Day 38**: CI/CD setup (GitHub Actions)
- **Day 39**: Device compatibility testing
- **Day 40**: Final deployment (Netlify + Railway)
- **Day 41**: Record demo video
- **Day 42**: Submit final report

---

## ✅ Setup Instructions
- Fork this repo and clone it locally
- Follow weekly tasks as per the plan above

## 🛠 Development

Backend:

- Copy `backend/.env.example` to `backend/.env` and fill values (do NOT commit this file).
- Start the backend: run `npm install` inside `backend` and then `npm start` (or `npm run dev` if you have nodemon).

Frontend:

- In `frontend/client` create a `.env` file with `VITE_API_URL=http://localhost:3000` to point to the backend during development.
- Install and run the frontend: `npm install` then `npm run dev`.

Security note: remove any real credentials from the repo and keep `.env` files local. I added `backend/.gitignore` and `.env.example` for safety.

