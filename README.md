
========================================================================
       PROJECT: THE DENTAL X-RAY OBJECT DETECTION SYSTEM
========================================================================
Author: SAURAV RAJ (23SCSE1012224)
College: Galgotias University
========================================================================

1. PROJECT DESCRIPTION
----------------------
This is an AI-driven medical assistant designed to identify dental 
structures in panoramic X-rays. It uses YOLOv8 for detection, 
FastAPI for the backend, and React for the frontend dashboard.

2. CORE FEATURES
----------------
- Automatic detection of 7 tooth categories (Molars, Incisors, etc.).
- Fast processing speed (0.42 seconds).
- Side-by-side comparison of original and AI-detected images.
- Automated PDF report generation with patient details.

3. TECH STACK
-------------
- Frontend: React.js (Vite)
- Backend:  FastAPI (Python)
- AI Model: YOLOv8
- Libraries: OpenCV, Axios, jsPDF, html2canvas

4. HOW TO RUN
-------------

STEP 1: START BACKEND
- Open a terminal in the backend folder.
- Install requirements: pip install fastapi uvicorn ultralytics opencv-python-headless python-multipart
- Run: python -m uvicorn app:app --reload

STEP 2: START FRONTEND
- Open a terminal in the frontend folder.
- Install dependencies: npm install
- Run: npm run dev

5. SYSTEM USAGE
---------------
1. Open http://localhost:5173/ in your browser.
2. Select a Dental X-ray image (PNG/JPG).
3. Click "Run Diagnosis" to see AI results.
4. Enter patient name and click "Download PDF" for the report.

========================================================================
