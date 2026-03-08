// Change this to your EC2 public IP after deployment
const BACKEND_URL = "http://13.232.1.76:8000";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    let url = BACKEND_URL + "/" + message.endpoint;

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message.data)
    })
    .then(res => res.json())
    .then(data => sendResponse(data))
    .catch(err => {
        console.error("Backend error:", err);
        sendResponse({ action: "none" });
    });

    return true;
});