# 🏥 MediTrack — Real-Time Blood & Hospital Resource Tracker

> **Saving lives, one search at a time.**
> A real-time platform connecting patients with blood banks, donors, and emergency hospital resources — instantly.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-meditrack--15b7b.web.app-red?style=for-the-badge)](https://meditrack-15b7b.web.app)
[![GitHub](https://img.shields.io/badge/GitHub-%2Fmeditrack-black?style=for-the-badge&logo=github)](https://github.com/meditrack)
[![Firebase](https://img.shields.io/badge/Hosted%20on-Firebase-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com)

---

## 🚨 The Problem

During medical emergencies in India, families waste **30–60 minutes** calling hospitals one by one to check blood availability. No centralized, real-time system exists for common people.

**People die because of this.**

---

## 💡 The Solution

MediTrack is a **real-time web platform** where:
- 🏥 Hospitals update live blood stock
- 🧑‍🤝‍🧑 Donors register and show availability
- 📞 Patients connect with one click
- 📍 GPS directions to nearest resource
- 🤖 Gemini AI provides emergency guidance

---

## ✨ Features

| Feature | Description |
|---|---|
| 🩸 Live Blood Bank Availability | Real-time stock of all 8 blood types per hospital |
| 🧑‍🤝‍🧑 Donor Registry | Registered donors with blood type, location and availability |
| 📞 One-Click Call | Instantly call any hospital or donor |
| 📍 GPS Directions | Turn-by-turn directions via OpenStreetMap |
| 🔍 Smart Search | Filter by blood type instantly |
| 📝 Donor Registration | Register as a donor in under 30 seconds |
| ⚡ Real-Time Updates | All data syncs live across all users |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend | Python 3, Flask, Flask-CORS |
| Database | Firebase Realtime Database |
| AI | Google Gemini API (gemini-2.0-flash) |
| Maps | Leaflet.js + OpenStreetMap |
| Hosting | Firebase Hosting |
| Version Control | Git + GitHub |

---

## 🎯 SDG Alignment

- 🎯 **SDG 3** — Good Health & Wellbeing
- 🎯 **SDG 11** — Sustainable Cities & Communities
- 🎯 **SDG 17** — Partnerships for the Goals

---

## 🚀 How to Run Locally

### Prerequisites
- Python 3.x
- Firebase account
- Gemini API key

### Backend Setup
```bash
# Clone the repo
git clone https://github.com/DebasreeSG/meditrack.git
cd meditrack

# Install dependencies
pip install -r requirements.txt

# Add your keys to .env
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_URL=https://your-project-default-rtdb.firebaseio.com

# Add firebase_config.json to backend folder
# (Download from Firebase Console → Project Settings → Service Accounts)

# Seed the database
cd backend
python seed_data.py

# Run the backend
python app.py
```

### Frontend Setup
```bash
# Serve the frontend
cd frontend
python -m http.server 3000

# Open in browser
http://localhost:3000
```

---

## 📁 Project Structure

```
meditrack/
│
├── frontend/
│   ├── index.html       ← Main UI
│   ├── style.css        ← Styling
│   └── app.js           ← Firebase + Map + Logic
│
├── backend/
│   ├── app.py           ← Flask API
│   ├── seed_data.py     ← Database seeder
│   └── firebase_config.json  ← (not in repo - add manually)
│
├── .env                 ← (not in repo - add manually)
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 🌐 Live Links

| | Link |
|---|---|
| 🌐 Live Website | https://meditrack-15b7b.web.app |
| 💻 GitHub Repo | https://github.com/DebasreeSG/meditrack |

---

## 👥 Team

| Name | Role |
|---|---|
| Anweeksha Saha | Frontend, UI/UX, Maps, Deployment |
| Debasree Sen Gupta | Backend, APIs, Database, AI Integration |

---

## 📸 Screenshots

> Live at: https://meditrack-15b7b.web.app

- 🏥 Blood bank cards with live stock
- 🧑‍🤝‍🧑 Donor cards with availability
- 📍 Interactive map with hospital markers
- 📞 One-click call and GPS directions

---

## 🔮 Future Roadmap

- 📱 Mobile app (Flutter) for Android & iOS
- 🔔 Push notifications to donors when blood urgently needed
- 🤖 AI-powered blood shortage prediction
- 🏥 Emergency bed availability tracking
- 🌏 Pan-India rollout with government partnerships

---

> Built with ❤️ for **Google Solution Challenge 2026 — Build with AI**
> Track: Rapid Crisis Response — Open Innovation
