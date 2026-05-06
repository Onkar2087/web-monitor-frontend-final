# 🌐 Web Monitor Frontend

Frontend for the Web Monitor application.
Provides UI to track website changes, view diffs, summaries, and system health.

---

## 🚀 Features

* Add and manage URLs
* View change status
* Diff visualization
* Summary of changes
* Evidence display
* History tracking
* System health monitoring
* Responsive UI

---

## 🛠 Tech Stack

* React (Vite)
* Tailwind CSS
* Axios
* React Router
* React Hot Toast

---

## 📂 Project Structure

```
frontend/
│── pages/
│── services/
│── App.jsx
│── main.jsx
│── index.css
│── package.json
```

---

## ⚙️ Setup Instructions

### 1. Clone repo

```
git clone <frontend-repo-url>
cd frontend
```

### 2. Install dependencies

```
npm install
```

### 3. Create `.env`

```
VITE_API_URL=http://localhost:5000/api
```

### 4. Run frontend

```
npm run dev
```

---

## 🔗 Pages

| Route         | Description              |
| ------------- | ------------------------ |
| `/`           | Home page                |
| `/status/:id` | Detailed status page     |

---

## 🧠 UI Components

* **Diff View** → shows added/removed content
* **Summary** → LLM-generated explanation
* **Evidence** → key lines causing changes
* **History** → past timestamps
* **System Health** → backend + DB + LLM status

---

## ⚠️ Notes

* Requires backend to be running
* API URL must be configured correctly
* Some websites may block scraping

---

## 📌 Future Improvements

* Better diff visualization => side-by-side
* Dark mode
* User accounts
* Notifications for changes

---

## 👨‍💻 Author

Onkar Dhingra
