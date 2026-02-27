// console.log("VisAid Background Running");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    fetch("http://localhost:8000/" + message.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message.data)
    })
    .then(res => res.json())
    .then(data => sendResponse(data))
    .catch(err => console.error(err));

    return true;
});