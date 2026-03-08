import os
import json
import re
import io
import base64
import requests
from dotenv import load_dotenv
from pypdf import PdfReader

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")


def call_groq(prompt):

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(GROQ_URL, headers=headers, json=payload)
    data = response.json()

    print("Groq response:", data)

    text = data["choices"][0]["message"]["content"]
    return text


def extract_json_array(text):

    # Remove markdown code fences if model wraps the JSON.
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?", "", cleaned).strip()
    cleaned = re.sub(r"```$", "", cleaned).strip()

    # First, try parsing the entire content directly.
    try:
        parsed = json.loads(cleaned)
        if isinstance(parsed, list):
            return parsed
        if isinstance(parsed, dict):
            if isinstance(parsed.get("fields"), list):
                return parsed["fields"]
            if isinstance(parsed.get("data"), list):
                return parsed["data"]
    except Exception:
        pass

    # Fallback: extract first JSON array from mixed text.
    json_match = re.search(r"\[.*\]", cleaned, re.DOTALL)
    if not json_match:
        return []

    try:
        parsed = json.loads(json_match.group())
        return parsed if isinstance(parsed, list) else []
    except Exception:
        return []


def analyze_fields(fields):

    prompt = f"""
You are an AI accessibility assistant designed to help visually impaired users fill web forms.

Your task is to understand what information each field expects so that the system can ask the user verbally.

The user cannot see the screen, so prompts must be extremely clear.

You will receive metadata extracted from HTML elements.

Each field may contain:

- name
- id
- label
- placeholder
- aria
- type
- pattern
- maxlength
- options (dropdown / radio / checkbox)
- page_title
- surrounding_text


========================
FIELD UNDERSTANDING RULES
========================

Use ALL available signals.

Priority order:

1. label
2. placeholder
3. aria label
4. type
5. pattern
6. name or id
7. page context


========================
PAGE CONTEXT REASONING
========================

Use page_title and surrounding_text to understand fields.

Example:

Page contains "Aadhaar", "UIDAI"

Field name: userid

Interpretation:
Aadhaar number

Page contains "PAN registration"

Pattern: ABCDE1234F

Interpretation:
PAN number


========================
COMMON PATTERN DETECTION
========================

Recognize these patterns:

XXXX XXXX XXXX → Aadhaar number

ABCDE1234F → PAN number

10 digit number → Phone number

example@email.com → Email address

date input → Date of birth

URL input → Website / GitHub / LinkedIn

6 digit number → Pincode

numeric range → Age or experience


========================
DATE HANDLING
========================

If the field expects a date, instruct the user clearly.

Example:

"Please say your date of birth. Say day month year. For example sixteen April two thousand five."

If the field type is date, ensure the spoken prompt tells the user how to say it.


========================
DROPDOWN / RADIO / CHECKBOX
========================

If the field has options:

If number of options ≤ 10

Include the options in the spoken prompt.

Example:

"Please select your gender. Options are male, female, or other."

If number of options > 10

Do NOT read them all.

Example:

"Please say your country."


========================
IMPORTANT PROMPT RULES
========================

Prompts must be natural and clear.

Good examples:

"Please say your full name"

"Please say your email address"

"Please say your Aadhaar number"

"Please say your GitHub profile link"

Bad examples:

"Please say your answer"


Never read placeholder symbols literally.

Example:

Placeholder: XXXX XXXX XXXX

Do NOT say:

"Please say X X X X"


========================
OUTPUT FORMAT
========================

Return STRICT JSON only.

Example:

[
 {{
   "name": "full_name",
   "spoken_prompt": "Please say your full name"
 }},
 {{
   "name": "gender",
   "spoken_prompt": "Please select your gender. Options are male, female or other"
 }},
 {{
   "name": "dob",
   "spoken_prompt": "Please say your date of birth. Say day month year."
 }},
 {{
   "name": "country",
   "spoken_prompt": "Please say your country"
 }}
]


========================
FIELDS TO ANALYZE
========================

{json.dumps(fields, indent=2)}

"""

    try:

        text = call_groq(prompt)
        parsed = extract_json_array(text)
        if parsed:
            return parsed
        print("Groq analyze_fields parse warning: no JSON array found")

    except Exception as e:
        print("Groq analyze_fields failed:", e)

    return []


def extract_pdf_text(pdf_base64):

    try:
        pdf_bytes = base64.b64decode(pdf_base64)
        reader = PdfReader(io.BytesIO(pdf_bytes))

        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""

        return text[:10000]

    except Exception as e:
        print("PDF extraction failed:", e)
        return ""


def match_pdf_to_fields(pdf_text, fields):

    prompt = f"""
You are an AI assistant that extracts information from a PDF document and matches it to web form fields.

You have:

1. Text extracted from a user's PDF document (could be a resume, ID card, certificate, application form, etc.)
2. A list of form fields from a web page

Your job:

- Carefully read the PDF text and identify all personal/professional information
- For each form field, check if the PDF contains a value that matches what the field expects
- Return only confident matches

========================
FIELD MATCHING RULES
========================

- Use the field's label, placeholder, name, id, type, and options to understand what it expects
- Match PDF content to fields based on semantic meaning, not just keyword overlap
- Only include a field if you are confident the PDF contains the correct value

========================
VALUE FORMAT RULES
========================

- For date fields (type "date"): return in YYYY-MM-DD format
- For email fields: return the exact email address
- For phone/mobile fields: return digits with country code if present
- For name fields: capitalize properly (e.g. "John Doe")
- For dropdown/select fields with options: return the option text that best matches
- For radio fields with options: return the option value that best matches
- For checkbox fields with options: return comma-separated matching option values
- For numeric fields (age, pincode, etc.): return digits only
- Do NOT guess or fabricate information not present in the PDF

========================
PDF TEXT
========================

{pdf_text}

========================
FORM FIELDS
========================

{json.dumps(fields, indent=2)}

========================
OUTPUT FORMAT
========================

Return STRICT JSON only.

[
  {{"field": "field_name", "value": "extracted_value"}},
  {{"field": "email", "value": "john@example.com"}},
  {{"field": "dob", "value": "1995-04-16"}}
]

If no fields can be matched, return: []
"""

    try:

        text = call_groq(prompt)
        parsed = extract_json_array(text)
        if parsed:
            return parsed
        print("Groq PDF matching parse warning: no JSON array found")

    except Exception as e:
        print("Groq PDF matching failed:", e)

    return []