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