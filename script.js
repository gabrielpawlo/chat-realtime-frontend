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

// ALTERADO: Agora a função recebe um objeto de mensagem
function addMessage(message) {
    const li = document.createElement("li");
    li.textContent = `${message.user}: ${message.text}`;
    messagesList.appendChild(li);
    messagesList.scrollTop = messagesList.scrollHeight;
}

connection.on("ReceiveMessage", (user, text, timestamp) => {
    const li = document.createElement("li");
    li.textContent = `${user}: ${text} (${new Date(timestamp).toLocaleTimeString()})`;
    document.getElementById("messagesList").appendChild(li);
});


connection.on("ReceiveMessageHistory", (messages) => {
    const list = document.getElementById("messagesList");
    list.innerHTML = ""; // limpa antes

    messages.forEach(m => {
        const li = document.createElement("li");
        li.textContent = `${m.user}: ${m.text} (${new Date(m.timestamp).toLocaleTimeString()})`;
        list.appendChild(li);
    });
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