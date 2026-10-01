# 🚌 TransitGo — Public Transport Smart App
### DTPLM Course Project | VIT | CSAI-A | Batch 2 | Roll No. 45

---

## 📌 Project Overview

**Product Name:** TransitGo  
**Type:** Smart Public Transport Mobile/Web Application  
**Target City:** Pune, Maharashtra, India  
**Target System:** PMPML (Pune Mahanagar Parivahan Mahamandal Limited) Bus Network  
**Course:** DTPLM (Design Thinking & Product Lifecycle Management)  
**College:** VIT (Vellore Institute of Technology)  
**Academic Year:** 2025–26  

---

## 👥 Team

| Name | Role | Roll No. |
|------|------|----------|
| Shreyash Bhalerao | Product Lead & Research | 45 |
| Sarvesh | UX & Ideation | Batch 2 |
| Chetan | Technical Architecture | Batch 2 |
| Aditya | Business & Strategy | Batch 2 |

---

## 🧑‍💻 Primary User Persona

> This persona was built through real empathy research as part of Assignment 1 (Empathy Map).

| Attribute | Details |
|-----------|---------|
| **Name** | Shreyash Bhalerao |
| **Age** | 21 years |
| **Occupation** | College Student |
| **Location** | Pune |
| **Monthly Income** | ₹12,000 |
| **Transport Used** | PMPML Bus |
| **Devices** | Android Phone, iPhone, UPI Payments |
| **Travel Frequency** | Daily |
| **Purpose** | College, Tuition, other errands |
| **Goals** | Reach college on time, save money, travel safely |
| **Frustrations** | Bus delays, overcrowding, no live tracking, long waiting time |
| **Needs** | Real-time bus location, digital ticketing, accurate timings, comfortable journey |
| **Motivation** | Affordable and reliable transport |

---

## 😤 Problem Statement

Every PMPML commuter in Pune faces these 4 core problems:

1. **No Live Tracking** — Passengers have no idea where the bus is. They just wait at stops with zero information.
2. **Unpredictable Delays** — Buses arrive 20–45 minutes late with no alerts, causing missed classes and appointments.
3. **Overcrowding** — No way to know if the next bus will be less crowded; passengers are forced to squeeze in.
4. **Paper Tickets & Cash Only** — No digital payment support. Standing in lines for tokens is outdated and time-consuming.

---

## 💡 Our Solution — TransitGo

TransitGo is a **digital public transport companion app** that gives Pune commuters:
- Real-time bus GPS tracking on an interactive map
- Accurate ETAs and arrival notifications
- Digital ticket booking with UPI/card payment
- Delay and cancellation alerts via push notifications
- AI-based crowd prediction for smarter travel planning

---

## 🎯 MVP (Minimum Viable Product)

The MVP is defined as **Increment 1 + Increment 2** from our Incremental Development Plan.

### MVP Features:
1. **Route Search** — Enter source → destination → see all matching PMPML bus routes with timing & fare
2. **Bus Timetable / Schedule Viewer** — View full schedule for any route
3. **Live Bus Tracking (Map)** — See real-time GPS location of buses on an interactive map
4. **Basic User Account** — Login/register to save favourite routes

### Why this is the MVP:
> The #1 user pain is "I don't know when/where my bus is."  
> The MVP directly solves this with route search + live tracking — the minimum that actually delivers value to the user.

### MVP Success Metrics:
- User can find their bus route in < 10 seconds
- Live tracking updates every 30 seconds
- App loads in < 3 seconds on 4G

---

## 🏗️ Product Roadmap (Incremental Development Model)

> The PDLC model chosen is **Incremental Development** (justified in Assignment 4).  
> Each increment adds real user value and can be released independently.

| Increment | Phase | Features | Status |
|-----------|-------|----------|--------|
| **1** | MVP - Now | Route search, bus timetables, journey planning | ✅ MVP Ready |
| **2** | Next | Live GPS vehicle tracking on interactive map, ETA alerts | 🔄 In Development |
| **3** | Phase 3 | Online ticket booking, UPI/card payment, QR code boarding | 📋 Planned |
| **4** | Phase 4 | Delay alerts, cancellation notifications, push notifications | 📋 Planned |
| **5** | Phase 5 | AI crowd prediction, personalized recommendations, trip planner | 📋 Planned |

