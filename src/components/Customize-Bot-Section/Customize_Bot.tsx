import { useState, useEffect, useCallback } from "react";
import { Save, Zap, Mic } from 'lucide-react';
import { ChatBotSceleton } from "../../utility/types.js";
import { ChatBotSceletonDefaultSettings, FullBotConfig } from "../../utility/Bot_Util.js";
import Loader from "../Loader/Loader.js";
import "./Customize_Bot.css";
import { ChromePicker } from 'react-color';
import { useFiles } from "../../context/fileContext.js";
import { updateFile } from "../../api/kronos/postKronos.js";
import { createNotificationEvent, createPopupEvent } from "../../utility/Modal_Util.js";
import { useAuth } from "../../context/authContext.js";
import { useNavigate } from "react-router-dom";
import { useNavigation } from '../../context/navigationContext';
import { useNavigationPrompt } from "../../hooks/useNavigationPrompt.js";



// Extended interface to include new customizable elements
interface CustomizeBotProps {
  loading?: boolean;
  selectedProjectConfig?: Partial<ChatBotSceleton>;
  saveSettings?: (settings: ChatBotSceleton) => Promise<void>;
}

// Extended color schemes
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
    botIconColor: "#1a73e8",
    userIconColor: "#1a73e8",
    editFieldBackgroundColor: "#ffffff",
    editFieldBorderColor: "#e0e0e0",
    footerBackgroundColor: "#ffffff"
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
    botIconColor: "#2e7d32",
    userIconColor: "#2e7d32",
    editFieldBackgroundColor: "#ffffff",
    editFieldBorderColor: "#e0e0e0",
    footerBackgroundColor: "#ffffff"
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
    botIconColor: "#ed6c02",
    userIconColor: "#ed6c02",
    editFieldBackgroundColor: "#ffffff",
    editFieldBorderColor: "#e0e0e0",
    footerBackgroundColor: "#ffffff"
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
    botIconColor: "#7b1fa2",
    userIconColor: "#7b1fa2",
    editFieldBackgroundColor: "#ffffff",
    editFieldBorderColor: "#e0e0e0",
    footerBackgroundColor: "#ffffff"
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
    botIconColor: "#cccccc",
    userIconColor: "#0e639c",
    editFieldBackgroundColor: "#252526",
    editFieldBorderColor: "#252526",
    footerBackgroundColor: "#1e1e1e"
  },
  {
    titleText: "Dark Mode",
    navbarColor: "#1e1e1e",
    titleFontColor: "white",
    botMessageColor: "#2d2d30",
    botMessageFontColor: "white",
    userMessageColor: "#444654",
    userMessageFontColor: "white",
    suggestionButtonColor: "#3e3e42",
    suggestionButtonFontColor: "white",
    frameBorderColor: "#1e1e1e",
    inputBackgroundColor: "#383838",
    sendButtonColor: "#4d5054",
    botIconColor: "#9e9e9e",
    userIconColor: "#9e9e9e",
    editFieldBackgroundColor: "#444654",
    editFieldBorderColor: "#444654",
    footerBackgroundColor: "#1e1e1e"
  },
  {
    titleText: "OpenAI Dark",
    navbarColor: "#0f0f0f",
    titleFontColor: "#d9d9e3",
    botMessageColor: "#444654",
    botMessageFontColor: "#d9d9e3",
    userMessageColor: "#343541",
    userMessageFontColor: "#d9d9e3",
    suggestionButtonColor: "#2a2b32",
    suggestionButtonFontColor: "#d9d9e3",
    frameBorderColor: "#0f0f0f",
    inputBackgroundColor: "#40414f",
    sendButtonColor: "#8e8ea0",
    botIconColor: "#10a37f", // ChatGPT's green for bot
    userIconColor: "#8e8ea0", // Light grey for user
    editFieldBackgroundColor: "#40414f",
    editFieldBorderColor: "#2a2b32",
    footerBackgroundColor: "#0f0f0f"
  }
];

