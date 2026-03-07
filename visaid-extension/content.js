// console.log("VisAid Loaded");

// let fields = [];
// let currentIndex = 0;
// let keyBuffer = "";


// /* -------------------------
//    HOTKEY ACTIVATION (ffff)
// -------------------------- */

// document.addEventListener("keydown", (e) => {

//     keyBuffer += e.key.toLowerCase();

//     if (keyBuffer.length > 4) {
//         keyBuffer = keyBuffer.slice(-4);
//     }

//     if (keyBuffer === "ffff") {

//         console.log("Activation key detected");

//         startVisAid();

//         keyBuffer = "";
//     }

// });


// /* -------------------------
//    START SYSTEM
// -------------------------- */

// function startVisAid() {

//     console.log("Starting VisAid");

//     detectFields();

// }


// /* -------------------------
//    DETECT FORM FIELDS
// -------------------------- */

// function detectFields() {

//     console.log("Scanning page for inputs...");

//     const inputs = document.querySelectorAll("input, textarea, select");

//     if (!inputs.length) {

//         speak("No form detected on this page");
//         return;

//     }

//     fields = [];

//     inputs.forEach(input => {

//         if (input.type === "hidden") return;
//         if (input.disabled) return;

//         let label = input.name || input.id || "field";

//         if (input.placeholder) {
//             label = input.placeholder;
//         }

//         const labelTag = document.querySelector(`label[for="${input.id}"]`);

//         if (labelTag) {
//             label = labelTag.innerText.trim();
//         }

//        fields.push({
//     name: input.name || input.id,
//     label: label,
//     placeholder: input.placeholder || "",
//     id: input.id || "",
//     aria: input.getAttribute("aria-label") || "",
//     type: input.type || "",
//     pattern: input.pattern || "",
//     maxlength: input.maxLength || "",
//     page_title: document.title,
//     surrounding_text: input.closest("form")?.innerText?.slice(0,200) || ""
// });

//     });

//     console.log("Detected fields:", fields);

//     if (!fields.length) {

//         speak("No usable fields detected");
//         return;

//     }

//     currentIndex = 0;

//     sendFieldsToBackend();

// }


// /* -------------------------
//    SEND FIELDS TO BACKEND
// -------------------------- */

// function sendFieldsToBackend() {

//     chrome.runtime.sendMessage({
//         endpoint: "form-loaded",
//         data: { fields: fields }
//     }, handleBackendResponse);

// }


// /* -------------------------
//    HANDLE BACKEND RESPONSE
// -------------------------- */

// function handleBackendResponse(response) {

//     if (!response) return;

//     console.log("Backend response:", response);

//     if (response.action === "speak") {

//         speak(response.text, () => {

//             startListening();

//         });

//     }

//     if (response.action === "fill") {

//         fillField(response.field, response.value);

//         currentIndex++;

//         if (response.next) {

//             speak(response.next, () => {

//                 startListening();

//             });

//         } else {

//             speak("All fields completed");

//         }

//     }

// }


// /* -------------------------
//    SPEAK TEXT
// -------------------------- */

// function speak(text, callback) {

//     console.log("Speaking:", text);

//     speechSynthesis.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);

//     utterance.onend = () => {

//         if (callback) callback();

//     };

//     speechSynthesis.speak(utterance);

// }


// /* -------------------------
//    NORMALIZE SPEECH TEXT
// -------------------------- */

// function normalizeSpeech(text) {

//     text = text.toLowerCase();

//     text = text.replace(/at the rate/g, "@");
//     text = text.replace(/at rate/g, "@");
//     text = text.replace(/\bat\b/g, "@");

//     text = text.replace(/dot/g, ".");

//     text = text.replace(/ /g, "");

//     return text;

// }


// /* -------------------------
//    START LISTENING
// -------------------------- */

// function startListening() {

//     console.log("Starting microphone...");

//     const SpeechRecognition =
//         window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {

//         console.log("Speech recognition not supported");
//         return;

//     }

//     const recognition = new SpeechRecognition();

//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//     recognition.continuous = false;

