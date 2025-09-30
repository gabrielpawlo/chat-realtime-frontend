const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://chat-realtime-backend-yu5o.onrender.com/chatHub") // seu backend
    .configureLogging(signalR.LogLevel.Information)
    .build();

let username = "";

// Quando clicar em "Entrar no Chat"
document.getElementById("enterButton").addEventListener("click", () => {
    const input = document.getElementById("usernameInput").value.trim();
    if (input === "") {
        alert("Digite um nome para entrar no chat!");
        return;
    }

    username = input;

    // troca as telas
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("chat-screen").style.display = "block";

    start(); // conecta ao SignalR
});

// Receber mensagens
connection.on("ReceiveMessage", (user, message, timestamp) => {
    const li = document.createElement("li");

    const strong = document.createElement("strong");
    strong.textContent = user + ": ";

    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;

    const timeSpan = document.createElement("span");
    timeSpan.classList.add("timestamp");
    const date = new Date(timestamp);
    timeSpan.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    li.appendChild(strong);
    li.appendChild(messageSpan);
    li.appendChild(timeSpan);

    document.getElementById("messagesList").appendChild(li);

    // scroll automático
    const container = document.getElementById("messages-container");
    container.scrollTop = container.scrollHeight;
});

// Iniciar conexão
async function start() {
    try {
        await connection.start();
        console.log("Conectado ao SignalR");
    } catch (err) {
        console.error("Erro na conexão:", err);
        setTimeout(start, 5000);
    }
}

// Enviar mensagens
document.getElementById("sendButton").addEventListener("click", async (event) => {
    event.preventDefault();
    const message = document.getElementById("messageInput").value.trim();
    if (message === "") return;

    try {
        await connection.invoke("SendMessage", username, message);
        document.getElementById("messageInput").value = "";
    } catch (err) {
        console.error("Erro ao enviar:", err);
    }
});
