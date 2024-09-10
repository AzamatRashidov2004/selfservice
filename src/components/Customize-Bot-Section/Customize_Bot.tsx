import "../../assets/bot/453.88f55f10.chunk.js";
import "../../assets/bot/main.b8456701.js";
import "../../assets/bot/main.af361184.css";
import { botStaticDisplayConfig, defaultSettings } from "../../utility/Bot_Util.js";
import { SettingsType } from "../../utility/types.js";
import { useEffect } from "react";
import "./Customize_Bot.css";

interface CustomizeBotProps {
  saveSettings: (customSettings: SettingsType) => void;
  selectedProjectConfig?: object;
  }
  
  const CustomizeBot: React.FC<CustomizeBotProps> = ({ saveSettings, selectedProjectConfig }) => {

    function initBot(id: string, settings: SettingsType): void {
        const initFsBotEvent = new CustomEvent("initFsBot", {
          detail: {
            id,
            settings,
          },
        });
      
        // Function to create a delay
        function sleep(ms: number): Promise<void> {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      
        const time = 500; // Delay time in milliseconds
        sleep(time).then(() => {
          console.log(`Initialized bot after ${time} ms!`);
          document.dispatchEvent(initFsBotEvent);
        });
      }

      useEffect(() => {
        let botSettings: SettingsType = defaultSettings;

        // On dashboard page, if a project is selected this config is passed down
        if(selectedProjectConfig){
          botSettings = {...botSettings, ...selectedProjectConfig}
        }

        botSettings = {...botSettings, ...botStaticDisplayConfig}
        botSettings.save_callback = saveSettings;

        initBot("bot-container", botSettings)
      }, [saveSettings, selectedProjectConfig])
  
    return (
        <section className="bot-customization-section">
            <div className="bot-customization-section-wrapper">
                <div id="custom-container"></div>
                <div id="bot-container"></div>
            </div>
        </section>
    );
  };
  
  export default CustomizeBot;
