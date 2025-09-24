const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://chat-realtime-backend-yu5o.onrender.com/chatHub")
    .build();

const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('usernameInput');
const joinButton = document.getElementById('joinButton');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesList = document.getElementById('messagesList');

let username = "";

function addMessage(message) {
    const user = message.user ?? message.User ?? "???";
    const text = message.text ?? message.Text ?? "???";

    const li = document.createElement("li");
    li.textContent = `${user}: ${text}`;
    messagesList.appendChild(li);
    messagesList.scrollTop = messagesList.scrollHeight;
}



connection.on("ReceiveMessage", function (user, text, timestamp) {
    const li = document.createElement("li");
    li.textContent = `${user}: ${text} (${new Date(timestamp).toLocaleTimeString()})`;
    document.getElementById("messagesList").appendChild(li);
});



connection.on("ReceiveMessageHistory", (messages) => {
    messagesList.innerHTML = ""; // limpa antes de carregar histórico
    messages.forEach(msg => addMessage(msg));
});

joinButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        loginScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');
        connection.start().catch(err => console.error(err.toString()));
    } else {
        alert("Por favor, digite seu nome de usuário.");
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        connection.invoke("SendMessage", username, message).catch(err => console.error(err.toString()));
        messageInput.value = "";
    }
}

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});