---

## 📐 PDLC Model — Incremental Development

**Chosen Model:** Incremental Development Model  
**Justification (from Assignment 4):**

| Factor | Analysis |
|--------|----------|
| **Requirement Stability** | Not fully stable — can change with user feedback, traffic conditions, payment tech |
| **Criticality/Safety** | Important for daily travel but not life-critical (like medical/aviation systems) |
| **Regulatory Mandate** | Must follow govt transport, safety, payment, and data regulations |
| **Reuse Availability** | High — GPS APIs, Google Maps, payment gateways, cloud, push notification services |

**3 Key Reasons for Incremental Model:**
1. **Changing Requirements** — Passenger needs and transport conditions evolve; incremental handles this without redesigning everything
2. **Early User Feedback** — Basic version (route search + schedules) can be released first; feedback improves later versions
3. **Reuse & Speed** — Massive reuse of GPS, maps, UPI, notification APIs reduces development time

**Risk of this model:** Frequent changes and multiple releases can create integration problems if increments are not properly planned and tested. Mitigated via CI/CD and thorough testing at each increment.

---

## 🎨 Design Thinking Process Applied

**Stage 1 — Empathize (Assignment 1)**
- Created empathy map for PMPML bus commuters
- Identified feelings, frustrations, needs, and behaviours
- Primary research focused on daily commuters in Pune

**Stage 2 — Define (Tutorial 2)**
- Built user persona: Shreyash Bhalerao, 21, college student
- Defined core problem: "Students need a way to know when their bus is coming so they don't miss class or waste time waiting at stops"

**Stage 3 — Ideate**
- Brainstormed product features from user pain points
- Used MoSCoW prioritization to rank features
- Applied INVEST checklist to validate user stories

**Stage 4 — Prototype**
- Built TransitGo landing page (current progress)
- UI mockup of live tracking screen in phone format

**Stage 5 — Test**
- Plan: User testing with PMPML commuters
- Measuring: Time to find a route, ticket booking flow, notification response time

---

## 📋 User Stories & Agile Planning (Assignment 7)

**Format:** As a [user], I want [goal], so that [benefit]  
**Methodology:** Jira-based sprint planning with Story Points (Fibonacci scale)  
**Team Velocity:** 20 story points per sprint

### Sample User Stories:

| ID | User Story | Acceptance Criteria | MoSCoW | Story Points | Sprint |
|----|-----------|---------------------|--------|-------------|--------|
| US-01 | As a daily commuter, I want to search bus routes by entering source and destination, so that I can find the right bus quickly | Route results appear < 5 sec; shows bus number, stops, and fare | Must | 5 | Sprint 1 |
| US-02 | As a student, I want to see live bus location on a map, so that I know exactly when to leave home | Map updates every 30 sec; shows ETA at my stop | Must | 8 | Sprint 1 |
| US-03 | As a commuter, I want to book a ticket digitally and pay via UPI, so that I don't need to carry cash | Ticket generated as QR; payment confirmed in < 10 sec | Must | 5 | Sprint 2 |
| US-04 | As a passenger, I want to receive push notifications for delays, so that I can plan accordingly | Notification sent within 60 sec of delay detection | Should | 3 | Sprint 2 |
| US-05 | As a transport authority, I want to see passenger load data per route, so that I can optimize bus frequency | Dashboard shows real-time load % per bus | Could | 8 | Sprint 3 |

---

## 🧱 Technical Architecture (Planned)

### Frontend (App)
- **Framework:** React Native (cross-platform iOS + Android) OR Flutter
- **Web Version:** React.js
- **Maps:** Google Maps API / OpenStreetMap + Leaflet.js
- **UI:** Custom design system (dark mode, glassmorphism)

### Backend
- **API:** Node.js + Express REST API
- **Database:** PostgreSQL (routes, schedules) + Redis (real-time data caching)
- **Auth:** JWT-based authentication
- **Real-time:** WebSockets for live bus location updates

### APIs & Integrations
| Service | Purpose |
|---------|---------|
| GPS / PMPML Data API | Real-time bus location data |
| Google Maps API | Route rendering, geocoding |
| Razorpay / UPI API | Digital ticket payment |
| Firebase Cloud Messaging | Push notifications |
| AWS / Google Cloud | Hosting and backend infrastructure |

