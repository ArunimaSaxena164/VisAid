console.log("VisAid Activated");

function detectFormAndSend() {

    const form = document.querySelector("form");

    if (!form) {
        console.log("No form found.");
        return;
    }

    const formHTML = form.outerHTML;

    chrome.runtime.sendMessage({
        endpoint: "form-loaded",
        data: { html: formHTML }
    }, handleBackendResponse);
}

function handleBackendResponse(response) {

    if (!response || response.action === "none") return;

    if (response.action === "speak") {
        speak(response.text);
    }
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

window.addEventListener("load", () => {
    setTimeout(detectFormAndSend, 1000);
});