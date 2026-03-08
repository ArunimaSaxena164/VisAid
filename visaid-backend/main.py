from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llm_service import analyze_fields, extract_pdf_text, match_pdf_to_fields

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class FormData(BaseModel):
    fields: list

class VoiceInput(BaseModel):
    text: str

class PDFFormData(BaseModel):
    pdf_base64: str
    fields: list

semantic_fields = []
current_index = 0


@app.post("/form-loaded")
def form_loaded(data: FormData):

    global semantic_fields
    global current_index

    current_index = 0

    semantic_fields = analyze_fields(data.fields)

    if not semantic_fields:
        return {
            "action": "none",
            "message": "I could not understand the form fields from AI response. Please try again."
        }

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


@app.post("/pdf-fill")
def pdf_fill(data: PDFFormData):

    pdf_text = extract_pdf_text(data.pdf_base64)

    if not pdf_text.strip():
        return {"action": "none", "message": "Could not extract text from PDF."}

    fills = match_pdf_to_fields(pdf_text, data.fields)

    if not fills:
        return {"action": "none", "message": "Could not match PDF content to form fields."}

    return {
        "action": "fill_all",
        "fills": fills
    }