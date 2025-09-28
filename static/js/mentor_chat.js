// Функция для отправки сообщения
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Добавляем сообщение пользователя в чат
    addMessageToChat('user', message);
    
    // Очищаем поле ввода
    userInput.value = '';
    
    // Показываем индикатор загрузки
    const loadingId = showLoadingIndicator();
    
    try {
        // Отправляем запрос на сервер
        const response = await fetch('/api/ai-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        // Убираем индикатор загрузки
        removeLoadingIndicator(loadingId);
        
        if (data.status === 'success') {
            // Добавляем ответ AI в чат
            addMessageToChat('bot', data.response);
        } else {
            addMessageToChat('bot', 'Извините, произошла ошибка: ' + (data.error || 'Неизвестная ошибка'));
        }
        
    } catch (error) {
        // Убираем индикатор загрузки
        removeLoadingIndicator(loadingId);
        addMessageToChat('bot', 'Ошибка соединения с сервером');
        console.error('Error:', error);
    }
}

// Функция для добавления сообщения в чат
function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    
    // Прокручиваем вниз
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Функция для показа индикатора загрузки
function showLoadingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message loading-indicator';
    loadingDiv.id = 'loading-' + Date.now();
    loadingDiv.textContent = 'AI думает...';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return loadingDiv.id;
}

// Функция для удаления индикатора загрузки
function removeLoadingIndicator(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}

// Обработчик нажатия Enter в поле ввода
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Функция для очистки чата (опционально)
function clearChat() {
    document.getElementById('chatMessages').innerHTML = '';
}