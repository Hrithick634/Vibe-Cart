# 👜 CarryHub

**CarryHub** is an online platform for users to **buy and sell bags** seamlessly.  
It provides product listings, secure authentication, and an intuitive owner dashboard — all powered by Node.js, Express, MongoDB, and EJS.

🌐 **Live Demo:** [carryhub.onrender.com](https://carryhub.onrender.com)

---

## 🚀 Tech Stack

- **Node.js** – Backend runtime
- **Express.js** – Web framework
- **MongoDB (Atlas)** – Database
- **EJS** – Templating engine
- **Tailwind CSS** – Styling
- **Multer** – File upload handling
- **JWT (JSON Web Tokens)** – Secure authentication
- **Express-Session + Connect-Flash** – Flash messages & session support

---

## ✨ Features

- 👤 **User Authentication** – Login & signup using JWT tokens  
- 👜 **Product Management** – Create, view, and delete bag listings  
- 🖼️ **Image Uploads** – Uses Multer for handling images  
- 💼 **Owner Dashboard** – Manage your own uploaded products  
- 🔒 **Secure Routes** – Access control for users and owners  
- ⚡ **Flash Messages** – Interactive UI feedback for user actions  
- 📦 **Dynamic EJS Pages** – Server-rendered, fast, and responsive  
- 🛍️ **Sorting & Filtering** – Explore collections and discounted products easily  

---

## 🗂️ Folder Structure

CarryHub/ │ ├── config/ # Database & configuration files ├── controllers/ # Business logic and API handling ├── middlewares/ # Auth and other middleware ├── models/ # Mongoose schemas ├── routes/ # Express routes ├── public/ # Static files ├── utils/ # Helper functions ├── views/ # Frontend views or templates ├── app.js # Main application file └── .env # Environment variables (ignored in Git)

Setup
Clone the Repository

git clone https://github.com/Hrithick634/Vibe-Cart.git
cd CarryHub
Install Dependencies

npm install
Configure Environment Variables

Start the Server

node app.js
http://localhost:3000