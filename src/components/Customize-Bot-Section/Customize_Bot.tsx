import { useState, useEffect } from "react";
import { Save, Zap } from 'lucide-react';
import { ChatBotSceleton } from "../../utility/types.js";
import { ChatBotSceletonDefaultSettings } from "../../utility/Bot_Util.js";
import Loader from "../Loader/Loader.js";
import "./Customize_Bot.css";
import { ChromePicker } from 'react-color';

// Update the interface to include input field customization
interface CustomizeBotProps {
  loading?: boolean;
  selectedProjectConfig?: Partial<ChatBotSceleton>;
  saveSettings: (settings: ChatBotSceleton) => Promise<void>;
}

// Update default types in your types.js file
// Extend ChatBotSceleton to include these new properties:
// inputFieldColor: string;
// inputFieldFontColor: string;
// sendButtonColor: string;

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
    sendButtonColor: "#1a73e8",
    inputBackgroundColor: "#f5f5f5",
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
    sendButtonColor: "#2e7d32",
    inputBackgroundColor: "#f5f5f5",
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
    sendButtonColor: "#ed6c02",
    inputBackgroundColor: "#f5f5f5",
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
    sendButtonColor: "#7b1fa2",
    inputBackgroundColor: "#f5f5f5",
  },
  {
    titleText: "VS Code Dark",
    navbarColor: "#1e1e1e",
    titleFontColor: "#cccccc",
    botMessageColor: "#252526",
    botMessageFontColor: "#cccccc",
    userMessageColor: "#0e639c",
    userMessageFontColor: "#ffffff",
    suggestionButtonColor: "#2d2d30",
    suggestionButtonFontColor: "#cccccc",
    frameBorderColor: "#1e1e1e",
    inputBackgroundColor: "#3c3c3c",
    sendButtonColor: "#0e639c",
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
    inputBackgroundColor: "white",
    sendButtonColor: "#4d5054",
  }
];