const CustomizeBot: React.FC<CustomizeBotProps> = ({
  loading,
  selectedProjectConfig,
  saveSettings,
}) => {
  // Track changes to detect unsaved edits
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialConfig, setInitialConfig] = useState<ChatBotSceleton | null>(null);
  const { registerBlocker, unregisterBlocker } = useNavigation();


  const getChatBotSkeleton = (config: FullBotConfig): ChatBotSceleton => {
    const { chatbot } = config;
    
    return {
      userMessageColor: ((chatbot && chatbot.userMessageColor) ? chatbot.userMessageColor : ChatBotSceletonDefaultSettings.userMessageColor),
      botMessageColor: ((chatbot && chatbot.botMessageColor) ? chatbot.botMessageColor : ChatBotSceletonDefaultSettings.botMessageColor),
      navbarColor: ((chatbot && chatbot.navbarColor) ? chatbot.navbarColor : ChatBotSceletonDefaultSettings.navbarColor),
      suggestionButtonColor: ((chatbot && chatbot.suggestionButtonColor) ? chatbot.suggestionButtonColor : ChatBotSceletonDefaultSettings.suggestionButtonColor),
      suggestionButtonFontColor: ((chatbot && chatbot.suggestionButtonFontColor) ? chatbot.suggestionButtonFontColor : ChatBotSceletonDefaultSettings.suggestionButtonFontColor),
      titleText: ((chatbot && chatbot.titleText) ? chatbot.titleText : ChatBotSceletonDefaultSettings.titleText),
      titleFontColor: ((chatbot && chatbot.titleFontColor) ? chatbot.titleFontColor : ChatBotSceletonDefaultSettings.titleFontColor),
      botMessageFontColor: ((chatbot && chatbot.botMessageFontColor) ? chatbot.botMessageFontColor : ChatBotSceletonDefaultSettings.botMessageFontColor),
      userMessageFontColor: ((chatbot && chatbot.userMessageFontColor) ? chatbot.userMessageFontColor : ChatBotSceletonDefaultSettings.userMessageFontColor),
      frameBorderColor: ((chatbot && chatbot.frameBorderColor) ?  chatbot.frameBorderColor : ChatBotSceletonDefaultSettings.frameBorderColor),
      sendButtonColor: ((chatbot && chatbot.sendButtonColor) ? chatbot.sendButtonColor : ChatBotSceletonDefaultSettings.sendButtonColor),
      inputBackgroundColor: ((chatbot && chatbot.inputBackgroundColor) ? chatbot.inputBackgroundColor : ChatBotSceletonDefaultSettings.inputBackgroundColor),
      // New extended properties with fallbacks
      botIconColor: ((chatbot && chatbot.botIconColor) ? chatbot.botIconColor : ChatBotSceletonDefaultSettings.botIconColor),
      userIconColor: ((chatbot && chatbot.userIconColor) ? chatbot.userIconColor : ChatBotSceletonDefaultSettings.userIconColor),
      editFieldBackgroundColor: ((chatbot && chatbot.editFieldBackgroundColor) ? chatbot.editFieldBackgroundColor : ChatBotSceletonDefaultSettings.editFieldBackgroundColor),
      editFieldBorderColor: ((chatbot && chatbot.editFieldBorderColor) ? chatbot.editFieldBorderColor : ChatBotSceletonDefaultSettings.editFieldBorderColor),
      footerBackgroundColor: ((chatbot && chatbot.footerBackgroundColor) ? chatbot.footerBackgroundColor : ChatBotSceletonDefaultSettings.footerBackgroundColor)
    };
  };

  const { currentBotConfig, setCurrentBotConfig, current_project_id } = useFiles();
  const fullBotConfig = currentBotConfig;

  const isFromApp = currentBotConfig !== null;
  let chatbot = null;
  if (isFromApp)
    chatbot = getChatBotSkeleton(currentBotConfig as FullBotConfig);

  

  useEffect(() => {
    const el = document.getElementsByClassName("bot-customizer-container")[0] as HTMLElement;
    if (isFromApp && el) {
      el.style.setProperty("margin-top", "80px", "important");
    }
    return () => {
      if (el) el.style.removeProperty("margin-top");
    };
  }, []);

  useEffect(() => {
    return () => {
      setCurrentBotConfig(null);
    }
  }, []);

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

  const defaultConfig = {
    ...ChatBotSceletonDefaultSettings,
    ...(chatbot !== null ? chatbot : {}),
    ...(selectedProjectConfig || {}),
  };

  const [config, setConfig] = useState<ChatBotSceleton>(defaultConfig);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  useEffect(() => {
    if (!initialConfig) {
      setInitialConfig(config);
    }
  }, []);

  // Track changes to detect unsaved work
  useEffect(() => {
    if (initialConfig) {
      const hasChanges = Object.keys(config).some(key => {
        return config[key as keyof ChatBotSceleton] !== 
               initialConfig[key as keyof ChatBotSceleton];
      });
      setHasUnsavedChanges(hasChanges);
    }
  }, [config, initialConfig]);

  useEffect(() => {
    if (selectedProjectConfig) {
      setConfig(prev => ({ ...prev, ...selectedProjectConfig }));
    }
  }, [selectedProjectConfig]);

  const { keycloak } = useAuth();
  const navigate = useNavigate();

  // Handle navigation with unsaved changes
  const handleBeforeNavigate = useCallback(() => {
    if (hasUnsavedChanges) {
      createPopupEvent(
        "Unsaved Changes",
        "You have unsaved customization changes. Do you want to save them before leaving?",
        {
          success: { text: "Save Changes", type: "primary" },
          cancel: { text: "Discard Changes", type: "danger" }
        },
        (success: boolean) => {
          if (success) {
            // Save changes before navigating
            handleSubmit().then(() => {
              navigate("/dashboard");
            });
          } else {
            // Discard changes and navigate
            navigate("/dashboard");
          }
        }
      );
      return false; // Prevent immediate navigation
    }
    return true; // Allow navigation
  }, [hasUnsavedChanges, navigate]);

  const handleSubmit = async () => {
    if (!isFromApp && saveSettings) {
      try {
        await saveSettings(config);
        setHasUnsavedChanges(false);
        setInitialConfig(config);
        return true;
      } catch (error) {
        console.error("Error saving settings:", error);
        return false;
      }
    } else if (isFromApp) {
      try {
        const currentCustom = fullBotConfig as FullBotConfig;
        currentCustom.chatbot = {
          ...config
        };
        
        const response = await updateFile(current_project_id, JSON.stringify(currentCustom), 'config.fsm', 'fsm', keycloak.token ? keycloak.token:"");
        if (!response) {
          createNotificationEvent(
            "Something Went Wrong",
            "While editing your bot, something went wrong. Please try again later...",
            "danger",
            4000
          );
          return false;
        }
    
        createNotificationEvent(
          "Bot Updated",
          "Bot successfully updated with your configurations",
          "success"
        );
        setHasUnsavedChanges(false);
        setInitialConfig(config);
        return true;
      } catch (error) {
        console.error("Error saving settings:", error);
        return false;
      }
    }
    return false;
  };

  const promptBeforeNavigate = useNavigationPrompt(hasUnsavedChanges, handleSubmit);
   // Example navigation handler for a button
   const handleNavigate = (destination: any) => {
    if (promptBeforeNavigate(destination)) {
      navigate(destination);
    }
  };
  const handleCancelClick = () => {
    handleNavigate("/dashboard");
  };


  // Handle back button and browser navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        const message = "You have unsaved changes. Are you sure you want to leave?";
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

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
            <label>Bot Icon Color</label>
            <ChromePicker
              color={config.botIconColor}
              onChange={(e) => setConfig({ ...config, botIconColor: e.hex })}
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
            <label>User Icon Color</label>
            <ChromePicker
              color={config.userIconColor}
              onChange={(e) => setConfig({ ...config, userIconColor: e.hex })}
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
      frame: (
        <div className="customization-panel">
          <div className="form-group">
            <label>Background Color</label>
            <ChromePicker
              color={config.frameBorderColor}
              onChange={(e) => setConfig({ ...config, frameBorderColor: e.hex })}
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
      inputField: (
        <div className="customization-panel">
          <div className="form-group">
            <label>Input Field Background Color</label>
            <ChromePicker
              color={config.editFieldBackgroundColor}
              onChange={(e) => setConfig({ ...config, editFieldBackgroundColor: e.hex })}
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
            <label>Input Field Border Color</label>
            <ChromePicker
              color={config.editFieldBorderColor}
              onChange={(e) => setConfig({ ...config, editFieldBorderColor: e.hex })}
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
            <label>Footer Background Color</label>
            <ChromePicker
              color={config.footerBackgroundColor}
              onChange={(e) => setConfig({ ...config, footerBackgroundColor: e.hex })}
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

    // Ensure handleSave is defined with useCallback to prevent unnecessary re-renders
    const handleSave = useCallback(async () => {
      if (!isFromApp && saveSettings) {
        try {
          await saveSettings(config);
          setHasUnsavedChanges(false);
          setInitialConfig(config);
          return true;
        } catch (error) {
          console.error("Error saving settings:", error);
          return false;
        }
      } else if (isFromApp) {
        try {
          const currentCustom = fullBotConfig as FullBotConfig;
          currentCustom.chatbot = {
            ...config
          };
          
          const response = await updateFile(
            current_project_id, 
            JSON.stringify(currentCustom), 
            'config.fsm', 
            'fsm', 
            keycloak.token ? keycloak.token : ""
          );
          
          if (!response) {
            createNotificationEvent(
              "Something Went Wrong",
              "While editing your bot, something went wrong. Please try again later...",
              "danger",
              4000
            );
            return false;
          }
      
          createNotificationEvent(
            "Bot Updated",
            "Bot successfully updated with your configurations",
            "success"
          );
          setHasUnsavedChanges(false);
          setInitialConfig(config);
          return true;
        } catch (error) {
          console.error("Error saving settings:", error);
          return false;
        }
      }
      return false;
    }, [isFromApp, saveSettings, config, fullBotConfig, current_project_id, keycloak.token]);

  useEffect(() => {
    registerBlocker({
      hasUnsavedChanges,
      handleSave 
    });

    // Unregister when component unmounts
    return () => {
      unregisterBlocker();
    };
  }, [hasUnsavedChanges, handleSave, registerBlocker, unregisterBlocker]);

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
                  backgroundColor: `${config.frameBorderColor}`,
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
                      <div className="bot-icon" style={{color: config.botIconColor}}>
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
                    <div className="user-icon" style={{color: config.userIconColor}}>
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
                      <div className="bot-icon" style={{color: config.botIconColor}}>
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

                {/* Input Area - Improved with proper styling and positioning */}
                <div 
                  className="input-area clickable"
                  style={{ 
                    backgroundColor: config.footerBackgroundColor,
                    border: "none", // Remove default border
                    borderTop: "none" // Remove separator line
                  }}
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
                  <div className="message-input-container">
                    <div className="message-input" style={{ 
                      backgroundColor: config.editFieldBackgroundColor,
                      border: `1px solid ${config.editFieldBorderColor}`,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 12px",
                      position: "relative" 
                    }}>
                      <span style={{ opacity: 0.6, flexGrow: 1 }}>Ask me anything...</span>
                      
                      {/* Optional microphone icon */}
                      <div style={{ marginRight: "8px", color: config.sendButtonColor }}>
                        <Mic size={18} />
                      </div>
                      
                      {/* Send button - properly positioned */}
                      <div 
                        className="send-button-wrapper"
                        style={{ 
                          backgroundColor: config.sendButtonColor,
                          width: "32px",
                          height: "32px",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
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
      <div className="save-status">
        {hasUnsavedChanges && <span className="unsaved-indicator">Unsaved changes</span>}
      </div>
      <button 
        className="save-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        <Save size={18} />
        Save Settings
      </button>
      <button
        className="cancel-button"
        onClick={handleCancelClick}
        disabled={loading}
      >
        Cancel
      </button>
    </div>
    </>
  );
};

export default CustomizeBot;