// Venturalink Chatbot Frontend JavaScript
class VenturalinkChatbot {
  constructor() {
    this.isOpen = false;
    this.isLoading = false;
    this.messageHistory = [];
    this.apiUrl = window.location.origin + '/api/chat';
    
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.bindEvents();
    this.addWelcomeMessage();
  }

  createChatbotHTML() {
    // Create chatbot container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.className = 'chatbot-container';
    chatbotContainer.innerHTML = `
      <button class="chatbot-toggle" id="chatbotToggle">
        <svg class="chatbot-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      </button>
      
      <div class="chatbot-window" id="chatbotWindow">
        <div class="chatbot-header">
          <div>
            <h3 class="chatbot-title">Venturalink AI</h3>
            <p class="chatbot-subtitle">Your startup assistant</p>
          </div>
          <button class="chatbot-close" id="chatbotClose">×</button>
        </div>
        
        <div class="chatbot-messages" id="chatbotMessages">
          <!-- Messages will be added here -->
        </div>
        
        <div class="chatbot-input-container">
          <input 
            type="text" 
            class="chatbot-input" 
            id="chatbotInput" 
            placeholder="Ask me about startups, funding, or business..."
            maxlength="500"
          >
          <button class="chatbot-send" id="chatbotSend">
            <svg class="chatbot-send-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        
        <div class="chatbot-status" id="chatbotStatus">
          Ready to help with your startup journey!
        </div>
      </div>
    `;

    document.body.appendChild(chatbotContainer);
  }

  bindEvents() {
    const toggle = document.getElementById('chatbotToggle');
    const close = document.getElementById('chatbotClose');
    const input = document.getElementById('chatbotInput');
    const send = document.getElementById('chatbotSend');

    toggle.addEventListener('click', () => this.toggleChatbot());
    close.addEventListener('click', () => this.closeChatbot());
    send.addEventListener('click', () => this.sendMessage());
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Close chatbot when clicking outside
    document.addEventListener('click', (e) => {
      const chatbot = document.querySelector('.chatbot-container');
      if (this.isOpen && !chatbot.contains(e.target)) {
        this.closeChatbot();
      }
    });
  }

  toggleChatbot() {
    if (this.isOpen) {
      this.closeChatbot();
    } else {
      this.openChatbot();
    }
  }

  openChatbot() {
    this.isOpen = true;
    const toggle = document.getElementById('chatbotToggle');
    const window = document.getElementById('chatbotWindow');
    
    toggle.classList.add('active');
    window.classList.add('active');
    
    // Focus on input
    setTimeout(() => {
      document.getElementById('chatbotInput').focus();
    }, 300);
  }

  closeChatbot() {
    this.isOpen = false;
    const toggle = document.getElementById('chatbotToggle');
    const window = document.getElementById('chatbotWindow');
    
    toggle.classList.remove('active');
    window.classList.remove('active');
  }

  addWelcomeMessage() {
    const welcomeMessages = [
      "👋 Hi! I'm Venturalink's AI assistant. I can help you with:",
      "💡 Startup advice and business strategies",
      "💰 Funding and investment guidance", 
      "🤝 Networking and partnership opportunities",
      "📈 Growth and scaling strategies",
      "",
      "What would you like to know about your startup journey?"
    ];

    welcomeMessages.forEach((message, index) => {
      setTimeout(() => {
        this.addMessage(message, 'bot');
      }, index * 200);
    });
  }

  async sendMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message || this.isLoading) return;

    // Add user message
    this.addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    try {
      this.isLoading = true;
      this.updateStatus('Thinking...', 'success');
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      
      this.hideTypingIndicator();
      
      if (response.ok) {
        this.addMessage(data.reply, 'bot');
        this.updateStatus('Ready to help!', 'success');
        this.messageHistory.push({ role: 'user', content: message });
        this.messageHistory.push({ role: 'bot', content: data.reply });
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage('Sorry, I encountered an error. Please try again later.', 'bot');
      this.updateStatus('Error: ' + error.message, 'error');
      console.error('Chatbot Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  addMessage(content, type) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${type}`;
    messageDiv.textContent = content;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<div class="chatbot-loading"></div> Thinking...';
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  updateStatus(message, type = '') {
    const status = document.getElementById('chatbotStatus');
    status.textContent = message;
    status.className = `chatbot-status ${type}`;
  }

  // Public method to add custom messages
  addCustomMessage(content, type = 'bot') {
    this.addMessage(content, type);
  }

  // Public method to clear chat history
  clearHistory() {
    const messagesContainer = document.getElementById('chatbotMessages');
    messagesContainer.innerHTML = '';
    this.messageHistory = [];
    this.addWelcomeMessage();
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if chatbot doesn't already exist
  if (!document.querySelector('.chatbot-container')) {
    window.venturalinkChatbot = new VenturalinkChatbot();
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VenturalinkChatbot;
}
