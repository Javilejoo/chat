// Estilos globales
document.body.style.margin = '0';
document.body.style.fontFamily = 'Arial, sans-serif';

// Variable para rastrear si el usuario ha desplazado manualmente hacia arriba
let userScrolledUp = false;

// Variable para almacenar el número de mensajes actualmente mostrados
let numMessagesDisplayed = 0;

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

// Función para transformar los links en imágenes
function isImageURL(url) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

// Función para analizar el texto del mensaje y crear vistas previas de enlaces
function parseMessageText(messageText) {
  // Expresión regular para detectar enlaces en el texto
  const urlRegex = /((http|https):\/\/[^\s]+)(?=\s|$)/g;

  const links = messageText.match(urlRegex);

  if (links) {
    // Si se detectan enlaces, reemplazarlos con elementos de enlace clicables o imágenes
    const messageParts = messageText.split(urlRegex);
    const messageWithLinks = [];

    messageParts.forEach((part, index) => {
      if (links.includes(part)) {
        const isLastLink = index === messageParts.length - 1;
        const isImage = isImageURL(part);

        if (isLastLink && !isImage) {
          // Si es el último enlace y no es una imagen, simplemente agregar el texto del enlace
          messageWithLinks.push(document.createTextNode(part));
        } else {
          if (isImage) {
            // Si el enlace es una imagen, crear un elemento de imagen
            const imageElement = document.createElement('img');
            imageElement.src = part;
            imageElement.style.maxWidth = '100%'; // Ajustar el tamaño máximo de la imagen
            imageElement.style.height = 'auto'; // Ajustar la altura automáticamente según el ancho
            messageWithLinks.push(imageElement);
          } else {
            // Si no es una imagen, crear un enlace cliclable con el texto del enlace
            const linkElement = document.createElement('a');
            linkElement.href = part;
            linkElement.target = '_blank'; // Abrir enlace en una nueva pestaña
            linkElement.rel = 'noopener noreferrer'; // Añadir atributos de seguridad
            linkElement.textContent = part; // Mostrar el enlace como texto
            messageWithLinks.push(linkElement);

            // Generar una vista previa del enlace
            const linkPreview = createLinkPreview(part);
            messageWithLinks.push(linkPreview);
          }
        }
      } else if (part !== '') {
        messageWithLinks.push(document.createTextNode(part));
      }
    });

    return messageWithLinks;
  } else {
    // Si no se detectan enlaces, simplemente devolver el texto como un nodo de texto
    return [document.createTextNode(messageText)];
  }
}

// Función para crear una vista previa del enlace
function createLinkPreview(link) {
  const linkPreview = document.createElement('div');
  linkPreview.style.marginTop = '5px'; // Añadir un margen superior

  // Aquí puedes personalizar la apariencia de la vista previa del enlace
  linkPreview.innerHTML = `
    <div style="border: 1px solid #ccc; border-radius: 8px; padding: 10px;">
      <p style="margin: 0; font-weight: bold;">Vista previa del enlace:</p>
      <p>${link}</p>
    </div>
  `;

  return linkPreview;
}

// Función para obtener y mostrar mensajes desde la API con capacidad de búsqueda
function fetchAndDisplayMessages(searchText = '') {
  // Guardar la posición actual de desplazamiento
  const scrollPosition = chatMessages.scrollTop;

  fetch('http://uwu-guate.site:3000/messages')
    .then(response => response.json())
    .then(messages => {
      const filteredMessages = filterMessages(messages, searchText); // Filtrar mensajes
      displayMessages(filteredMessages); // Mostrar mensajes filtrados

      // Obtener el número actual de mensajes mostrados
      const newNumMessagesDisplayed = filteredMessages.length;

      // Restaurar la posición de desplazamiento después de actualizar los mensajes
      if (!userScrolledUp) {
        // Solo desplazar hacia abajo si hay nuevos mensajes
        if (newNumMessagesDisplayed > numMessagesDisplayed) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      } else {
        // Solo desplazate hacia abajo si no hay un nuevo mensaje
        if (scrollPosition === 0) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      }

      // Actualizar el número de mensajes actualmente mostrados
      numMessagesDisplayed = newNumMessagesDisplayed;
    })
    .catch(error => {
      console.error('Error fetching messages:', error);
    });
}

// Función para filtrar los mensajes según el texto de búsqueda
function filterMessages(messages, searchText) {
  return messages.filter(message => {
    const { content } = message;
    return content.toLowerCase().includes(searchText.toLowerCase()); // Filtrar mensajes que contienen el texto de búsqueda
  });
}

