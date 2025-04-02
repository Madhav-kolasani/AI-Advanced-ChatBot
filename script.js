let prompt = document.querySelector("#prompt")
let chatContainer = document.querySelector(".chat-container");
let submitBtn = document.querySelector("#submit");
let imageBtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageInput = document.querySelector("#image input");
const api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAUMSgpc5qyeTm3BYWWNlevB3f5Ty-vBLA";

let user = {
    message: null,
    file: null 
}

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");

    let parts = [{ "text": user.message }];

    if (user.file && user.file.data && user.file.mime_type) {
        parts.push({
            "inline_data": {
                "mime_type": user.file.mime_type,
                "data": user.file.data
            }
        });
    }

    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [{ "parts": parts }]
        })
    };

    try {
        let response = await fetch(api_url, RequestOption);

        if (!response.ok) {
            let errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        let data = await response.json();
        console.log("API Response:", data);

        if (data.candidates && data.candidates.length > 0) {
            let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            text.innerHTML = apiResponse;
        } else {
            console.log("No valid candidates found in response");
            text.innerHTML = "No valid response received from AI.";
        }
    } catch (error) {
        console.error("Error:", error);
        text.innerHTML = "An error occurred while fetching AI response.";
    } finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        image.src = `Images/img.svg`; 
        image.classList.remove("choose");
        // Reset to null instead of empty object
        user.file = null;
    }
}

function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handleChatResponse(userMessage) {
    user.message = userMessage;
    let imageHTML = "";
    
    if (user.file && user.file.mime_type && user.file.data) {
        imageHTML = `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" width="100" height="100"/>`;
    }
    
    let html = `<img src="Images/user.png" alt="" id="userimage" width="10%">
            <div class="user-chat-area">
                ${user.message}
                ${imageHTML}
            </div>`
    prompt.value = null;
    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);
    chatContainer.scrollTo({top: chatContainer.scrollHeight, behavior: "smooth"});
    
    setTimeout(() => {
        let html = `<img src="Images/ai bot.jpeg" alt="" id="aiimage" width="10%">
            <div class="ai-chat-area">
               <img src="Images/loading.gif" alt="" class="load" width="50">
            </div>`
        let aiChatBox = createChatBox(html, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
        generateResponse(aiChatBox);
    }, 600);
}

prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleChatResponse(prompt.value);
    }
});

submitBtn.addEventListener("click", () => {
    handleChatResponse(prompt.value);
});

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    if (!prompt.value) {
        user.message = "Please describe what you see in this image.";
    } else {
        user.message = prompt.value;
    }
    
    let reader = new FileReader();
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1];
        // Create a complete file object
        user.file = {
            mime_type: file.type,
            data: base64string,
        };
        image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
        image.classList.add("choose");
    }
    reader.readAsDataURL(file);
});

imageBtn.addEventListener("click", () => {
    imageInput.click();
});