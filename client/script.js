import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");
let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  // Replace **----Title----** with <strong>Title</strong>
  const formattedText = text.replace(/\*\*----(.*?)----\*\*/g, "<strong>$1</strong>");

  let interval = setInterval(() => {
    if (index < formattedText.length) {
      element.innerHTML += formattedText.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}


function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
      <div class="wrapper ${isAi ? " ai ai-response" : ""}">
         <div class="chat">
              <div class="profile">
                   <img 
                       src="${isAi ? bot : user}"
                       alt="${isAi ? "Bot" : "User"}"
                    />
              </div>

              <div class="message" id="${uniqueId}">${value}</div>
            </div>
       </div>
     `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  // User's chat stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'), generateUniqueId());
  form.reset();

  // Bot's chat stripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, "", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  try {
    // Fetch data from server
    const response = await fetch('https://codex-ai-zvaz.onrender.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set content type for JSON
      },
      body: JSON.stringify({
        prompt: data.get('prompt')
      })
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot;
      console.log(parsedData);
               
      

      typeText(messageDiv,parsedData );
    } else {
      const err = await response.text();
      messageDiv.innerHTML = "Something went wrong";
      
    }
  } catch (error) {
    clearInterval(loadInterval);
    messageDiv.innerHTML = "Something went wrong";
    console.error('Error:', error);
  }
}

form.addEventListener('submit', handleSubmit);

form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
