// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

//     fetch("http://localhost:8000/" + message.endpoint, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(message.data)
//     })
//     .then(res => res.json())
//     .then(data => sendResponse(data))
//     .catch(err => console.error("Backend error:", err));

//     return true;
// });
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    let url = "http://localhost:8000/" + message.endpoint;

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