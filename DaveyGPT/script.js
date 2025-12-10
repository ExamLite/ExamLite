const responses = [
  "Neat.",
  "Neat.",
  "Neat.",
  "Neat.",
  "Neat.",
  "Neat.",
  "Neat.",
  "Neat.",
  "Neat.",
  "Neat.",
  "Neat.",
  "Neat.",
  "lol",
  "https://canterlotavenue.com/blog/410/the-entire-bee-movie-script/",
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes – definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don’t count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful."
];

const chatHistory = document.getElementById("chatHistory");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatHistory.appendChild(msg);

  // Auto-scroll to bottom
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function handleSend() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  // Fake AI response
  const randomIndex = Math.floor(Math.random() * responses.length);
  const aiResponse = responses[randomIndex];

  setTimeout(() => {
    addMessage(aiResponse, "ai");
  }, 400); // small delay for realism
}

sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});
