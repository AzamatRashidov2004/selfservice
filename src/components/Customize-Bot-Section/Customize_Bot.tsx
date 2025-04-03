import { useState, useEffect } from "react";
import { Palette, Save, Zap } from 'lucide-react';
import { ChatBotSceleton } from "../../utility/types.js";
import { ChatBotSceletonDefaultSettings } from "../../utility/Bot_Util.js";
import Loader from "../Loader/Loader.js";
import "./Customize_Bot.css";

interface CustomizeBotProps {
  loading?: boolean;
  selectedProjectConfig?: Partial<ChatBotSceleton>;
  saveSettings: (settings: ChatBotSceleton) => Promise<void>;
}

const colorSchemes = [
  {
    titleText: "Classic Blue",
    navbarColor: "#1a73e8",
    titleFontColor: "white",
    botMessageColor: "#f0f4f8",
    botMessageFontColor: "black",
    userMessageColor: "#1a73e8",
    userMessageFontColor: "white",
    suggestionButtonColor: "#e8f0fe",
    suggestionButtonFontColor: "#1a73e8",
    frameBorderColor: "white",
  },
  {
    titleText: "Forest Green",
    navbarColor: "#2e7d32",
    titleFontColor: "white",
    botMessageColor: "#f1f8e9",
    botMessageFontColor: "black",
    userMessageColor: "#2e7d32",
    userMessageFontColor: "white",
    suggestionButtonColor: "#c8e6c9",
    suggestionButtonFontColor: "#2e7d32",
    frameBorderColor: "white",
  },
  {
    titleText: "Warm Orange",
    navbarColor: "#ed6c02",
    titleFontColor: "white",
    botMessageColor: "#fff3e0",
    botMessageFontColor: "black",
    userMessageColor: "#ed6c02",
    userMessageFontColor: "white",
    suggestionButtonColor: "#ffe0b2",
    suggestionButtonFontColor: "#ed6c02",
    frameBorderColor: "white",
  },
  {
    titleText: "Elegant Purple",
    navbarColor: "#7b1fa2",
    titleFontColor: "white",
    botMessageColor: "#f3e5f5",
    botMessageFontColor: "black",
    userMessageColor: "#7b1fa2",
    userMessageFontColor: "white",
    suggestionButtonColor: "#e1bee7",
    suggestionButtonFontColor: "#7b1fa2",
    frameBorderColor: "white",
  },
  {
    titleText: "Dark Mode",
    navbarColor: "#1e1e1e",
    titleFontColor: "white",
    botMessageColor: "#2d2d30",
    botMessageFontColor: "white",
    userMessageColor: "#505050",
    userMessageFontColor: "white",
    suggestionButtonColor: "#3e3e42",
    suggestionButtonFontColor: "white",
    frameBorderColor: "white",
  }
];