// Función para mostrar los mensajes en el chat
function displayMessages(messages) {
  chatMessages.innerHTML = ''; // Limpiar mensajes anteriores
  
  messages.forEach(message => {
    const { username, content } = message;

    const messageContainer = document.createElement('div');
    messageContainer.style.display = 'block'; // Ajuste para que cada mensaje esté en una línea separada
    
    const senderElement = document.createElement('div');
    senderElement.textContent = username + ":";
    senderElement.style.fontWeight = 'bold';
    messageContainer.appendChild(senderElement);

    const parsedMessage = parseMessageText(content);

    // Agregar los nodos de texto y las vistas previas al contenedor de mensajes
    parsedMessage.forEach(node => {
      messageContainer.appendChild(node);
    });

    // Aplicar estilos y clase CSS según el usuario
    if (username === 'javilejo') {
      messageContainer.style.cssText = `
        padding: 10px; 
        margin: 5px 0; 
        border-radius: 10px; 
        background-color: #0084FF; 
        color: #ffffff;
        align-self: flex-end; /* Alinear el mensaje a la derecha */
        max-width: 70%; /* Limitar el ancho del mensaje */
        margin-left: auto; /* Mover el mensaje hacia la derecha */
      `;
    } else {
      messageContainer.style.cssText = `
        padding: 10px; 
        margin: 5px 0; 
        border-radius: 10px; 
        background-color: #4CAF50; 
        color: #ffffff;
        align-self: flex-start; /* Alinear el mensaje a la izquierda */
        max-width: 70%; /* Limitar el ancho del mensaje */
        margin-right: auto; /* Mover el mensaje hacia la izquierda */
      `;
    }

    chatMessages.appendChild(messageContainer);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Crear elementos de chat
const userListContainer = document.createElement('div');
userListContainer.style.cssText = 'width: 20%; height: 100vh; overflow-y: auto; padding: 20px; box-sizing: border-box; background-color: #f0f0f0; position: fixed; top: 0; left: 0;';
document.body.appendChild(userListContainer);

const chatContainer = document.createElement('div');
chatContainer.style.cssText = 'width: 60%; height: 100vh; overflow-y: auto; padding: 20px; box-sizing: border-box; background-color: #e0e0e0; margin-left: 20%;';
document.body.appendChild(chatContainer);

const inputContainer = document.createElement('div');
inputContainer.style.cssText = 'width: 60%; position: fixed; bottom: 0; left: 20%; padding: 20px; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; background-color: #f0f0f0;';
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
inputField.style.cssText = 'flex: 1; padding: 15px; margin-right: 10px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; background-color: #ffffff; color: #000;'; // Aumentamos el tamaño de la barra para escribir
inputContainer.appendChild(inputField);

const sendButton = document.createElement('button');
sendButton.textContent = 'Enviar';
sendButton.style.cssText = 'padding: 15px 30px; margin-left: 10px; border: none; border-radius: 8px; cursor: pointer; background-color: #4CAF50; color: #ffffff;'; // Aumentamos el tamaño del botón de enviar y agregamos un margen izquierdo
inputContainer.appendChild(sendButton);

// Crear campo de búsqueda de mensajes
const searchInput = document.createElement('input');
searchInput.setAttribute('type', 'text');
searchInput.setAttribute('placeholder', 'Buscar mensajes...');
searchInput.style.cssText = 'width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; margin-bottom: 10px;';

// Insertar campo de búsqueda en el contenedor de entrada
inputContainer.insertBefore(searchInput, inputField);

// Evento de entrada para buscar mensajes mientras escribes
searchInput.addEventListener('input', function() {
  const searchText = this.value.trim(); // Obtener texto de búsqueda
  fetchAndDisplayMessages(searchText); // Obtener y mostrar mensajes filtrados
});

// Crear botón de cambio de modo
const modeToggleButton = document.createElement('button');
modeToggleButton.textContent = 'Cambiar Modo';
modeToggleButton.style.cssText = 'padding: 15px 30px; background-color: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; margin-right: 10px;'; // Aumentamos el tamaño del botón de cambiar modo y agregamos un margen derecho
inputContainer.appendChild(modeToggleButton);

// Crear flecha para ir al último mensaje
const arrowButton = document.createElement('button');
arrowButton.innerHTML = '&#8595;'; // Código de la flecha hacia abajo
arrowButton.style.cssText = 'position: fixed; bottom: 20px; right: 20px; font-size: 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; padding: 10px;';
document.body.appendChild(arrowButton);

// Crear contador de caracteres
const characterCounter = document.createElement('div');
characterCounter.textContent = '0/140'; // Inicialmente, muestra 0 caracteres de 140
characterCounter.style.cssText = 'color: #999;'; // Estilo del contador de caracteres
inputContainer.appendChild(characterCounter); // Agrega el contador al contenedor de entrada

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
  const maxChars = 139; // Máximo de caracteres permitidos
  if (messageText !== '') {
    if (messageText.length <= maxChars) {
      const messageBubble = document.createElement('div');
      
      // Agregar el nombre del remitente arriba del mensaje
      const senderName = document.createElement('div');
      senderName.textContent = 'javilejo';
      senderName.style.fontWeight = 'bold';
      messageBubble.appendChild(senderName);

      // Agregar el contenido del mensaje
      const messageContent = parseMessageText(messageText); // Parsear el texto del mensaje
      messageContent.forEach(node => {
        messageBubble.appendChild(node); // Agregar cada nodo al contenedor del mensaje
      });

      // Aplicar estilos para el mensaje enviado
      messageBubble.style.cssText = `
        padding: 10px; 
        margin: 5px 0; 
        border-radius: 10px; 
        background-color: #0084FF; 
        color: #ffffff;
        align-self: flex-end; /* Alinear el mensaje a la derecha */
        max-width: 70%; /* Limitar el ancho del mensaje */
        margin-left: auto; /* Mover el mensaje hacia la derecha */
      `;

      chatMessages.appendChild(messageBubble);
      inputField.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Enviar el mensaje a la API
      sendMessagetoAPI(senderName.textContent, messageText);
    } else {
      // Mostrar mensaje de error si se supera el límite de caracteres
      alert('El mensaje no puede tener más de 140 caracteres.');
    }
  } else {
    // Mostrar mensaje de error si el campo está vacío
    alert('Por favor, escribe un mensaje.');
  }
  
  // Actualizar el contador de caracteres
  countCharacters();
}

// Función para enviar mensaje a la API
function sendMessagetoAPI(username, message) {
  const data = {
    username: username,
    message: message
  };

  fetch('http://uwu-guate.site:3000/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => console.log('Mensaje enviado:', data))
  .catch(error => console.error('Error al enviar mensaje:', error));
}

// Función para contar caracteres del mensaje y actualizar el contador
function countCharacters() {
  const messageText = inputField.value.trim();
  const remainingChars = messageText.length;
  characterCounter.textContent = remainingChars + '/140';
  if (remainingChars > 139) {
    characterCounter.style.color = 'red'; // Cambiar color del contador si se excede el límite
    // Deshabilitar la entrada de más caracteres cuando se alcanza el límite
    inputField.value = inputField.value.slice(0, 139);
  } else {
    characterCounter.style.color = ''; // Restablecer color del contador si está dentro del límite
  }
}

// Evento de entrada para contar caracteres mientras escribes
inputField.addEventListener('input', countCharacters);

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

// Evento de desplazamiento para rastrear si el usuario ha desplazado manualmente hacia arriba
chatMessages.addEventListener('scroll', function() {
  userScrolledUp = this.scrollTop > 0;
});

// Llamar a la función para mostrar mensajes al cargar la página
fetchAndDisplayMessages();

// Función para refrescar automáticamente la lista de mensajes cada 5 segundos
function refreshMessages() {
  fetchAndDisplayMessages(); // Obtener y mostrar mensajes
}

// Establecer un intervalo para refrescar automáticamente la lista de mensajes cada 5 segundos
setInterval(refreshMessages, 5000);

// Llamar a la función para contar caracteres al inicio
countCharacters();

// Ejemplo: Agregar algunos usuarios a la lista
fetch('http://uwu-guate.site:3000/messages')
  .then(response => response.json())
  .then(users => {
    const uniqueUsers = new Set(); // Conjunto para almacenar nombres de usuario únicos
    users.forEach(user => {
      uniqueUsers.add(user.username); // Agregar cada nombre de usuario al conjunto
    });
    // Iterar sobre el conjunto de nombres de usuario para crear los elementos de la lista de usuarios
    uniqueUsers.forEach(username => {
      const listItem = document.createElement('li');
      listItem.textContent = username;
      userList.appendChild(listItem);
    });
  })
  .catch(error => {
    console.error('Error fetching users:', error);
  });


// Paleta de colores para modo oscuro
const darkModeColors = {
  background: '#36393f',
  headerText: '#b9bbbe',
  buttonBackground: '#7289da',
  inputBackground: '#40444b',
  inputText: '#dcddde',
};

// Paleta de colores para modo claro
const lightModeColors = {
  background: '#f0f0f0',
  headerText: '#000000',
  buttonBackground: '#4CAF50',
  inputBackground: '#ffffff',
  inputText: '#000000',
};

// Aplicar colores según el modo actual al cargar la página
const isDarkMode = document.body.classList.contains('dark-mode');
applyColors(isDarkMode);
