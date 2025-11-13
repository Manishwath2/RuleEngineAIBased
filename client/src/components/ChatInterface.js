import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatInterface.css';

const ChatInterface = ({ onRuleCreated, sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your AI Rule Configurator. You can describe insurance rules in natural language, and I\'ll help you create them. For example, try: "if the person is smoker and age is above 40 then execute success action"'
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId
        }),
      });

      const data = await response.json();

      // Add AI response to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }]);

      // If a rule was successfully created, notify parent
      if (data.success && data.rule) {
        onRuleCreated(data.rule);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>AI Rule Configurator</h2>
        <p>Describe your rules in natural language</p>
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-avatar">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        <textarea
          className="chat-input"
          placeholder="Describe your rule... (e.g., 'if age is above 40 and person is smoker')"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          rows="2"
        />
        <button 
          className="send-button" 
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