//     recognition.onstart = () => {

//         console.log("Microphone listening...");

//     };

//     recognition.onresult = (event) => {

//         let transcript = event.results[0][0].transcript;

//         console.log("User said:", transcript);

//         if (fields[currentIndex].name.toLowerCase().includes("email")) {

//             transcript = normalizeSpeech(transcript);

//         }

//         chrome.runtime.sendMessage({
//             endpoint: "voice-input",
//             data: { text: transcript }
//         }, handleBackendResponse);

//     };

//     recognition.onerror = (e) => {

//         console.log("Speech recognition error:", e);

//     };

//     recognition.start();

// }


// /* -------------------------
//    FILL FIELD
// -------------------------- */

// function fillField(fieldName, value) {

//     console.log("Filling:", fieldName, value);

//     let field =
//         document.querySelector(`[name="${fieldName}"]`) ||
//         document.querySelector(`#${fieldName}`);

//     if (!field) {

//         const inputs = document.querySelectorAll("input, textarea");

//         inputs.forEach(input => {

//             if (
//                 input.placeholder &&
//                 input.placeholder.toLowerCase().includes(fieldName.toLowerCase())
//             ) {

//                 field = input;

//             }

//         });

//     }

//     if (!field) {

//         console.log("Field not found:", fieldName);
//         return;

//     }

//     field.focus();

//     let setter;

//     if (field.tagName === "TEXTAREA") {

//         setter = Object.getOwnPropertyDescriptor(
//             window.HTMLTextAreaElement.prototype,
//             "value"
//         ).set;

//     } else {

//         setter = Object.getOwnPropertyDescriptor(
//             window.HTMLInputElement.prototype,
//             "value"
//         ).set;

//     }

//     setter.call(field, value);

//     field.dispatchEvent(new Event("input", { bubbles: true }));
//     field.dispatchEvent(new Event("change", { bubbles: true }));

//     console.log("Filled", fieldName);

// }
console.log("VisAid Loaded");

let fields = [];
let currentIndex = 0;
let keyBuffer = "";
let formSubmitted = false; // guard to prevent loop


/* HOTKEY ACTIVATION */

document.addEventListener("keydown", (e) => {

    keyBuffer += e.key.toLowerCase();

    if (keyBuffer.length > 4) keyBuffer = keyBuffer.slice(-4);

    if (keyBuffer === "ffff") {

        console.log("Activation key detected");

        startVisAid();

        keyBuffer = "";
    }

});


function startVisAid() {

    console.log("Starting VisAid");

    detectFields();

}


/* FIELD DETECTION */

function detectFields() {

    console.log("Scanning page for inputs...");

    const inputs = document.querySelectorAll("input, textarea, select");

    fields = [];

    inputs.forEach(input => {

        if (input.type === "hidden") return;
        if (input.disabled) return;
        if (input.type === "file") return;

        /* SKIP TERMS CHECKBOX FROM FLOW */

        if (input.type === "checkbox") {

            const text = (input.closest("label")?.innerText || "").toLowerCase();

            if (
                text.includes("agree") ||
                text.includes("terms") ||
                text.includes("conditions") ||
                text.includes("policy")
            ) {

                console.log("Skipping terms checkbox from flow");

                return;
            }
        }

        let label = input.name || input.id || input.placeholder || "field";

        const labelTag = document.querySelector(`label[for="${input.id}"]`);

        if (labelTag) label = labelTag.innerText.trim();


        /* RADIO */

        if (input.type === "radio") {

            const radios = document.querySelectorAll(`input[name="${input.name}"]`);

            const options = [...radios].map(r => r.value);

            console.log("Radio detected:", input.name, options);

            fields.push({
                name: input.name,
                label: label,
                type: "radio",
                options: options
            });

            return;
        }


        /* CHECKBOX GROUP */

        if (input.type === "checkbox" && input.name) {

            const checkboxes = document.querySelectorAll(`input[name="${input.name}"]`);

            const options = [...checkboxes].map(c => c.value);

            console.log("Checkbox group detected:", input.name, options);

            fields.push({
                name: input.name,
                label: label,
                type: "checkbox",
                options: options
            });

            return;
        }


        /* DROPDOWN */

        if (input.tagName === "SELECT") {

            const options = [...input.options].map(o => o.text);

            console.log("Dropdown detected:", input.name, options);

            fields.push({
                name: input.name || input.id,
                label: label,
                type: "select",
                options: options
            });

            return;
        }


        /* NORMAL INPUT */

        fields.push({
            name: input.name || input.id,
            label: label,
            placeholder: input.placeholder || "",
            id: input.id || "",
            aria: input.getAttribute("aria-label") || "",
            type: input.type || "",
            page_title: document.title,
            surrounding_text: input.closest("form")?.innerText?.slice(0, 200) || ""
        });

    });

    console.log("Detected fields:", fields);

    if (!fields.length) {

        speak("No usable fields detected");

        return;
    }

    currentIndex = 0;

    sendFieldsToBackend();

}