### Data Flow
```
PMPML GPS Buses → Backend Server → WebSocket → User App (Live Map)
User → Search Route → Backend API → Database Query → Route Results
User → Book Ticket → Payment Gateway → Generate QR → Email/App Notification
```

---

## 📁 Current Project Files

```
D:/VIT/TY/DTPLM/
├── TransitGo/                          ← Main project folder
│   ├── index.html                      ← Landing page (BUILT ✅)
│   ├── style.css                       ← Design system (BUILT ✅)
│   ├── script.js                       ← Interactions (BUILT ✅)
│   └── PROJECT.md                      ← This file
│
├── Assignment1_public_transport_empathy_map.pdf    ← Empathy Map (A1)
├── Assignment2_Roll_no_45_PLM_CSAI_A_Batch_2.pdf  ← PLM Concepts (A2)
├── Assignment_4_45_B2_DTPLM.pdf                   ← PDLC Model Selection (A4)
├── Assignment_5_45_B2_DTPLM.pdf                   ← Extended PDLC (A5)
├── Assignment_6_45_B2_DTPLM.pdf                   ← Requirements (A6)
├── Assignment_7_Jira_UserStory_Backlog_SprintPlanning.pdf  ← Jira Sprint Plan (A7)
├── Tutorial_3_CSAI_A_B2_45.pdf                    ← Tutorial 3 submission
├── Tutorial 2.docx                                ← User Persona
├── Test 1.docx                                    ← Design Thinking exam paper
└── Que.72736pg9keTutorial_Jira_UserStory_Backlog_SprintPlanning.docx ← Jira tutorial
```

---

## 🚀 What Needs to Be Built Next

### Immediate (to show professor):
- [x] Landing page (TransitGo branding, hero, features, roadmap, team) ✅
- [ ] Route search screen (interactive UI)
- [ ] Bus schedule/timetable screen
- [ ] Live tracking map screen (with simulated bus data)

### For MVP (Increment 1 + 2):
- [ ] Route search backend API
- [ ] PMPML bus route database (seeded data)
- [ ] Google Maps integration with bus markers
- [ ] Basic user login/register
- [ ] Push notification setup

### For Full Product:
- [ ] Payment integration (Razorpay/UPI)
- [ ] Real-time GPS integration
- [ ] AI crowd prediction model
- [ ] Transport authority admin dashboard

---

## 📊 MoSCoW Feature Prioritization

| Priority | Features |
|----------|---------|
| **Must Have** | Route search, bus schedules, live tracking, user login |
| **Should Have** | Digital tickets, UPI payment, delay notifications |
| **Could Have** | Crowd prediction, saved routes, trip history, ratings |
| **Won't Have (now)** | Multi-city support, metro/auto integration, social features |

---

## 🔑 Key Design Decisions

1. **Dark mode by default** — Commuters check phones in all lighting conditions; dark mode is easier on the eyes
2. **Pune-first, PMPML-specific** — We are not trying to build for all cities; deep integration with one system first
3. **UPI-first payments** — 95% of our target users (students, young commuters) use UPI daily
4. **Offline-first route data** — Basic schedule info works offline; live tracking requires internet
5. **Under 3 seconds load time** — Many PMPML stops have weak connectivity; app must be fast and lightweight

---

## 📎 How to Use This Document

### For Teammates:
Read sections: User Persona, Problem Statement, MVP, Roadmap, User Stories

### For AI Chatbots / Developers:
Provide this entire file as context. Key things to know:
- Product = TransitGo (public transport app for Pune PMPML buses)
- Team = Shreyash, Sarvesh, Chetan, Aditya (VIT students)
- Course = DTPLM (Design Thinking + PLM)
- MVP = Route search + Live tracking (Increments 1 & 2)
- PDLC = Incremental Development Model (5 increments total)
- Current build = Landing page only (index.html, style.css, script.js)
- Stack planned = React Native / Flutter + Node.js + Google Maps + Firebase
- City = Pune | Bus network = PMPML

---

*Last updated: September 2026 | TransitGo v0.1 — Landing Page*
