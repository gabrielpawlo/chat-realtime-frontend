const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://chat-realtime-backend-yu5o.onrender.com/chatHub") // 🔗 sua API backend
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Nome do usuário fixo (pode trocar por prompt se quiser)
let username = "Usuário";

// Quando receber mensagem do servidor
connection.on("ReceiveMessage", (user, message, timestamp) => {
    const li = document.createElement("li");

    // Nome do usuário
    const strong = document.createElement("strong");
    strong.textContent = user + ": ";

    // Mensagem
    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;

    // Horário formatado
    const timeSpan = document.createElement("span");
    timeSpan.classList.add("timestamp");

    const date = new Date(timestamp);
    timeSpan.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Montagem da mensagem
    li.appendChild(strong);
    li.appendChild(messageSpan);
    li.appendChild(timeSpan);

    document.getElementById("messagesList").appendChild(li);

    // Scroll automático
    const container = document.getElementById("messages-container");
    container.scrollTop = container.scrollHeight;
});

// Inicia conexão
async function start() {
    try {
        await connection.start();
        console.log("Conectado ao SignalR");
    } catch (err) {
        console.error("Erro na conexão:", err);
        setTimeout(start, 5000);
    }
}

start();

// Enviar mensagem
document.getElementById("sendButton").addEventListener("click", async (event) => {
    event.preventDefault();

    const message = document.getElementById("messageInput").value.trim();
    if (message === "") return;

    try {
        await connection.invoke("SendMessage", username, message);
        document.getElementById("messageInput").value = "";
    } catch (err) {
        console.error("Erro ao enviar mensagem:", err);
    }
});
