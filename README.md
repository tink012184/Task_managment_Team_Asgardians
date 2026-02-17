# 📌 Task Management System

### Team Asgardians

Bellevue University – Web Development

---

## 📖 Project Overview

The Task Management System is a full-stack web application designed to help individuals and teams manage projects and tasks efficiently. The system allows users to create, read, update, delete, and search tasks and projects while enforcing required business rules and database constraints.

This project is built incrementally over four weeks. Each team member is responsible for implementing at least one API and one Angular component per week, along with a minimum of three unit tests for each.

---

## 👥 Team Members

- Melissa Lutz – Student A
- Leslie K - Student B
- Christopher - Student C

---

## 🛠️ Tech Stack

### Frontend

- Angular (Standalone Components)
- TypeScript
- SCSS
- Angular HttpClient
- Jasmine & Karma for unit testing

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Jest & Supertest for API testing

---

## 🗂️ Project Structure

Task_Management_Team_Asgardians/

- task-management-client/ (Angular Frontend)
  - src/app/features/tasks/
  - src/app/features/projects/

- server/ (Express Backend)
  - routes/
  - controllers/
  - models/
  - tests/
  - server.js

---

## 📊 Database Design

### Tasks Collection

- \_id
- title (must be unique)
- description
- status ("Pending", "In Progress", "Completed")
- priority ("Low", "Medium", "High")
- dueDate
- dateCreated
- dateModified
- projectId (references Projects collection)

### Projects Collection

- \_id
- projectId
- name
- description
- startDate
- endDate
- dateCreated
- dateModified

---

## 📌 Business Rules

- A task belongs to one project.
- A project can have many tasks.
- Task title must be unique.
- Task status must be one of:
  - Pending
  - In Progress
  - Completed
- Task priority must be one of:
  - Low
  - Medium
  - High
- Project startDate must be a valid date.
- Project endDate (if provided) must be after startDate.

---

## 🚀 Installation Instructions

### Clone the Repository

git clone <your-repository-url>  
cd Task_Management_Team_Asgardians

---

### Install and Run Frontend

cd task-management-client  
npm install  
ng serve

Frontend runs at:  
http://localhost:4200

---

### Install and Run Backend

cd server  
npm install  
npm run dev

Backend runs at:  
http://localhost:3000

---

## 🧪 Running Tests

### Angular Unit Tests

ng test

### API Unit Tests

npm test

---

## 📅 Weekly Breakdown

### Week 1

- Student A:
  - Create Task API (3 unit tests)
  - Create Task Angular Component (3 unit tests)
- Student B:
  - Read Task by ID API + Component
- Student C:
  - List All Tasks API + Component

### Week 2

- Update / Delete / Search Tasks

### Week 3

- Create / Read / List Projects

### Week 4

- Update / Delete / Search Projects

---

## 🎯 Current Status

✔ Angular workspace initialized  
✔ Express server initialized  
✔ Base folder structure created  
✔ Student A Week 1 scaffolding completed

---

## 📎 Academic Project Notice

This project was developed as part of the Bellevue University Web Development program and is intended for educational purposes.