/* SEND TO BACKEND */

function sendFieldsToBackend() {

    console.log("Sending fields to backend");

    chrome.runtime.sendMessage({
        endpoint: "form-loaded",
        data: { fields: fields }
    }, handleBackendResponse);

}


/* HANDLE BACKEND RESPONSE */

function handleBackendResponse(response) {

    console.log("Backend response:", response);

    if (!response) return;

    if (response.action === "speak") {

        speak(response.text, () => startListening());

    }

    if (response.action === "fill") {

        console.log("Backend fill instruction:", response.field, response.value);

        fillField(response.field, response.value);

        currentIndex++;

        if (response.next) {

            speak(response.next, () => startListening());

        } else {

            console.log("All fields completed");

            speak("All fields are filled. Do you want to submit the form? Say yes or no.", () => startListening());
        }

    }

}


/* SPEAK */

function speak(text, callback) {

    console.log("Speaking:", text);

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => {

        if (callback) callback();

    };

    speechSynthesis.speak(utterance);

}


/* EMAIL NORMALIZATION */

function normalizeEmail(text) {

    text = text.toLowerCase();

    text = text.replace(/at the rate/g, "@");
    text = text.replace(/\bat\b/g, "@");

    text = text.replace(/dot/g, ".");

    text = text.replace(/\s+/g, "");

    console.log("Normalized email:", text);

    return text;

}


/* URL NORMALIZATION */

function normalizeURL(text) {

    text = text.toLowerCase();

    text = text.replace(/colon/g, ":");
    text = text.replace(/slash/g, "/");
    text = text.replace(/dot/g, ".");

    text = text.replace(/\s+/g, "");

    text = text.replace("https:/", "https://");
    text = text.replace("http:/", "http://");

    console.log("Normalized URL:", text);

    return text;
}


/* GENERAL PUNCTUATION */

function normalizeSpeech(text) {

    text = text.replace(/slash/gi, "/");
    text = text.replace(/comma/gi, ",");
    text = text.replace(/colon/gi, ":");
    text = text.replace(/dot/gi, ".");
    text = text.replace(/dash|hyphen/gi, "-");

    console.log("Normalized speech:", text);

    return text;
}


/* NAME CAPITALIZATION */

function capitalizeName(text) {

    const result = text
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    console.log("Capitalized name:", result);

    return result;
}


/* DATE PARSING */

function parseDate(text) {

    const months = {
        january: "01", february: "02", march: "03", april: "04",
        may: "05", june: "06", july: "07", august: "08",
        september: "09", october: "10", november: "11", december: "12"
    };

    text = text.toLowerCase();

    const parts = text.split(" ");

    if (parts.length === 3 && months[parts[1]]) {

        const day = parts[0].padStart(2, "0");
        const month = months[parts[1]];
        const year = parts[2];

        const formatted = `${year}-${month}-${day}`;

        console.log("Parsed DOB:", formatted);

        return formatted;
    }

    return text;
}


/* START LISTENING */

