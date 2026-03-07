# import os
# import json
# import requests
# from dotenv import load_dotenv

# load_dotenv()

# GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# URL = "https://api.groq.com/openai/v1/chat/completions"


# def analyze_fields(fields):

# #     prompt = f"""
# # You are an AI accessibility assistant helping blind users fill web forms.

# # Understand what each field expects.

# # Return JSON only.

# # Example output:

# # [
# #  {{
# #    "name": "field_name",
# #    "spoken_prompt": "Please say your full name"
# #  }}
# # ]

# # Fields:
# # {json.dumps(fields, indent=2)}
# # """
#     prompt = f"""
# You are an AI accessibility assistant helping blind users fill web forms.

# Your job is to determine what information each input field expects so the system can ask the user verbally.

# The user is visually impaired, so the spoken prompt must clearly describe what information they should say.

# You will receive metadata extracted from HTML input elements.

# Each field may include:

# - name
# - id
# - label
# - placeholder
# - aria label
# - type
# - pattern
# - maxlength
# - page_title
# - surrounding_text

# Use ALL available context to infer the true meaning of the field.

# Important reasoning rules:

# 1. Page context matters. If page_title or surrounding_text contains words like Aadhaar, UIDAI, PAN, passport, etc, use that to interpret fields.
# 2. Do NOT trust field names alone (for example uid, id, userid may actually mean Aadhaar number).
# 3. Placeholders are often the most accurate indicator of expected input.
# 4. Patterns can reveal meaning:
#    - XXXX XXXX XXXX → Aadhaar Number
#    - ABCDE1234F → PAN Number
#    - DD/MM/YYYY → Date of Birth
#    - 10 digits → Phone Number
#    - example@email.com → Email
# 5. If multiple options exist (dropdown or radio), ask the user to choose from the available options.
# 6. Spoken prompts must be natural and clear for blind users.
# 7. Never read placeholder symbols literally (do NOT say "X X X X").

# Examples:

# Input metadata:
# placeholder: "Enter Aadhaar number"

# Output:
# "Please say your Aadhaar number"

# Input metadata:
# placeholder: "example@email.com"

# Output:
# "Please say your email address"

# Input metadata:
# placeholder: "10 digit mobile number"

# Output:
# "Please say your mobile number"

# Return STRICT JSON only.

# Output format:

# [
#  {{
#    "name": "field_name",
#    "spoken_prompt": "Please say your Aadhaar number"
#  }},
#  {{
#    "name": "field_name",
#    "spoken_prompt": "Please say your phone number"
#  }}
# ]

# Fields to analyze:

# {json.dumps(fields, indent=2)}
# """
#     payload = {
#         "model": "llama-3.3-70b-versatile",
#         "messages": [
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ],
#         "temperature": 0
#     }

#     headers = {
#         "Authorization": f"Bearer {GROQ_API_KEY}",
#         "Content-Type": "application/json"
#     }

#     response = requests.post(URL, headers=headers, json=payload)

#     data = response.json()

#     print("Groq response:", data)

#     try:
#         text = data["choices"][0]["message"]["content"]
#         return json.loads(text)

#     except:
#         print("Groq parsing failed:", data)
#         return []
import os
import json
import re
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

URL = "https://api.groq.com/openai/v1/chat/completions"


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

    payload = {
        "model": "llama-3.3-70b-versatile",
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

    response = requests.post(URL, headers=headers, json=payload)

    data = response.json()

    print("Groq response:", data)

    try:

        text = data["choices"][0]["message"]["content"]

        # Extract JSON if model adds explanation
        json_match = re.search(r'\[.*\]', text, re.DOTALL)

        if json_match:
            return json.loads(json_match.group())

    except Exception as e:
        print("Groq parsing failed:", e)

    return []