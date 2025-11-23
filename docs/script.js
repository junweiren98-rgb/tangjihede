document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.querySelector('.chat-window');
    const messageInput = document.querySelector('.chat-input-area input');
    const sendButton = document.querySelector('.chat-input-area button');
    const exampleButtons = document.querySelectorAll('.user-examples button');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const chatMain = document.querySelector('.chat-main');
    const settingsPage = document.querySelector('.settings-page');
    const saveButton = document.getElementById('save-settings');
    const apiUrlInput = document.getElementById('api-url');
    const apiKeyInput = document.getElementById('api-key');
    const saveStatus = document.getElementById('save-status');

    // --- 页面加载时读取设置 ---
    apiUrlInput.value = localStorage.getItem('apiUrl') || '';
    apiKeyInput.value = localStorage.getItem('apiKey') || '';

    // --- 核心：API调用函数 (当前为模拟) ---
    async function getBotResponse(userInput) {
        // 在这里替换为你的真实API调用
        const apiUrl = localStorage.getItem('apiUrl');
        const apiKey = localStorage.getItem('apiKey');

        if (!apiUrl || !apiKey) {
            return '请先在“设置”中配置您的API URL和API Key。';
        }

        // 真实API调用
        try {
            const response = await fetch('https://tangjihede.vercel.app/api/v3/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'ep-20251119225317-xwjk4',
                    messages: [
                        { role: 'system', content: '你是人工智能助手' },
                        { role: 'user', content: userInput }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API 错误:', errorData);
                return `抱歉，调用模型时出错: ${errorData.error.message}`;
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error('网络或代理错误:', error);
            return '抱歉，无法连接到代理服务器。请确保它正在运行。';
        }
    }

    // --- 消息处理 ---
    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `chat-message-${sender}`);
        messageElement.textContent = message;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight; // 自动滚动到底部
    }

    async function handleSendMessage() {
        const userInput = messageInput.value.trim();
        if (userInput === '') return;

        addMessage(userInput, 'user');
        messageInput.value = '';
        sendButton.disabled = true; // 防止重复发送

        const botResponse = await getBotResponse(userInput);
        addMessage(botResponse, 'bot');
        sendButton.disabled = false;
    }

    // --- 事件监听 ---
    sendButton.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    exampleButtons.forEach(button => {
        button.addEventListener('click', () => {
            messageInput.value = button.textContent;
            messageInput.focus();
        });
    });

    // --- 页面切换逻辑 ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // 阻止链接默认跳转行为
            const targetPage = link.getAttribute('href');

            // 移除所有链接的激活状态
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            // 为当前点击的链接添加激活状态
            link.parentElement.classList.add('active');

            if (targetPage === '#settings') {
                chatMain.style.display = 'none';
                settingsPage.style.display = 'block';
            } else {
                chatMain.style.display = 'flex';
                settingsPage.style.display = 'none';
            }
        });
    });

    // --- 聊天消息样式 (动态添加) ---
    const style = document.createElement('style');
    style.textContent = `
        .chat-message {
            padding: 10px 15px;
            border-radius: 18px;
            margin-bottom: 10px;
            max-width: 70%;
            word-wrap: break-word;
        }
        .chat-message-user {
            background-color: #4a4a6a;
            color: #e0e0e0;
            align-self: flex-end;
            margin-left: auto; /* 靠右对齐 */
        }
        .chat-message-bot {
            background-color: #2a2a45;
            color: #e0e0e0;
            align-self: flex-start;
        }
        .chat-window {
            display: flex;
            flex-direction: column;
        }
    `;
    document.head.appendChild(style);
});
