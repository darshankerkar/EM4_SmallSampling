# Instructions to Run Locally

## 1. Start the Backend

Open a terminal and navigate to the backend directory:
```bash
cd backend
```

Install the required Python packages:
```bash
pip install -r requirements.txt
```

Run the FastAPI server using Uvicorn:
```bash
uvicorn app:app --reload --port 8000
```
*The backend API will be available at http://localhost:8000*


## 2. Start the Frontend

GO TO WINDOWS POWERSHELL AND RUN THE FOLLOWING COMMANDS:

```bash
winget install OpenJS.NodeJS.LTS
```

Open a second terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install all Node dependencies (if you haven't already):
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The React application will be available at http://localhost:5173 (or another port specified by Vite).*


## 3. Usage
1. Open the frontend URL in your browser.
2. The initial 10 students will be loaded automatically via the backend regression model.
3. For each student, enter your guess for their EndSem marks (between 0-100) based on their features.
4. Click the "Run Paired t-Test Analysis" button.
5. Below the table, you will see exactly how the manual t-test was constructed, the final t-value, p-value logic, a comparison table, and Chart.js graphs tracking the errors.
