# from fastapi import FastAPI
# from pydantic import BaseModel
# from llm_service import analyze_fields

# app = FastAPI()

# class FormData(BaseModel):
#     fields: list

# class VoiceInput(BaseModel):
#     text: str

# semantic_fields = []
# current_index = 0


# @app.post("/form-loaded")
# def form_loaded(data: FormData):

#     global semantic_fields
#     global current_index

#     current_index = 0

#     semantic_fields = analyze_fields(data.fields)

#     if not semantic_fields:
#         return {"action": "none"}

#     return {
#         "action": "speak",
#         "text": semantic_fields[0]["spoken_prompt"]
#     }


# @app.post("/voice-input")
# def voice_input(data: VoiceInput):

#     global current_index

#     field = semantic_fields[current_index]["name"]

#     response = {
#         "action": "fill",
#         "field": field,
#         "value": data.text
#     }

#     current_index += 1

#     if current_index < len(semantic_fields):

#         response["next"] = semantic_fields[current_index]["spoken_prompt"]

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
    global semantic_fields

    if current_index >= len(semantic_fields):
        return {
            "action": "speak",
            "text": "All fields completed."
        }

    field = semantic_fields[current_index]["name"]

    response = {
        "action": "fill",
        "field": field,
        "value": data.text
    }

    current_index += 1

    if current_index < len(semantic_fields):

        response["next"] = semantic_fields[current_index]["spoken_prompt"]

    else:

        response["next"] = "All fields are filled. Do you want to submit the form? Say yes or no."
        response["submit_prompt"] = True

    return response