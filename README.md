# TechSpark Multi-Language Compiler

## Overview

TechSpark is a web-based multi-language compiler that allows users to write, compile, and execute programs in Python, C, C++, and Java through a modern browser interface. The application uses Flask as the backend, Monaco Editor for code editing, and Docker containers to execute programs in an isolated environment.

## Features

- Multi-language support
  - Python
  - C
  - C++
  - Java
- Monaco Editor integration
- Syntax highlighting
- Auto indentation
- Language switching
- Standard input handling
- Compilation error reporting
- Runtime error reporting
- Execution timeout
- Docker-based code execution
- Automatic cleanup of temporary files
- Responsive user interface

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript
- Monaco Editor

### Backend
- Python
- Flask
- Flask-CORS

### Containerization
- Docker

### Languages Supported
- Python 3.13
- GCC (C)
- G++ (C++)
- Eclipse Temurin JDK 21 (Java)

---

## Project Structure

```
TechSpark/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── app.py
│   ├── executor.py
│   └── requirements.txt
│
├── temp/
│
├── docker-compose.yml
│
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/bhuvaneswari38/TechSpark_Compiler.git
```

### 2. Navigate to the project

```bash
cd TechSpark
```

### 3. Install Python dependencies

```bash
pip install -r backend/requirements.txt
```

### 4. Install Docker Desktop

Download and install Docker Desktop.

Ensure Docker is running before starting the application.

### 5. Pull the required Docker images

```bash
docker pull python:3.13
docker pull gcc:latest
docker pull eclipse-temurin:21
```

### 6. Start the Flask server

```bash
cd backend
python app.py
```

### 7. Open the frontend

Open `frontend/index.html` in your browser.

---

## How It Works

1. The user writes code in the Monaco Editor.
2. The selected language and source code are sent to the Flask backend.
3. The backend creates a temporary working directory.
4. The source file is generated.
5. The code is compiled (for C, C++, and Java).
6. The program executes inside a Docker container.
7. Standard input is provided if required.
8. Output or errors are returned to the frontend.
9. Temporary files are automatically deleted after execution.

---

## Supported Languages

| Language | Compilation Required |
|-----------|----------------------|
| Python | No |
| C | Yes |
| C++ | Yes |
| Java | Yes |

---

## Future Enhancements

- JavaScript support
- File upload and download
- Dark and light themes
- Code sharing
- Execution statistics
- User authentication
- AI-assisted code suggestions
- Additional programming languages

---

## License

This project is developed for educational and learning purposes.
