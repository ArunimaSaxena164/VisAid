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

fields = []
current_index = 0


@app.post("/form-loaded")
async def form_loaded(data: dict):

    global fields, current_index

    fields = data.get("fields", [])

    current_index = 0

    if not fields:
        return {"action": "none"}

    return {
        "action": "speak",
        "text": f"Form detected on this page. Please say your {fields[0]['label']}"
    }


@app.post("/voice-input")
async def voice_input(data: dict):

    global fields, current_index

    user_text = data.get("text")

    if current_index >= len(fields):
        return {
            "action": "speak",
            "text": "All fields are already filled."
        }

    field = fields[current_index]

    response = {
        "action": "fill",
        "field": field["name"],
        "value": user_text
    }

    current_index += 1

    if current_index < len(fields):

        response["next"] = f"Please say your {fields[current_index]['label']}"

    else:

        response["next"] = "All fields filled."

    return response