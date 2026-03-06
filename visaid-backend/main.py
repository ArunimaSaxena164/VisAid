# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# fields = []
# current_index = 0


# @app.post("/form-loaded")
# async def form_loaded(data: dict):

#     global fields, current_index

#     fields = data.get("fields", [])

#     current_index = 0

#     if not fields:
#         return {"action": "none"}

#     return {
#         "action": "speak",
#         "text": f"Form detected on this page. Please say your {fields[0]['label']}"
#     }


# @app.post("/voice-input")
# async def voice_input(data: dict):

#     global fields, current_index

#     user_text = data.get("text")

#     if current_index >= len(fields):
#         return {
#             "action": "speak",
#             "text": "All fields are already filled."
#         }

#     field = fields[current_index]

#     response = {
#         "action": "fill",
#         "field": field["name"],
#         "value": user_text
#     }

#     current_index += 1

#     if current_index < len(fields):

#         response["next"] = f"Please say your {fields[current_index]['label']}"

#     else:

#         response["next"] = "All fields filled."

#     return response
from fastapi import FastAPI
from pydantic import BaseModel
from llm_service import analyze_fields

app = FastAPI()

class FormData(BaseModel):
    fields: list

class VoiceInput(BaseModel):
    text: str

semantic_fields = []
current_index = 0


@app.post("/form-loaded")
def form_loaded(data: FormData):

    global semantic_fields
    global current_index

    current_index = 0

    semantic_fields = analyze_fields(data.fields)

    if not semantic_fields:
        return {"action": "none"}

    return {
        "action": "speak",
        "text": semantic_fields[0]["spoken_prompt"]
    }


@app.post("/voice-input")
def voice_input(data: VoiceInput):

    global current_index

    field = semantic_fields[current_index]["name"]

    response = {
        "action": "fill",
        "field": field,
        "value": data.text
    }

    current_index += 1

    if current_index < len(semantic_fields):

        response["next"] = semantic_fields[current_index]["spoken_prompt"]

    return response