function startListening() {

    console.log("Starting speech recognition");

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.onresult = (event) => {

        let transcript = event.results[0][0].transcript;

        console.log("User said:", transcript);

        /* SUBMIT CONFIRMATION HANDLING */

        if (currentIndex >= fields.length) {

            const speech = transcript.toLowerCase().trim();

            console.log("Submit confirmation received:", speech);

            if (speech.includes("yes")) {

                submitForm();

            } else {

                speak("Form submission cancelled");
            }

            return;
        }

        const field = fields[currentIndex];

        const isEmail =
            field.type === "email" ||
            field.name?.toLowerCase().includes("email");

        const isURL =
            field.type === "url" ||
            field.placeholder?.toLowerCase().includes("http") ||
            field.placeholder?.toLowerCase().includes("link");

        const isDOB =
            field.type === "date" ||
            field.name?.toLowerCase().includes("dob");

        const isName =
            field.name?.toLowerCase().includes("name");

        if (isEmail) transcript = normalizeEmail(transcript);
        else if (isURL) transcript = normalizeURL(transcript);
        else transcript = normalizeSpeech(transcript);

        if (isDOB) transcript = parseDate(transcript);

        if (isName) transcript = capitalizeName(transcript);

        console.log("Final normalized value:", transcript);

        chrome.runtime.sendMessage({
            endpoint: "voice-input",
            data: { text: transcript }
        }, handleBackendResponse);

    };

    recognition.start();

}


/* FIELD FILLING */

function fillField(fieldName, value) {

    console.log("Filling:", fieldName, value);

    const spoken = value.toLowerCase().trim();


    const radios = document.querySelectorAll(`input[name="${fieldName}"][type="radio"]`);

    if (radios.length > 0) {

        radios.forEach(radio => {

            if (radio.value.toLowerCase().includes(spoken)) {

                radio.checked = true;

                radio.dispatchEvent(new Event("change", { bubbles: true }));

            }

        });

        return;
    }


    const checkboxes = document.querySelectorAll(`input[name="${fieldName}"][type="checkbox"]`);

    if (checkboxes.length > 0) {

        checkboxes.forEach(box => {

            if (spoken.includes(box.value.toLowerCase())) {

                box.checked = true;

                box.dispatchEvent(new Event("change", { bubbles: true }));

            }

        });

        return;
    }


    const select = document.querySelector(`select[name="${fieldName}"]`);

    if (select) {

        const options = [...select.options];

        let match = options.find(o =>
            spoken === o.text.toLowerCase()
        );

        if (!match) {

            match = options.find(o =>
                spoken.includes(o.text.toLowerCase()) ||
                o.text.toLowerCase().includes(spoken)
            );

        }

        if (!match) {

            match = options.find(o =>
                o.text.toLowerCase().includes("other")
            );

        }

        if (match) {

            select.value = match.value;

            select.dispatchEvent(new Event("change", { bubbles: true }));

        }

        return;
    }


    let field =
        document.querySelector(`[name="${fieldName}"]`) ||
        document.querySelector(`#${fieldName}`);

    if (!field) return;

    field.focus();

    const setter = Object.getOwnPropertyDescriptor(
        field.tagName === "TEXTAREA"
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype,
        "value"
    ).set;

    setter.call(field, value);

    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));

}


/* FORM SUBMIT */

function submitForm() {

    if (formSubmitted) return;
    formSubmitted = true;

    console.log("Preparing to submit form");

    const checkboxes = document.querySelectorAll("input[type='checkbox']");

    checkboxes.forEach(box => {

        const text = (box.closest("label")?.innerText || "").toLowerCase();

        if (
            text.includes("agree") ||
            text.includes("terms") ||
            text.includes("conditions") ||
            text.includes("policy")
        ) {

            if (!box.checked) {

                console.log("Auto agreeing to terms");

                box.click();
            }

        }

    });

    const form = document.querySelector("form");

    if (form) {

        console.log("Submitting form via form.submit()");
        form.submit();
        return;
    }

    const button = document.querySelector(
        "button[type='submit'], input[type='submit']"
    );

    if (button) {

        console.log("Submitting form via button click");
        button.click();
    }

}