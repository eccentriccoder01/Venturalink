<div align="center"><img src="V.png" style="width: 220px; height: 220px;" /></div>

# <div align="center">Venturalink</div>

**Venturalink** is a full-stack web application designed to bridge the gap between investors and entrepreneurs in India. It empowers business owners with bold ideas to connect directly with potential investors through a clean, interactive, role-based dashboard. The platform acts as a private venture marketplace that promotes smart capital allocation, innovation, and growth.

---

## 🇮🇳 The Vision: A Bridge Between Capital and Innovation

Venturalink is driven by the core mission of addressing a crucial challenge in the Indian startup ecosystem:

- Entrepreneurs and investors lack a unified, trustworthy platform to discover each other.
- Instead of idle funds being stored in banks or gold, users can now invest directly in promising ventures.
- Business and investor portals are customised to their needs, with distinct tools and workflows.
- From proposal submission to activity history, everything is real-time, organized, and secure.
- Think of Venturalink as a “startup meet capital” engine, with messaging, analytics, and decision-enabling visuals.

---
## 🚀 Live Demo

Experience Venturalink live here: 
👉 [![**Venturalink**](https://img.shields.io/badge/View-Live%20Demo-orange?style=for-the-badge)](https://venturalink.vercel.app/)

 <div align="center">
 <p>

[![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat)
![Visitors](https://api.visitorbadge.io/api/Visitors?path=eccentriccoder01%2FVenturalink%20&countColor=%23263759&style=flat)
![GitHub Forks](https://img.shields.io/github/forks/eccentriccoder01/Venturalink)
![GitHub Repo Stars](https://img.shields.io/github/stars/eccentriccoder01/Venturalink)
![GitHub Contributors](https://img.shields.io/github/contributors/eccentriccoder01/Venturalink)
![GitHub Last Commit](https://img.shields.io/github/last-commit/eccentriccoder01/Venturalink)
![GitHub Repo Size](https://img.shields.io/github/repo-size/eccentriccoder01/Venturalink)
![Github](https://img.shields.io/github/license/eccentriccoder01/Venturalink)
![GitHub Issues](https://img.shields.io/github/issues/eccentriccoder01/Venturalink)
![GitHub Closed Issues](https://img.shields.io/github/issues-closed-raw/eccentriccoder01/Venturalink)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/eccentriccoder01/Venturalink)
![GitHub Closed Pull Requests](https://img.shields.io/github/issues-pr-closed/eccentriccoder01/Venturalink)
 </p>
 </div>

## 📸 Screenshots

<div align="center"><img src="App.png"/></div>

---

## 🌟 Core Features

### 🔐 Authentication & Role Management
- Firebase Authentication with session management.
- Users are assigned roles: `Investor`, `Entrepreneur` (currently only 2).
- Post-login redirection and dynamic dashboards based on user roles.

### 🧑‍💼 Entrepreneur Dashboard
- Create and manage business proposals.
- Showcase ideas with title, pitch, and required capital.
- View status of investor interest and update proposals.
- Launch proposal modals using a classy UI with animated transitions.

### 💰 Investor Dashboard
- Explore a dynamic list of proposals from verified entrepreneurs.
- Search, filter, and sort opportunities based on amount or domain.
- View key stats like active investments, unread messages, and total invested.

### 📊 Analytics & Activity
- Track proposal performance, success rate, and engagement.
- Visuals via charts and cards to show user stats.
- Real-time updates on proposal history and messages.

### 💬 Messaging System
- Placeholder for future in-app chat between investors and businesses.

---

## 🛠️ Technology Stack

### Frontend

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-FFD600?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-yellow?style=for-the-badge)

### Backend & Database

![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Firestore](https://img.shields.io/badge/Firestore-FFA000?style=for-the-badge&logo=firebase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?style=for-the-badge&logo=vercel)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/eccentriccoder01/venturalink.git
cd venturalink
````

### 2. Install Dependencies

Each folder (`public`, `scripts`, etc.) is client-side. You can serve the project using any local server (e.g. `Live Server` in VSCode or Python's HTTP server):

```bash
npx live-server .
```

### 3. Configure Firebase

Update `firebase.js` with your Firebase config:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Make sure your Firestore has a `users` collection with documents having `userType` fields (`investor` or `business`).

-----

## 🚧 Roadmap & Future Enhancements

* [ ] In-app messaging between users.
* [ ] Rating and feedback for investors and businesses.
* [ ] Advisor dashboard & matchmaking system.
* [ ] Email/notification alerts for proposal interest.
* [ ] Deep analytics for performance over time.

---

## Issue Creation ✴

Report bugs and issues or propose improvements through our GitHub repository's "Issues" tab.

## Contribution Guidelines 📑

- Firstly Star(⭐) the Repository
- Fork the Repository and create a new branch for any updates/changes/issue you are working on.
- Start Coding and do changes.
- Commit your changes
- Create a Pull Request which will be reviewed and suggestions would be added to improve it.
- Add Screenshots and updated website links to help us understand what changes is all about.

- Check the [CONTRIBUTING.md](CONTRIBUTING.md) for detailed steps...

## Contributing is fun🧡

We welcome all contributions and suggestions!
Whether it's a new feature, design improvement, or a bug fix - your voice matters 💜

Your insights are invaluable to us. Reach out to us team for any inquiries, feedback, or concerns.

## 📄 License

This project is open-source and available under the MIT License.

## 📞 Contact

Developed by [Eccentric Explorer](https://eccentriccoder01.github.io/Me)

Feel free to reach out with any questions or feedback\!