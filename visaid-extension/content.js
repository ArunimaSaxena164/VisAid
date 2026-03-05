console.log("VisAid Loaded");

let fields = [];
let currentIndex = 0;
let activated = false;

let keyBuffer = "";


/* -------------------------
   HOTKEY ACTIVATION (ffff)
-------------------------- */

document.addEventListener("keydown", (e) => {

    keyBuffer += e.key.toLowerCase();

    if (keyBuffer.length > 4) {
        keyBuffer = keyBuffer.slice(-4);
    }

    if (keyBuffer === "ffff") {

        console.log("Activation key detected");

        activated = true;

        startVisAid();

        keyBuffer = "";

    }

});


/* -------------------------
   START SYSTEM
-------------------------- */

function startVisAid() {

    console.log("Starting VisAid");

    detectFields();

}


/* -------------------------
   DETECT FORM FIELDS
-------------------------- */

function detectFields() {

    console.log("Scanning page for inputs...");

    const inputs = document.querySelectorAll("input, textarea, select");

    if (!inputs.length) {

        speak("No form detected on this page");

        return;

    }

    fields = [];

    inputs.forEach(input => {

        if (input.type === "hidden") return;
        if (input.disabled) return;

        let label = input.name || input.id || "field";

        if (input.placeholder) {
            label = input.placeholder;
        }

        const labelTag = document.querySelector(`label[for="${input.id}"]`);

        if (labelTag) {
            label = labelTag.innerText.trim();
        }

        fields.push({
            name: input.name || input.id,
            label: label
        });

    });

    console.log("Detected fields:", fields);

    if (!fields.length) {

        speak("No usable fields detected");

        return;

    }

    currentIndex = 0;

    speak("Form detected. Please say " + fields[0].label, () => {

        startListening();

    });

}


/* -------------------------
   SPEAK TEXT
-------------------------- */

function speak(text, callback) {

    console.log("Speaking:", text);

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => {

        if (callback) callback();

    };

    speechSynthesis.speak(utterance);

}


/* -------------------------
   NORMALIZE SPEECH TEXT
-------------------------- */

function normalizeSpeech(text) {

    text = text.toLowerCase();

    text = text.replace(/at the rate/g, "@");
    text = text.replace(/at rate/g, "@");
    text = text.replace(/\bat\b/g, "@");

    text = text.replace(/dot/g, ".");

    text = text.replace(/ /g, "");

    return text;

}


/* -------------------------
   START LISTENING
-------------------------- */

function startListening() {

    console.log("Starting microphone...");

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        console.log("Speech recognition not supported");

        return;

    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {

        console.log("Microphone listening...");

    };

    recognition.onresult = (event) => {

        let transcript = event.results[0][0].transcript;

        console.log("User said:", transcript);

        if (fields[currentIndex].name.toLowerCase().includes("email")) {

            transcript = normalizeSpeech(transcript);

        }

        fillField(fields[currentIndex].name, transcript);

        currentIndex++;

        if (currentIndex < fields.length) {

            speak("Please say " + fields[currentIndex].label, () => {

                startListening();

            });

        } else {

            speak("All fields completed");

        }

    };

    recognition.onerror = (e) => {

        console.log("Speech recognition error:", e);

    };

    recognition.start();

}


/* -------------------------
   FILL FIELD
-------------------------- */

function fillField(fieldName, value) {

    console.log("Filling:", fieldName, value);

    let field =
        document.querySelector(`[name="${fieldName}"]`) ||
        document.querySelector(`#${fieldName}`);

    if (!field) {

        const inputs = document.querySelectorAll("input, textarea");

        inputs.forEach(input => {

            if (
                input.placeholder &&
                input.placeholder.toLowerCase().includes(fieldName.toLowerCase())
            ) {

                field = input;

            }

        });

    }

    if (!field) {

        console.log("Field not found:", fieldName);

        return;

    }

    field.focus();

    let setter;

    if (field.tagName === "TEXTAREA") {

        setter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value"
        ).set;

    } else {

        setter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
        ).set;

    }

    setter.call(field, value);

    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));

    console.log("Filled", fieldName);

}