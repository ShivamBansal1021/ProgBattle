
# ProgBattle – Bot Programming Tournament Platform

**ProgBattle** is a full-stack competitive coding platform where participants write Python bots, run matches against a system bot, and climb the leaderboard.



##  Project Structure

```
ProgBattle/
├── backend/                   # Flask + MongoDB API
│   ├── app.py                 # REST API routes
│   ├── config.py              # DB config
│   ├── models.py              # MongoEngine models
│   ├── engine.py              # Match engine
│   ├── bot1.py                # System bot
│   ├── static/uploads/        # Uploaded bot files
│
├── frontend/                  # Next.js (App Router) + Tailwind
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── code-editor/
│   │   ├── submissions/
│   │   ├── match-logs/
│   │   └── leaderboard/
│   ├── components/Navbar.tsx
│   ├── styles/globals.css
│   ├── tailwind.config.js
|   
│
└── README.md
```


##  Features

| Feature                     | Description                                                                 | Tech / Module Used                                |
|-----------------------------|-----------------------------------------------------------------------------|---------------------------------------------------|
| **Auth & Team Management**  | Register/login, team creation & joining, max size limit                     | Flask, MongoEngine                                |
| **Bot Upload**              | Upload `.py` bot file                                                       | Flask `request.files`, `secure_filename`          |
| **Code Editor**             | In-browser code editing & resubmission                                      | `@monaco-editor/react`, React hooks               |
| **Submission Save**         | Save code with hourly submission limit                                     | Flask, MongoEngine, timestamp logic               |
| **Match Execution**         | Run match vs system bot using Python engine                                | Python `subprocess.run()`                         |
| **Scoring Strategy**        | Parse winner from match log, update score accordingly                       | Python `re`, match log analysis                   |
| **Match Logs**              | View full stdout logs of each match                                        | MatchLog model in MongoDB                         |
| **Submission History**      | View past submissions with time & code                                     | Submission model, fetched via Flask route         |
| **Leaderboard**             | Ranks teams by score for Round 1                                           | MongoEngine sorting, Flask route `/leaderboard`   |

>  **Note**: Round 2 (top 16 team battle simulation) is not implemented due to time constraints. Only Round 1 leaderboard is active.

---

##  Tech Stack

| Layer      | Stack                            |
|------------|----------------------------------|
| Frontend   | Next.js, TypeScript, TailwindCSS |
| Backend    | Flask, MongoEngine, Flask-CORS   |
| Editor     | Monaco Editor (via `@monaco-editor/react`) |
| Database   | MongoDB                          |
| Execution  | Python subprocess + `engine.py`  |

---

##  Setup Instructions

###  Requirements

- Python
- Node.js
- MongoDB running locally (`localhost:27017`)

### Running mongoDB
open local terminal and run
```bash
mongosh
```

###  Backend

```bash
python3 -m venv venv
source venv/bin/activate # To activate virtual environment
pip install -r requirements.txt # Installing required modules
cd backend
python3 app.py # Runs the backend server
```
> Runs at: `http://127.0.0.1:5000`

###  Frontend

```bash
cd frontend
npm install
npm run dev
```

> Runs at: `http://localhost:3000`

---


## Scoring Strategy

- User bot is passed as `--p1` → internally named `bot1`
- Log output line: `Winner: bot1`
- If `bot1` wins → **+10 points**
- If `bot2` (system bot) wins → **0 points**
- Parsed from `stdout` using regex

---

##  Sample Match Log

```
Point to bot1! Score: {'bot1': 4, 'bot2': 2}
Final Score: {'bot1': 5, 'bot2': 2}
Winner: bot1
```

---

##  Notes

- All submissions, matches, and logs are persisted in MongoDB
- Uploads stored in `static/uploads`
- Submission limits enforced via timestamps
- Round 1 fully implemented; Round 2 logic to be added later