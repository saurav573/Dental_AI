from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
from PIL import Image
import io
import base64

app = FastAPI()

# FIX: Explicitly allow the ports your app is actually using
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup
model = YOLO("best.pt")

@app.post("/predict")
async def predict_teeth(file: UploadFile = File(...)):
    try:
        # Read file
        request_object_content = await file.read()
        img = Image.open(io.BytesIO(request_object_content))
        
        # Run AI
        results = model.predict(source=img, conf=0.7)
        
        # Plot result
        res_plotted = results[0].plot()
        _, buffer = cv2.imencode('.jpg', res_plotted)
        img_str = base64.b64encode(buffer).decode('utf-8')
        
        return {
            "findings": results[0].verbose(),
            "image": f"data:image/jpeg;base64,{img_str}"
        }
    except Exception as e:
        # This sends the ACTUAL error to the browser console
        raise HTTPException(status_code=500, detail=str(e))