## FastAPI Authentication Backend

This is a backend authentication service built with FastAPI that supports user registration, login, and JWT-based authentication.

# Features

* User registration with password hashing
* User login with JWT access token generation
* Protected routes using JWT authentication
* Modular project structure
* SQLite database (can be swapped with PostgreSQL/MySQL easily)

<pre>
backend/
│── app/
│   ├── main.py            # Entry point
│   ├── database.py        # Database connection & Base
│   ├── models.py          # SQLAlchemy models
│   ├── schemas.py         # Pydantic schemas (Data validation)
│   ├── auth.py            # JWT & authentication logic
│   ├── crud.py            # DB operations
│   ├── routers/           # Defines API endpoints (auth, users, protected)
│   │    ├── users.py      # Get about user
│   │    |── auth.py       # User registration & login routes
|   |    └── protected.py  # protected routes
│── requirements.txt
│── README.md
</pre>


## Installation & Setup

### 1. Clone this repository

```
git clone https://github.com/yourusername/fastapi-auth-backend.git
cd fastapi-auth-backend/backend
```

### 2. Create a virtual environment

```
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
```

### 3. Install dependencies
```
pip install -r requirements.txt
```

### 4. Run the FastAPI server

```
uvicorn main:app --reload
```

### 5. Visit API docs

Open Swagger UI: http://127.0.0.1:8000/docs

Or ReDoc: http://127.0.0.1:8000/redoc


## API Endpoints

*Auth Routes*

POST /register → Register new user

POST /login → Login and get JWT token

*Protected Routes*

GET /protected/ → Example protected route (requires JWT token in Authorization header)

## Tech Stack

* FastAPI (backend framework)

* SQLite + SQLAlchemy (database & ORM)

* JWT (JSON Web Token) (authentication)

* Pydantic (data validation)
