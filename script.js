let prompt = document.querySelector("#prompt")
let chatContainer = document.querySelector(".chat-container");



function createChatBox(html, classes){
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}
function handleChatResponse(message){
    let html = `<img src="Images/user.png" alt="" id="userimage" width="50" height="60">
            <div class="user-chat-area">
                ${message}
            </div>`
    prompt.value=null;
    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);

    setTimeout(()=>{
        let html = `<img src="Images/ai bot.jpeg" alt="" id="aiimage" width="50" height="60">
            <div class="ai-chat-area">
               <img src="Images/loading.gif" alt="" class="load" width="50">
            </div>`
        let aiChatBox = createChatBox(html,"ai-chat-box");
        chatContainer.appendChild(aiChatBox);
    },600);
}
prompt.addEventListener("keydown", (e)=>{
    if(e.key ==="Enter"){
        handleChatResponse(prompt.value);
    }
    
});