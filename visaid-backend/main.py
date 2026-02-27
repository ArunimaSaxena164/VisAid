# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List, Any

# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Store latest form state
# latest_data = {}

# class FormData(BaseModel):
#     url: str
#     title: str
#     forms: List[Any]
#     fields_count: int
#     errors: List[str]

# @app.post("/live-form")
# async def receive_form(data: dict):
#     global latest_data
#     latest_data = data

#     print("\n===== NEW FORM UPDATE =====")
#     print("URL:", data.get("url"))
#     print("Title:", data.get("title"))
#     print("Fields count:", data.get("fields_count"))
#     print("Errors:", data.get("errors"))

#     return {"status": "received"}

# # NEW ENDPOINT TO VIEW DATA
# @app.get("/debug")
# async def debug_view():
#     return 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

latest_data = {}

@app.post("/form-loaded")
async def form_loaded(data: dict):
    global latest_data

    html = data.get("html")

    if not html:
        return {"action": "none"}

    latest_data = {
        "html_snapshot": html[:2000]  # limit for debug
    }

    return {
        "action": "speak",
        "text": "Form detected. Let's begin."
    }


@app.post("/voice-input")
async def voice_input(data: dict):
    return {"action": "none"}


@app.get("/debug")
async def debug():
    return latest_data