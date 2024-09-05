import "../../assets/bot/453.88f55f10.chunk.js";
import "../../assets/bot/main.b8456701.js";
import "../../assets/bot/main.fd3e8a04.css";
import { Settings, botConfig } from "../../utility/Bot_Util.js";
import { useEffect } from "react";
import "./Customize_Bot.css";

// interface CustomizeBotProps {

//   }
  
  const CustomizeBot: React.FC = () => {

    function initBot(id: string, settings: Settings): void {
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
        const botSettings: Settings = {...botConfig};
        initBot("bot-container", botSettings)
      }, [])
  
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
