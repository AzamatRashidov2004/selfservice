import { useState, useEffect } from "react";
import "./Customize_Bot.css";
import Loader from "../Loader/Loader.js";
import { ChatBotSceleton } from "../../utility/types.js";
import { ChatBotSceletonDefaultSettings } from "../../utility/Bot_Util.js";

interface CustomizeBotProps {
  loading?: boolean;
  selectedProjectConfig?: Partial<ChatBotSceleton>;
  saveSettings: (settings: ChatBotSceleton) => Promise<void>;
}

const CustomizeBot: React.FC<CustomizeBotProps> = ({
  loading,
  selectedProjectConfig,
  saveSettings, // Make sure to include saveSettings in props
}) => {
  const [config, setConfig] = useState<ChatBotSceleton>({
    ...ChatBotSceletonDefaultSettings,
    ...(selectedProjectConfig || {}),
  });

  useEffect(() => {
    if (selectedProjectConfig) {
      setConfig(prev => ({ ...prev, ...selectedProjectConfig }));
    }
  }, [selectedProjectConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call saveSettings with the current configuration
      await saveSettings(config);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <section className="bot-customization-section">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      {loading ? (
        <div className="loader-container">
          <Loader loaderText="Creating Project" />
        </div>
      ) : (
      
      <div className="chatbot-container">
        {/* Controls Panel */}
        <div className="control-panel">
          <h2>Customize Chatbot</h2>
          
          <div className="color-control">
            <label>Navbar Color:</label>
            <input 
              type="color" 
              value={config.navbarColor}
              onChange={(e) => setConfig({...config, navbarColor: e.target.value})}
            />
          </div>
          
          <div className="color-control">
            <label>Bot Message Color:</label>
            <input 
              type="color" 
              value={config.botMessageColor}
              onChange={(e) => setConfig({...config, botMessageColor: e.target.value})}
            />
          </div>
          
          <div className="color-control">
            <label>User Message Color:</label>
            <input 
              type="color" 
              value={config.userMessageColor}
              onChange={(e) => setConfig({...config, userMessageColor: e.target.value})}
            />
          </div>
          
          <div className="color-control">
            <label>Suggestion Button Color:</label>
            <input 
              type="color" 
              value={config.suggestionButtonColor}
              onChange={(e) => setConfig({...config, suggestionButtonColor: e.target.value})}
            />
          </div>
          
          <button className="save-button" onClick={handleSubmit}>
            <b>Create Project</b>
          </button>
        </div>
        
        {/* Chatbot Preview */}
        <div className="chatbot-preview">
          {/* Navbar */}
          <div 
            className="chatbot-navbar"
            style={{ backgroundColor: config.navbarColor }}
          >
            <span className="navbar-icon">≡</span>
            Chatbot
          </div>
          
          {/* Chat Messages Area */}
          <div className="chat-messages">
            {/* Bot Message with Suggestions Below */}
            <div className="bot-message-container">
              <div className="bot-message">
                <div className="bot-icon">
                  <i className="fas fa-robot"></i>
                </div>
                <div 
                  className="message-bubble"
                  style={{ backgroundColor: config.botMessageColor, color: 'white' }}
                >
                  Bot message 1
                </div>
              </div>
            </div>
            
            {/* User Message */}
            <div className="user-message">
              <div className="user-icon">
                <i className="fas fa-user"></i>
              </div>
              <div 
                className="message-bubble"
                style={{ backgroundColor: config.userMessageColor, color: 'white' }}
              >
                User message
              </div>
            </div>
            <div className="bot-message-container">
              <div className="bot-message">
                <div className="bot-icon">
                  <i className="fas fa-robot"></i>
                </div>
                <div 
                  className="message-bubble"
                  style={{ backgroundColor: config.botMessageColor, color: 'white' }}
                >
                  Bot message 2
                </div>
              </div>
              
              {/* Suggestion Buttons Below Bot Message */}
              <div className="suggestions">
                <button 
                  className="suggestion-btn"
                  style={{ backgroundColor: config.suggestionButtonColor }}
                >
                  Button 1
                </button>
                <button 
                  className="suggestion-btn"
                  style={{ backgroundColor: config.suggestionButtonColor }}
                >
                  Button 2
                </button>
                <button 
                  className="suggestion-btn"
                  style={{ backgroundColor: config.suggestionButtonColor }}
                >
                  Button 3
                </button>
              </div>
            </div>
          </div>

          
          
          {/* Input Area */}
          <div className="input-area">
            <div className="message-input"></div>
            <button className="send-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      )}
    </section>
  );
};

export default CustomizeBot;