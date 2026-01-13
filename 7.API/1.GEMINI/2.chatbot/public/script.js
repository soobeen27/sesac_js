const input = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
const chatbox = document.getElementById('chatbox');

function add(role, text) {
  console.log(`Role: ${role}, Text: ${text}`);
  const bubble = document.createElement('div');

  if (role === 'user') {
    bubble.classList.add('flex', 'items-end', 'justify-end', 'space-x-2');
    bubble.innerHTML = `
            <div class="flex flex-col space-y-1 max-w-[70%] items-end">
              <div class="bg-blue-500 p-3 rounded-2xl rounded-tr-none shadow-sm text-sm text-white">
                ${text}
              </div>
              <div class="flex items-center space-x-1">
                <span class="text-[10px] text-gray-400">${new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>`;
  } else {
    bubble.className = 'flex items-end space-x-2';
    bubble.innerHTML = `
              <img src="https://i.pravatar.cc/150?img=32" alt="Avatar" class="w-8 h-8 rounded-full bg-gray-300 mb-1" />
            <div class="flex flex-col space-y-1 max-w-[70%]">
              <div
                class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-800 border border-gray-100"
              >
                ${text}
              </div>
              <span class="text-[10px] text-gray-400 ml-1">${new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}</span>
            </div>`;
  }
  chatbox.appendChild(bubble);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function chat(message) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  return data.reply;
}

async function send() {
  const text = input.value.trim();
  if (!text) return;

  add('user', text);
  input.value = '';

  try {
    const reply = await chat(text);
    add('bot', reply);
  } catch (e) {
    console.error(e);
    add('bot', '오류가 발생했습니다.');
  }
}

sendBtn.addEventListener('click', send);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.isComposing) {
    send();
  }
});