const CustomizeBot: React.FC<CustomizeBotProps> = ({
  loading,
  selectedProjectConfig,
  saveSettings,
}) => {
  const [config, setConfig] = useState<ChatBotSceleton>({
    ...ChatBotSceletonDefaultSettings,
    ...(selectedProjectConfig || {}),
  });
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProjectConfig) {
      setConfig(prev => ({ ...prev, ...selectedProjectConfig }));
    }
  }, [selectedProjectConfig]);

  const handleSubmit = async () => {
    try {
      console.log("the result config is : ", config as ChatBotSceleton);
      await saveSettings(config as ChatBotSceleton);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const applyColorScheme = (scheme: any) => {
    setConfig(scheme);
  };

  const renderCustomizationPanel = () => {
    if (!activeComponent) return null;

    const panels: Record<string, JSX.Element> = {
      navbar: (
        <div className="customization-panel">
          <h3>Navbar Customization</h3>
          <div className="form-group">
            <label>Title Text</label>
            <input 
              type="text" 
              value={config.titleText}
              onChange={(e) => setConfig({...config, titleText: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Navbar Color</label>
            <input 
              type="color" 
              value={config.navbarColor}
              onChange={(e) => setConfig({...config, navbarColor: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Text Color</label>
            <div className="color-toggle">
              <button 
                className={`${config.titleFontColor === 'white' ? 'active' : ''}`}
                onClick={() => setConfig({...config, titleFontColor: 'white'})}
              >Light</button>
              <button 
                className={`${config.titleFontColor === 'black' ? 'active' : ''}`}
                onClick={() => setConfig({...config, titleFontColor: 'black'})}
              >Dark</button>
            </div>
          </div>
        </div>
      ),
      botMessage: (
        <div className="customization-panel">
          <h3>Bot Message Customization</h3>
          <div className="form-group">
            <label>Background Color</label>
            <input 
              type="color" 
              value={config.botMessageColor}
              onChange={(e) => setConfig({...config, botMessageColor: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Text Color</label>
            <div className="color-toggle">
              <button 
                className={`${config.botMessageFontColor === 'white' ? 'active' : ''}`}
                onClick={() => setConfig({...config, botMessageFontColor: 'white'})}
              >Light</button>
              <button 
                className={`${config.botMessageFontColor === 'black' ? 'active' : ''}`}
                onClick={() => setConfig({...config, botMessageFontColor: 'black'})}
              >Dark</button>
            </div>
          </div>
        </div>
      ),
      userMessage: (
        <div className="customization-panel">
          <h3>User Message Customization</h3>
          <div className="form-group">
            <label>Background Color</label>
            <input 
              type="color" 
              value={config.userMessageColor}
              onChange={(e) => setConfig({...config, userMessageColor: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Text Color</label>
            <div className="color-toggle">
              <button 
                className={`${config.userMessageFontColor === 'white' ? 'active' : ''}`}
                onClick={() => setConfig({...config, userMessageFontColor: 'white'})}
              >Light</button>
              <button 
                className={`${config.userMessageFontColor === 'black' ? 'active' : ''}`}
                onClick={() => setConfig({...config, userMessageFontColor: 'black'})}
              >Dark</button>
            </div>
          </div>
        </div>
      ),
      suggestionButtons: (
        <div className="customization-panel">
          <h3>Suggestion Buttons Customization</h3>
          <div className="form-group">
            <label>Background Color</label>
            <input 
              type="color" 
              value={config.suggestionButtonColor}
              onChange={(e) => setConfig({...config, suggestionButtonColor: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Text Color</label>
            <div className="color-toggle">
              <button 
                className={`${config.suggestionButtonFontColor === 'white' ? 'active' : ''}`}
                onClick={() => setConfig({...config, suggestionButtonFontColor: 'white'})}
              >Light</button>
              <button 
                className={`${config.suggestionButtonFontColor === 'black' ? 'active' : ''}`}
                onClick={() => setConfig({...config, suggestionButtonFontColor: 'black'})}
              >Dark</button>
            </div>
          </div>
        </div>
      ),
      frame: (
        <div className="customization-panel">
          <h3>Chat Frame Customization</h3>
          <div className="form-group">
            <label>Background Color</label>
            <input 
              type="color" 
              value={config.frameBorderColor}
              onChange={(e) => setConfig({...config, frameBorderColor: e.target.value})}
            />
          </div>
        </div>
      ),
      colorSchemes: (
        <div className="customization-panel">
          <h3>Color Schemes</h3>
          <div className="color-schemes-list">
            {colorSchemes.map((scheme, index) => (
              <div 
                key={index} 
                className="color-scheme-item"
                onClick={() => applyColorScheme(scheme)}
              >
                <div className="scheme-preview">
                  <div style={{backgroundColor: scheme.navbarColor}}></div>
                  <div style={{backgroundColor: scheme.botMessageColor}}></div>
                  <div style={{backgroundColor: scheme.userMessageColor}}></div>
                  <div style={{backgroundColor: scheme.suggestionButtonColor}}></div>
                </div>
                <span>{scheme.titleText}</span>
              </div>
            ))}
          </div>
        </div>
      )
    };

    return panels[activeComponent] || null;
  };

  return (
    <>
    <div className="bot-customizer">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      {loading ? (
        <div className="loader-container">
          <Loader loaderText="Creating Project" />
        </div>
      ) : (
        <div className="bot-customizer-container">

          
          <div className="customizer-content">
            <div className="chatbot-preview-container">
              <div 
                className="chatbot-preview"
                style={{
                  backgroundColor: `${config.frameBorderColor} !important`,
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                {/* Navbar - Clickable */}
                <div 
                  className="chatbot-navbar clickable"
                  style={{ 
                    backgroundColor: config.navbarColor,
                    color: config.titleFontColor
                  }}
                  onClick={() => setActiveComponent("navbar")}
                >
                  <div className="section-hint">
                    <Zap size={14} />
                    <span>Click to edit</span>
                  </div>
                  <span className="navbar-icon">≡</span>
                  {config.titleText}
                </div>
                
                {/* Chat Messages Area */}
                <div 
                  className="chat-messages clickable"
                  style={{
                    backgroundColor: config.frameBorderColor,
                  }}
                  onClick={() => setActiveComponent("frame")}
                >
                  {activeComponent === "frame" && (
                    <div className="section-hint">
                      <Zap size={14} />
                      <span>Editing frame</span>
                    </div>
                  )}
                  
                  {/* Bot Message - Clickable */}
                  <div className="bot-message-container">
                    <div className="bot-message">
                      <div className="bot-icon">
                        <i className="fas fa-robot"></i>
                      </div>
                      <div 
                        className="message-bubble clickable"
                        style={{ 
                          backgroundColor: config.botMessageColor,
                          color: config.botMessageFontColor
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveComponent("botMessage");
                        }}
                      >
                        {activeComponent === "botMessage" && (
                          <div className="section-hint">
                            <Zap size={14} />
                            <span>Editing bot message</span>
                          </div>
                        )}
                        Hello! How can I help you today?
                      </div>
                    </div>
                  </div>
                  
                  {/* User Message - Clickable */}
                  <div className="user-message">
                    <div className="user-icon">
                      <i className="fas fa-user"></i>
                    </div>
                    <div 
                      className="message-bubble clickable"
                      style={{ 
                        backgroundColor: config.userMessageColor,
                        color: config.userMessageFontColor
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveComponent("userMessage");
                      }}
                    >
                      {activeComponent === "userMessage" && (
                        <div className="section-hint">
                          <Zap size={14} />
                          <span>Editing user message</span>
                        </div>
                      )}
                      I have a question about your services
                    </div>
                  </div>

                  <div className="bot-message-container">
                    <div className="bot-message">
                      <div className="bot-icon">
                        <i className="fas fa-robot"></i>
                      </div>
                      <div 
                        className="message-bubble clickable"
                        style={{ 
                          backgroundColor: config.botMessageColor,
                          color: config.botMessageFontColor
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveComponent("botMessage");
                        }}
                      >
                        Sure! I'd be happy to help. What would you like to know?
                      </div>
                    </div>
                    
                    {/* Suggestion Buttons - Clickable */}
                    <div 
                      className="suggestions clickable"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveComponent("suggestionButtons");
                      }}
                    >
                      {activeComponent === "suggestionButtons" && (
                        <div className="section-hint">
                          <Zap size={14} />
                          <span>Editing buttons</span>
                        </div>
                      )}
                      <button 
                        className="suggestion-btn"
                        style={{ 
                          backgroundColor: config.suggestionButtonColor,
                          color: config.suggestionButtonFontColor
                        }}
                      >
                        Pricing
                      </button>
                      <button 
                        className="suggestion-btn"
                        style={{ 
                          backgroundColor: config.suggestionButtonColor,
                          color: config.suggestionButtonFontColor
                        }}
                      >
                        Features
                      </button>
                      <button 
                        className="suggestion-btn"
                        style={{ 
                          backgroundColor: config.suggestionButtonColor,
                          color: config.suggestionButtonFontColor
                        }}
                      >
                        Support
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
            
            {/* Customization Panel */}

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
              <button 
                className="toolbar-button"
                onClick={() => setActiveComponent("colorSchemes")}
              >
                <Palette size={18} />
                Color Schemes
              </button>
            {
            renderCustomizationPanel()
            }
            </div>
          </div>
        </div>
      )}          
    </div>
    <div className="customizer-header">
              {/*<button 
                className="toolbar-button"
                onClick={() => setActiveComponent("colorSchemes")}
              >
                <Palette size={18} />
                Color Schemes
              </button>*/}
              <button 
                className="save-button"
                onClick={handleSubmit}
              >
                <Save size={18} />
                Save Settings
              </button>
            </div>
          </>
  );
};

export default CustomizeBot;