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

function addMessage(user, message) {
    const li = document.createElement("li");
    li.textContent = `${user}: ${message}`;
    messagesList.appendChild(li);
    messagesList.scrollTop = messagesList.scrollHeight;
}

// CORRIGIDO: O evento ReceiveMessage agora recebe os dados da forma correta
connection.on("ReceiveMessage", (user, message) => {
    addMessage(user, message);
});

// Lógica de reconexão automática
async function start() {
    try {
        await connection.start();
        console.log("Conectado ao SignalR");
    } catch (err) {
        console.error("Erro na conexão:", err);
        setTimeout(start, 5000);
    }
}

// Quando clicar em "Entrar no Chat"
joinButton.addEventListener("click", () => {
    const input = usernameInput.value.trim();
    if (input === "") {
        alert("Digite um nome para entrar no chat!");
        return;
    }

    username = input;

    // troca as telas
    loginScreen.classList.add("hidden");
    chatScreen.classList.remove("hidden");

    start();
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message === "") return;

    try {
        connection.invoke("SendMessage", username, message);
        messageInput.value = "";
    } catch (err) {
        console.error("Erro ao enviar:", err);
    }
}

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});