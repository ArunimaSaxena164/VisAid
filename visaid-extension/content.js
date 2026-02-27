console.log("VisAid Content Script Loaded");

/* =========================================
   1️⃣  Traverse Shadow DOM Recursively
========================================= */

function getAllInteractiveElements(root = document) {
    let elements = [
        ...root.querySelectorAll("input, select, textarea, button")
    ];

    root.querySelectorAll("*").forEach(el => {
        if (el.shadowRoot) {
            elements = elements.concat(getAllInteractiveElements(el.shadowRoot));
        }
    });

    return elements;
}

/* =========================================
   2️⃣  Extract Page Data
========================================= */

function extractPageData() {

    const elements = getAllInteractiveElements();
    const fields = [];

    elements.forEach(field => {

        // Ignore true hidden inputs only
        if (field.type === "hidden") return;

        let labelText = null;

        // Case 1: label[for=id]
        if (field.id) {
            const label = document.querySelector(`label[for="${field.id}"]`);
            if (label) labelText = label.innerText.trim();
        }

        // Case 2: wrapped inside label
        if (!labelText) {
            const parentLabel = field.closest("label");
            if (parentLabel) labelText = parentLabel.innerText.trim();
        }

        // Case 3: sibling label (common in React/styled-components)
        if (!labelText) {
            const siblingLabel = field.parentElement?.querySelector("label");
            if (siblingLabel) labelText = siblingLabel.innerText.trim();
        }

        // Case 4: aria-label
        if (!labelText && field.getAttribute("aria-label")) {
            labelText = field.getAttribute("aria-label");
        }

        fields.push({
            tag: field.tagName.toLowerCase(),
            type: field.type || null,
            id: field.id || null,
            name: field.name || null,
            value: field.value || null,
            placeholder: field.placeholder || null,
            required: field.required || false,
            disabled: field.disabled || false,
            label: labelText
        });

    });

    /* =========================================
       3️⃣  Extract Visible Error Messages
    ========================================= */

    const errors = [];

    document.querySelectorAll("*").forEach(el => {
        if (
            el.innerText &&
            el.innerText.length < 200 &&
            (
                el.innerText.toLowerCase().includes("required") ||
                el.innerText.toLowerCase().includes("invalid") ||
                el.innerText.toLowerCase().includes("error")
            )
        ) {
            errors.push(el.innerText.trim());
        }
    });

    /* =========================================
       4️⃣  Extract Visible Page Text (for TTS)
    ========================================= */

    const visibleText = [];

    document.querySelectorAll("h1, h2, h3, p, span, label").forEach(el => {
        if (
            el.innerText &&
            el.innerText.length > 0 &&
            el.innerText.length < 300
        ) {
            visibleText.push(el.innerText.trim());
        }
    });

    return {
        url: window.location.href,
        title: document.title,
        fields,
        errors,
        visibleText
    };
}

/* =========================================
   5️⃣  Debounced Sender (Prevents Spam)
========================================= */

let debounceTimeout = null;

function sendToBackendDebounced() {

    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(async () => {

        const pageData = extractPageData();

        try {
            await fetch("http://localhost:8000/live-form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pageData)
            });
        } catch (err) {
            console.error("Backend error:", err);
        }

    }, 1000); // max once per second
}

/* =========================================
   6️⃣  Live Monitoring
========================================= */

// Initial send
sendToBackendDebounced();

// Detect typing
document.addEventListener("input", sendToBackendDebounced);

// Detect DOM changes (React, Angular, etc.)
const observer = new MutationObserver(sendToBackendDebounced);

observer.observe(document.body, {
    childList: true,
    subtree: true
});