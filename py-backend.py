from fastapi import FastAPI, File, UploadFile
import torch
import open_clip
import cv2
import requests
import json
from PIL import Image
from ultralytics import YOLO
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import io
import numpy as np
import os

# Securely fetch OpenAI API key from environment variables
OPENAI_API_KEY = "Add a openAI API Key"

# Load YOLOv8 model
yolo_model = YOLO("yolov8n.pt")

# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model, _, preprocess = open_clip.create_model_and_transforms("ViT-B-32", pretrained="laion2b_s34b_b79k")
tokenizer = open_clip.get_tokenizer("ViT-B-32")  # Define tokenizer before use

app = FastAPI()

# Restrict CORS for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "https://yourfrontend.com"],  # Restrict to known frontends
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

# Function to generate text using OpenAI API with better error handling
def generate_text(prompt):
    url = "https://api.openai.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    data = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.4
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        return result.get("choices", [{}])[0].get("message", {}).get("content", "No response from AI.")
    except requests.RequestException as e:
        return f"Error in AI response: {str(e)}"

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

@app.post("/analyze-image/")
async def analyze_image(file: UploadFile = File(...)):
    try:
        # print("file in PY code:", file)

        # Read uploaded image
        image_bytes = await file.read()
        image_pil = Image.open(io.BytesIO(image_bytes))
        
        # Convert image for OpenCV (cv2)
        image_array = np.frombuffer(image_bytes, np.uint8)
        image_cv2 = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        image_cv2 = cv2.cvtColor(image_cv2, cv2.COLOR_BGR2RGB)  # Convert to RGB

        # YOLO Object Detection
        results = yolo_model(image_cv2)
        yolo_objects = set()
        for result in results:
            for box in result.boxes:
                if hasattr(yolo_model.model, "names"):
                    yolo_objects.add(yolo_model.model.names[int(box.cls)])  # Ensure names attribute exists

        # Convert image for CLIP
        image_clip = preprocess(image_pil).unsqueeze(0).to(device)

        # Scene categories
        scene_labels = [
            "natural scene", "city", "ocean", "forest", "desert", "mountain", 
            "sunset", "beach", "snowy landscape", "rural area", "lake", "park",
            "urban landscape", "tropical rainforest", "countryside", "waterfall", "office"
        ]

        # CLIP Scene Classification
        with torch.no_grad():
            image_features = clip_model.encode_image(image_clip)
            text_features = clip_model.encode_text(tokenizer(scene_labels))
            similarity = (image_features @ text_features.T).softmax(dim=-1)
            scene_label = scene_labels[similarity.argmax().item()]

        # Prepare prompts for AI-generated descriptions
        objects_str = ", ".join(yolo_objects) if yolo_objects else "an unknown object"
        chatgpt_prompt_paragraph = f"Write a short paragraph about {objects_str} in a {scene_label}."
        chatgpt_prompt_poem = f"Write a short poem about {objects_str} in a {scene_label}."

        print("objects_str:", objects_str)
        print("scene_label", scene_label)

        # Generate AI descriptions
        paragraph = generate_text(chatgpt_prompt_paragraph)
        poem = generate_text(chatgpt_prompt_poem)

        return {
            "objects": list(yolo_objects),
            "scenery": scene_label,
            "description": paragraph,
            "poem": poem
        }

    except Exception as e:
        return {"error": f"Failed to process image: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
