document.getElementById("goToRegister").addEventListener("click", showRegisterSection);
document.getElementById("goToLogin").addEventListener("click", showLoginSection);
document.getElementById("loginSubmit").addEventListener("click", handleLogin);
document.getElementById("registerSubmit").addEventListener("click", handleRegister);
document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("sendPrivateMessage").addEventListener("click", sendPrivateMessage);
document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("addFriendBtn").addEventListener("click", addFriend);

let currentUser = null; // Zalogowany użytkownik
let currentFriend = null; // Obecny znajomy

// Funkcja do przełączenia na sekcję logowania
function showLoginSection() {
    document.getElementById("authTitle").textContent = "Logowanie";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
}

// Funkcja do przełączenia na sekcję rejestracji
function showRegisterSection() {
    document.getElementById("authTitle").textContent = "Rejestracja";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
}

// Funkcja do logowania
function handleLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const storedUsers = JSON.parse(localStorage.getItem("users")) || {};

    if (storedUsers[username] && storedUsers[username] === password) {
        currentUser = username;
        document.getElementById("userName").textContent = username;
        document.getElementById("authSection").style.display = "none";
        document.getElementById("chatSection").style.display = "block";
        loadFriends();
    } else {
        alert("Błędne dane logowania.");
    }
}

// Funkcja do rejestracji
function handleRegister() {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;

    const storedUsers = JSON.parse(localStorage.getItem("users")) || {};

    if (password === confirmPassword) {
        if (!storedUsers[username]) {
            storedUsers[username] = password;
            localStorage.setItem("users", JSON.stringify(storedUsers)); // Zapisanie użytkownika w localStorage
            alert("Rejestracja zakończona sukcesem!");
            showLoginSection();
        } else {
            alert("Użytkownik o tej nazwie już istnieje.");
        }
    } else {
        alert("Hasła nie są takie same.");
    }
}

// Funkcja do wysyłania wiadomości publicznych
function sendMessage() {
    const messageInput = document.getElementById("messageInput").value;
    if (messageInput) {
        const messages = JSON.parse(localStorage.getItem("messages")) || [];
        messages.push({ user: currentUser, message: messageInput });
        localStorage.setItem("messages", JSON.stringify(messages));
        displayMessages();
    }
}

// Funkcja do wyświetlania wiadomości publicznych
function displayMessages() {
    const chatWindow = document.getElementById("chatWindow");
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    chatWindow.innerHTML = '';
    messages.forEach((message) => {
        const messageElement = document.createElement("div");
        messageElement.textContent = `${message.user}: ${message.message}`;
        chatWindow.appendChild(messageElement);
    });
}

// Funkcja do dodawania znajomego
function addFriend() {
    const friendName = document.getElementById("friendSearch").value;
    const storedUsers = JSON.parse(localStorage.getItem("users")) || {};

    if (storedUsers[friendName] && friendName !== currentUser) {
        let friends = JSON.parse(localStorage.getItem("friends")) || {};
        if (!friends[currentUser]) {
            friends[currentUser] = [];
        }
        friends[currentUser].push(friendName);
        localStorage.setItem("friends", JSON.stringify(friends)); // Zapisanie znajomych w localStorage
        displayFriends();
        document.getElementById("searchResult").textContent = `Dodano znajomego: ${friendName}`;
        document.getElementById("searchResult").classList.add("success");
    } else {
        document.getElementById("searchResult").textContent = "Użytkownik nie istnieje.";
        document.getElementById("searchResult").classList.remove("success");
    }
}

// Funkcja do wyświetlania znajomych
function displayFriends() {
    const friendsList = document.getElementById("friendsList");
    const friends = JSON.parse(localStorage.getItem("friends")) || {};
    friendsList.innerHTML = '';
    if (friends[currentUser]) {
        friends[currentUser].forEach((friend) => {
            const li = document.createElement("li");
            li.textContent = friend;
            li.addEventListener("click", () => openPrivateChat(friend));
            friendsList.appendChild(li);
        });
    }
}

// Funkcja do otwierania prywatnego czatu
function openPrivateChat(friend) {
    currentFriend = friend;
    document.getElementById("friendName").textContent = friend;
    document.getElementById("privateChatSection").style.display = "block";
    displayPrivateMessages();
}

// Funkcja do wysyłania prywatnych wiadomości
function sendPrivateMessage() {
    const privateMessageInput = document.getElementById("privateMessageInput").value;
    if (privateMessageInput) {
        let privateMessages = JSON.parse(localStorage.getItem("privateMessages")) || {};
        if (!privateMessages[currentUser]) {
            privateMessages[currentUser] = {};
        }
        if (!privateMessages[currentUser][currentFriend]) {
            privateMessages[currentUser][currentFriend] = [];
        }
        privateMessages[currentUser][currentFriend].push(privateMessageInput);
        localStorage.setItem("privateMessages", JSON.stringify(privateMessages)); // Zapisanie prywatnych wiadomości w localStorage
        displayPrivateMessages();
    }
}

// Funkcja do wyświetlania prywatnych wiadomości
function displayPrivateMessages() {
    const privateChatWindow = document.getElementById("privateChatWindow");
    const privateMessages = JSON.parse(localStorage.getItem("privateMessages")) || {};
    privateChatWindow.innerHTML = '';
    if (privateMessages[currentUser] && privateMessages[currentUser][currentFriend]) {
        privateMessages[currentUser][currentFriend].forEach((message) => {
            const messageElement = document.createElement("div");
            messageElement.textContent = `${currentUser}: ${message}`;
            privateChatWindow.appendChild(messageElement);
        });
    }
}

// Funkcja do wylogowania
function logout() {
    currentUser = null;
    document.getElementById("authSection").style.display = "block";
    document.getElementById("chatSection").style.display = "none";
}