const CustomizeBot: React.FC<CustomizeBotProps> = ({
  loading,
  selectedProjectConfig,
  saveSettings,
}) => {

  function removeExactPaddingDivs() {
    let divs = document.querySelectorAll<HTMLDivElement>('div[style]');
  
    divs.forEach((div) => {
      const style = div.getAttribute('style')?.trim();
  
      if (style === 'padding: 16px 16px 0px;' || style === 'padding: 16px 16px 0px') {
        div.removeAttribute('style');
      }
    });

    divs = document.querySelectorAll<HTMLDivElement>('div[style]');

    divs.forEach((div) => {
      const style = div.getAttribute('style')?.trim();

      if (style === 'margin-right: -4px;margin-top: 12px;cursor: pointer;position: relative;' ||
          style === 'margin-right: -4px; margin-top: 12px; cursor: pointer; position: relative;') {

        const newStyle = style
          .split(';')
          .map(s => s.trim())
          .filter(s => !s.startsWith('margin-top'))
          .join(';')
          .replace(/;+$/, ''); // remove trailing semicolons

        div.setAttribute('style', newStyle);
      }
    });

    divs = document.querySelectorAll<HTMLDivElement>('div.flexbox-fix[style]');

    divs.forEach((div) => {
      const style = div.getAttribute('style')?.trim();

    if (style === '-webkit-box-flex: 1;flex: 1 1 0%;display: flex;margin-left: -6px;' ||
        style === '-webkit-box-flex: 1; flex: 1 1 0%; display: flex; margin-left: -6px;') {

      const newStyle = style
        .split(';')
        .map(s => s.trim())
        .filter(s => !s.startsWith('margin-left'))
        .join(';')
        .replace(/;+$/, '');

      div.setAttribute('style', newStyle);
    }
  });

  }

  const [config, setConfig] = useState<ChatBotSceleton>({
    ...ChatBotSceletonDefaultSettings,
    ...(selectedProjectConfig || {}),
    inputBackgroundColor: (selectedProjectConfig?.inputBackgroundColor || "#f5f5f5"),
    sendButtonColor: (selectedProjectConfig?.sendButtonColor || "#1a73e8"),
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const applyColorScheme = (scheme: any) => {
    setConfig(scheme);
  };

  const renderCustomizationPanel = () => {
    if (activeTab === "colorSchemes") {
      return (
        <div className="customization-panel">
          <div className="color-schemes-list">
            {colorSchemes.map((scheme, index) => (
              <div key={index} className="color-scheme-item" onClick={() => applyColorScheme(scheme)}>
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
      );
    }
    const panels: Record<string, JSX.Element> = {
      navbar: (
        <div className="customization-panel">
          {/*<h3>Navbar Customization</h3>*/}
          <div className="form-group">
            <label>Title Text</label>
            <input 
              type="text" 
              value={config.titleText}
              onChange={(e) => setConfig({...config, titleText: e.target.value})}
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
          <div className="form-group">
            <label>Navbar Color</label>
            <ChromePicker
              color={config.navbarColor}
              onChange={(e) => setConfig({ ...config, navbarColor: e.hex })}
              disableAlpha // removes alpha slider for simplicity
              styles={{
                default: {
                  picker: {
                    boxShadow: 'none',
                    width: '200px',
                    borderRadius: '8px',
                  },
                  // Hide the RGB input rows and toggle buttons
                  body: {
                    paddingBottom: '0px',
                  },
                }
              }}
            />
          </div>
        </div>
      ),
      botMessage: (
        <div className="customization-panel">
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
          <div className="form-group">
            <label>Background Color</label>
            <ChromePicker
              color={config.botMessageColor}
              onChange={(e) => setConfig({ ...config, botMessageColor: e.hex })}
              disableAlpha // removes alpha slider for simplicity
              styles={{
                default: {
                  picker: {
                    boxShadow: 'none',
                    width: '200px',
                    borderRadius: '8px',
                  },
                  // Hide the RGB input rows and toggle buttons
                  body: {
                    paddingBottom: '0px',
                  },
                }
              }}
            />
          </div>
        </div>
      ),
      userMessage: (
        <div className="customization-panel">
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
          <div className="form-group">
            <label>Background Color</label>
            <ChromePicker
              color={config.userMessageColor}
              onChange={(e) => setConfig({ ...config, userMessageColor: e.hex })}
              disableAlpha // removes alpha slider for simplicity
              styles={{
                default: {
                  picker: {
                    boxShadow: 'none',
                    width: '200px',
                    borderRadius: '8px',
                  },
                  // Hide the RGB input rows and toggle buttons
                  body: {
                    paddingBottom: '0px',
                  },
                }
              }}
            />
          </div>
        </div>
      ),
      suggestionButtons: (
        <div className="customization-panel">
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
          <div className="form-group">
            <label>Background Color</label>
            <ChromePicker
              color={config.suggestionButtonColor}
              onChange={(e) => setConfig({ ...config, suggestionButtonColor: e.hex })}
              disableAlpha // removes alpha slider for simplicity
              styles={{
                default: {
                  picker: {
                    boxShadow: 'none',
                    width: '200px',
                    borderRadius: '8px',
                  },
                  // Hide the RGB input rows and toggle buttons
                  body: {
                    paddingBottom: '0px',
                  },
                }
              }}
            />
          </div>
        </div>
      ),
      frame: (
        <div className="customization-panel">
          <div className="form-group">
            <label>Background Color</label>
            <ChromePicker
              color={config.frameBorderColor}
              onChange={(e) => setConfig({ ...config, frameBorderColor: e.hex })}
              disableAlpha // removes alpha slider for simplicity
              styles={{
                default: {
                  picker: {
                    boxShadow: 'none',
                    width: '200px',
                    borderRadius: '8px',
                  },
                  // Hide the RGB input rows and toggle buttons
                  body: {
                    paddingBottom: '0px',
                  },
                }
              }}
            />
          </div>
        </div>
      ),
      inputField: (
        <div className="customization-panel">
          <div className="form-group">
            <label>Input Background Color</label>
            <ChromePicker
              color={config.inputBackgroundColor}
              onChange={(e) => setConfig({ ...config, inputBackgroundColor: e.hex })}
              disableAlpha
              styles={{
                default: {
                  picker: {
                    boxShadow: 'none',
                    width: '200px',
                    borderRadius: '8px',
                  },
                  body: {
                    paddingBottom: '0px',
                  },
                }
              }}
            />
          </div>
          <div className="form-group">
            <label>Send Button Color</label>
            <ChromePicker
              color={config.sendButtonColor}
              onChange={(e) => setConfig({ ...config, sendButtonColor: e.hex })}
              disableAlpha
              styles={{
                default: {
                  picker: {
                    boxShadow: 'none',
                    width: '200px',
                    borderRadius: '8px',
                  },
                  body: {
                    paddingBottom: '0px',
                  },
                }
              }}
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

    if (!activeComponent) return panels["colorSchemes"];
    return panels[activeComponent] || null;
  };

  const [activeTab, setActiveTab] = useState<string>("colorSchemes");


  useEffect(() => {
    removeExactPaddingDivs();
  }, []);

  useEffect(() => {
    removeExactPaddingDivs();
  }, [activeComponent, activeTab]);

  useEffect(() => {
    if (activeComponent) {
      setActiveTab("customization");
    }
  }, [activeComponent]);

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
                  {
                  !activeComponent ? 
                    <div className="section-hint">
                      <Zap size={14} />
                      <span>Click to edit</span>
                    </div>
                     : <></>
                  }
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

                {/* Input Area - Now Clickable */}
                <div 
                    className="input-area clickable"
                    style={{ backgroundColor: config.inputBackgroundColor }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveComponent("inputField");
                    }}
                  >
                    {activeComponent === "inputField" && (
                      <div className="section-hint">
                        <Zap size={14} />
                        <span>Editing input field</span>
                      </div>
                    )}
                    <div className="message-input">
                      <span style={{ opacity: 0.6 }}></span>
                    </div>
                    <button 
                      className="send-button"
                      style={{ backgroundColor: config.sendButtonColor }}
                    >
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
            }}>
               <div 
                  className="customization-navbar"
                  style={{ 
                    backgroundColor: config.navbarColor,
                    color: config.titleFontColor
                  }}
                >
                  <div className="tabs-container">
                    <button 
                      className={`tab-button ${activeTab === "colorSchemes" ? "active-tab" : ""}`}
                      onClick={() => {setActiveTab("colorSchemes"); setActiveComponent(null);}}
                    >
                      Color Schemes
                    </button>
                    {activeComponent && (
                      <button 
                        className={`tab-button ${activeTab === "customization" ? "active-tab" : ""}`}
                        onClick={() => setActiveTab("customization")}
                      >
                        {
                          activeComponent === "suggestionButtons" ? 
                          "Customize Buttons" :
                          activeComponent === "inputField" ?
                          "Customize Input" :
                          `Customize ${activeComponent.charAt(0).toUpperCase() + activeComponent.slice(1)}`
                        }
                      </button>
                    )}
                  </div>
                </div>
            {
            renderCustomizationPanel()
            }
            </div>
          </div>
        </div>
      )}          
    </div>
    <div className="customizer-header">
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