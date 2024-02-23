// Estilos globales
document.body.style.margin = '0';
document.body.style.fontFamily = 'Arial, sans-serif';

// Función para aplicar los colores del modo
function applyColors(isDarkMode) {
  const colors = isDarkMode ? darkModeColors : lightModeColors;
  userListContainer.style.backgroundColor = colors.background;
  chatContainer.style.backgroundColor = colors.background;
  userHeader.style.color = colors.headerText;
  sendButton.style.backgroundColor = colors.buttonBackground;
  inputField.style.backgroundColor = colors.inputBackground;
  inputField.style.color = colors.inputText;
}

// Crear elementos de chat
const userListContainer = document.createElement('div');
userListContainer.style.cssText = 'width: 20%; height: 100vh; float: left; overflow-y: auto; padding: 20px; box-sizing: border-box; background-color: #f0f0f0;';
document.body.appendChild(userListContainer);

const chatContainer = document.createElement('div');
chatContainer.style.cssText = 'width: 60%; height: 100vh; float: left; overflow-y: auto; padding: 20px; box-sizing: border-box; background-color: #e0e0e0;';
document.body.appendChild(chatContainer);

const inputContainer = document.createElement('div');
inputContainer.style.cssText = 'width: 20%; height: 100vh; float: left; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-end; background-color: #f0f0f0;';
document.body.appendChild(inputContainer);

const userHeader = document.createElement('h2');
userHeader.textContent = 'Usuarios en el Chat';
userHeader.style.cssText = 'margin-top: 0; color: #000;';
userListContainer.appendChild(userHeader);

const userList = document.createElement('ul');
userList.style.cssText = 'list-style-type: none; padding: 0; margin: 0;';
userListContainer.appendChild(userList);

const chatMessages = document.createElement('div');
chatMessages.style.cssText = 'overflow-y: auto; height: calc(100% - 100px); margin-bottom: 20px; border-radius: 10px; padding: 10px; background-color: #ffffff;';
chatContainer.appendChild(chatMessages);

const inputField = document.createElement('input');
inputField.setAttribute('type', 'text');
inputField.setAttribute('placeholder', 'Escribe un mensaje...');
inputField.style.cssText = 'width: calc(100% - 20px); padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; background-color: #ffffff; color: #000;';
inputContainer.appendChild(inputField);

const sendButton = document.createElement('button');
sendButton.textContent = 'Enviar';
sendButton.style.cssText = 'width: calc(100% - 20px); padding: 10px; border: none; border-radius: 5px; cursor: pointer; background-color: #4CAF50; color: #ffffff;';
inputContainer.appendChild(sendButton);

// Crear botón de cambio de modo
const modeToggleButton = document.createElement('button');
modeToggleButton.textContent = 'Cambiar Modo';
modeToggleButton.style.cssText = 'width: 100%; padding: 10px; margin-top: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;';
inputContainer.appendChild(modeToggleButton);

// Crear flecha para ir al último mensaje
const arrowButton = document.createElement('button');
arrowButton.innerHTML = '&#8595;'; // Código de la flecha hacia abajo
arrowButton.style.cssText = 'position: fixed; bottom: 20px; right: 20px; font-size: 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; padding: 10px;';
document.body.appendChild(arrowButton);

// Función para cambiar el modo
function toggleMode() {
  const body = document.body;
  const isDarkMode = body.classList.toggle('dark-mode');
  applyColors(isDarkMode);
}

// Evento de clic para cambiar el modo
modeToggleButton.addEventListener('click', toggleMode);

// Función para enviar un mensaje
function sendMessage() {
  const messageText = inputField.value.trim();
  const maxChars = 140; // Máximo de caracteres permitidos
  if (messageText !== '') {
    if (messageText.length <= maxChars) {
      const messageBubble = document.createElement('div');
      messageBubble.textContent = messageText;
      messageBubble.style.cssText = 'padding: 10px; margin: 5px 0; border-radius: 10px; background-color: #0084FF; color: #ffffff;';
      chatMessages.appendChild(messageBubble);
      inputField.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
      // Cambiar color del texto si se supera el límite de caracteres
      inputField.style.color = 'red';
    }
  }
}

// Evento de clic para enviar mensaje
sendButton.addEventListener('click', sendMessage);

// Evento de tecla Enter para enviar mensaje
inputField.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// Evento de clic para ir al último mensaje
arrowButton.addEventListener('click', function() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Ejemplo: Agregar algunos usuarios a la lista
const users = ['Usuario1', 'Usuario2', 'Usuario3', 'Usuario4', 'Usuario5'];
users.forEach(user => {
  const listItem = document.createElement('li');
  listItem.textContent = user;
  userList.appendChild(listItem);
});

// Paleta de colores para modo oscuro
const darkModeColors = {
  background: '#36393f',
  headerText: '#b9bbbe',
  buttonBackground: '#7289da',
  inputBackground: '#40444b',
  inputText: '#b9bbbe',
};

// Paleta de colores para modo claro
const lightModeColors = {
  background: '#e5ddd5',
  headerText: '#075e54',
  buttonBackground: '#128C7E',
  inputBackground: '#fff',
  inputText: '#000',
};

// Aplicar colores iniciales según el modo actual
applyColors(false); // Modo claro por defecto
