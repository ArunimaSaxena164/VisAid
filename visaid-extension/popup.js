document.getElementById("uploadBtn").addEventListener("click", async () => {

    const fileInput = document.getElementById("pdfInput");
    const status = document.getElementById("status");
    const btn = document.getElementById("uploadBtn");

    if (!fileInput.files.length) {
        status.textContent = "Please select a PDF file.";
        return;
    }

    btn.disabled = true;
    status.textContent = "Reading PDF...";

    const file = fileInput.files[0];
    const base64 = await readFileAsBase64(file);

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, { type: "get-fields" }, (fieldsResponse) => {

        if (chrome.runtime.lastError || !fieldsResponse || !fieldsResponse.fields.length) {
            status.textContent = "No form fields found on this page.";
            btn.disabled = false;
            return;
        }

        status.textContent = `Found ${fieldsResponse.fields.length} fields. Analyzing PDF...`;

        chrome.runtime.sendMessage({
            endpoint: "pdf-fill",
            data: {
                pdf_base64: base64,
                fields: fieldsResponse.fields
            }
        }, (response) => {

            if (chrome.runtime.lastError || !response) {
                status.textContent = "Backend error. Is the server running?";
                btn.disabled = false;
                return;
            }

            if (response.action === "fill_all" && response.fills.length > 0) {

                chrome.tabs.sendMessage(tab.id, {
                    type: "fill-all",
                    fills: response.fills
                }, () => {
                    status.textContent = `Filled ${response.fills.length} field(s) from PDF!`;
                    btn.disabled = false;
                });

            } else {
                status.textContent = response.message || "No matching data found in PDF.";
                btn.disabled = false;
            }
        });
    });
});

function readFileAsBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(file);
    });
}
