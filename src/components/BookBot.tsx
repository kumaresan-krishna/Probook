import React, { useState, useEffect, useRef } from 'react';
import { BookBotService, ChatMessage, Book } from '../lib/bookBotService';
import '../styles/BookBot.css';

interface BookBotProps {
  books: Book[];
  apiKey?: string;
}

const BookBot: React.FC<BookBotProps> = ({ books, apiKey }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatServiceRef = useRef<BookBotService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize the chat service
  useEffect(() => {
    // Create a new service instance with API key if provided
    chatServiceRef.current = new BookBotService(apiKey);
    
    // Set the user's library for context-aware recommendations
    chatServiceRef.current.setUserLibrary(books);
    
    // Add a welcome message
    setChatMessages([{
      role: 'assistant',
      content: "Hello! I'm Bri, your Bibliophile Reader Interface. I can help you discover new books, provide recommendations, answer questions about books you're reading, and more. How can I assist you today?"
    }]);
    
    return () => {
      // Clean up
      if (chatServiceRef.current) {
        chatServiceRef.current.clearChatHistory();
      }
    };
  }, [apiKey]);

  // Update the book library whenever it changes
  useEffect(() => {
    if (chatServiceRef.current) {
      chatServiceRef.current.setUserLibrary(books);
    }
  }, [books]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim() || isLoading || !chatServiceRef.current) return;
    
    const userMessage = userInput.trim();
    setUserInput('');
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsLoading(true);
    
    try {
      // Get recommendation from service
      const response = await chatServiceRef.current.getRecommendation(userMessage);
      
      // Add assistant response to chat
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error getting recommendation:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (chatServiceRef.current) {
      chatServiceRef.current.clearChatHistory();
      setChatMessages([{
        role: 'assistant',
        content: "Hello! I'm Bri, your Bibliophile Reader Interface. I can help you discover new books, provide recommendations, answer questions about books you're reading, and more. How can I assist you today?"
      }]);
    }
  };

  // Format message content with Markdown-like formatting
  const formatMessageContent = (content: string) => {
    // Replace book titles with italic text (text surrounded by *)
    let formattedContent = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Replace bold text (text surrounded by **)
    formattedContent = formattedContent.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Split by paragraphs and wrap in p tags
    const paragraphs = formattedContent.split('\n\n').filter(p => p.trim() !== '');
    
    return paragraphs.map((paragraph, index) => (
      <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
    ));
  };

  return (
    <div className="book-bot-container">
      <div className="book-bot-header">
        <h2>Bri - Your Bibliophile Reader Interface</h2>
        <button 
          className="clear-chat-btn" 
          onClick={handleClearChat}
          title="Clear chat history"
        >
          🗑️
        </button>
      </div>
      
      <div className="book-bot-messages">
        {chatMessages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <div className="message-content">
              {formatMessageContent(message.content)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant-message">
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="book-bot-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Ask me about books..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !userInput.trim()}>
          ➤
        </button>
      </form>
    </div>
  );
};

export default BookBot; 