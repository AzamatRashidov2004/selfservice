import { useState, useEffect } from "react";
import "./Customize_Bot.css";
import Loader from "../Loader/Loader.js";
import { ChatBotSceleton } from "../../utility/types.js";
import { ChatBotSceletonDefaultSettings } from "../../utility/Bot_Util.js";
import { Palette, Type, Layers, MessageSquare, MousePointerClick } from 'lucide-react';

interface CustomizeBotProps {
  loading?: boolean;
  selectedProjectConfig?: Partial<ChatBotSceleton>;
  saveSettings: (settings: ChatBotSceleton) => Promise<void>;
}

interface ColorInputProps {
  label: string;
  iconComponent: React.ComponentType;
  colorKey: keyof ChatBotSceleton;
  fontColorKey: keyof ChatBotSceleton;
}

interface FontColorSwitchProps {
  color: string;
  onChange: (color: string) => void;
}

const CustomizeBot: React.FC<CustomizeBotProps> = ({
  loading,
  selectedProjectConfig,
  saveSettings,
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
    try {
      await saveSettings(config);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const ColorInput: React.FC<ColorInputProps> = ({ 
    label, 
    iconComponent: Icon, 
    colorKey, 
    fontColorKey 
  }) => (
    <div className="form-group">
      <label className="form-label">
        <Icon size={16} className="text-gray-600" />
        {label}
      </label>
      <div className="color-input-group">
        <div className="color-input">
          <span className="text-xs text-gray-500">Color</span>
          <input 
            type="color" 
            value={config[colorKey]}
            onChange={(e) => setConfig({...config, [colorKey]: e.target.value})}
          />
        </div>
        <div className="color-input">
          <span className="text-xs text-gray-500">Text</span>
          <FontColorSwitch
            color={config[fontColorKey]}
            onChange={(color) => setConfig({...config, [fontColorKey]: color})}
          />
        </div>
      </div>
    </div>
  );

  const FontColorSwitch: React.FC<FontColorSwitchProps> = ({ color, onChange }) => (
    <div className="font-color-switch">
      <button
        onClick={() => onChange('black')}
        className={`${color === 'black' ? 'active' : ''}`}
      >
        Dark
      </button>
      <button
        onClick={() => onChange('white')}
        className={`${color === 'white' ? 'active' : ''}`}
      >
        Light
      </button>
    </div>
  );
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
        <div className="controls-panel">
          <div className="controls-grid">
            <div className="controls-column">
            {/* Navbar Section */}
            <div className="section-card">
              <div className="section-header">
                <div className="icon-badge bg-blue-100">
                  <Layers className="text-blue-600" size={18} />
                </div>
                <h3 className="section-title">Navbar</h3>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Type size={16} className="text-gray-600" />
                  Title Text
                </label>
                <input
                  className="compact-input"
                  type="text" 
                  value={config.titleText}
                  onChange={(e) => setConfig({...config, titleText: e.target.value})}
                />
              </div>
              <ColorInput 
                label="Navbar Color" 
                iconComponent={Palette} 
                colorKey="navbarColor" 
                fontColorKey="titleFontColor" 
              />
            </div>
            {/* Buttons Configuration */}
            <div className="section-card">
              <div className="section-header">
                <div className="icon-badge bg-green-100">
                  <MousePointerClick className="text-green-600" size={18} />
                </div>
                <h3 className="section-title">Buttons</h3>
              </div>
              <ColorInput 
                label="Button Color" 
                iconComponent={Palette} 
                colorKey="suggestionButtonColor" 
                fontColorKey="suggestionButtonFontColor" 
              />
            </div>
            </div>

            {/* Message Configurations */}
            <div className="section-card">
              <div className="section-header">
                <div className="icon-badge bg-purple-100">
                  <MessageSquare className="text-purple-600" size={18} />
                </div>
                <h3 className="section-title">Messages</h3>
              </div>
              <div className="form-group">
                <h4 className="subsection-title">Bot Message</h4>
                <ColorInput 
                  label="Bubble Color" 
                  iconComponent={Palette} 
                  colorKey="botMessageColor" 
                  fontColorKey="botMessageFontColor" 
                />
              </div>
              <div className="form-group">
                <h4 className="subsection-title">User Message</h4>
                <ColorInput 
                  label="Bubble Color" 
                  iconComponent={Palette} 
                  colorKey="userMessageColor" 
                  fontColorKey="userMessageFontColor" 
                />
              </div>
            </div>

            
          </div>
        </div>

        {/* Chatbot Preview */}
        <div className="chatbot-preview">
          {/* Navbar */}
          <div 
            className="chatbot-navbar"
            style={{ 
              backgroundColor: config.navbarColor,
              color: config.titleFontColor
            }}
          >
            <span className="navbar-icon">≡</span>
            {config.titleText}
          </div>
          
          {/* Chat Messages Area */}
          <div className="chat-messages">
            <div className="bot-message-container">
              <div className="bot-message">
                <div className="bot-icon">
                  <i className="fas fa-robot"></i>
                </div>
                <div 
                  className="message-bubble"
                  style={{ 
                    backgroundColor: config.botMessageColor,
                    color: config.botMessageFontColor
                  }}
                >
                  Bot message 1
                </div>
              </div>
            </div>
            
            <div className="user-message">
              <div className="user-icon">
                <i className="fas fa-user"></i>
              </div>
              <div 
                className="message-bubble"
                style={{ 
                  backgroundColor: config.userMessageColor,
                  color: config.userMessageFontColor
                }}
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
                  style={{ 
                    backgroundColor: config.botMessageColor,
                    color: config.botMessageFontColor
                  }}
                >
                  Bot message 2
                </div>
              </div>
              
              <div className="suggestions">
                <button 
                  className="suggestion-btn"
                  style={{ 
                    backgroundColor: config.suggestionButtonColor,
                    color: config.suggestionButtonFontColor
                  }}
                >
                  Button 1
                </button>
                <button 
                  className="suggestion-btn"
                  style={{ 
                    backgroundColor: config.suggestionButtonColor,
                    color: config.suggestionButtonFontColor
                  }}
                >
                  Button 2
                </button>
                <button 
                  className="suggestion-btn"
                  style={{ 
                    backgroundColor: config.suggestionButtonColor,
                    color: config.suggestionButtonFontColor
                  }}
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
      
      {/* Create Project Button */}
      {!loading && (
        <div className="create-project-container">
          <button 
            className="create-project-button"
            onClick={handleSubmit}
          >
            Create Project
          </button>
        </div>
      )}
    </section>
  );
};

export default CustomizeBot;