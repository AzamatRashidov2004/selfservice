import "../../assets/bot/453.88f55f10.chunk.js";
import "../../assets/bot/main.3beca214.css";
import "../../assets/bot/main.6fd757ab.js";
import {
  botStaticDisplayConfig,
  defaultSettings,
} from "../../utility/Bot_Util.js";
import { SettingsType } from "../../utility/types.js";
import { useEffect } from "react";
import "./Customize_Bot.css";
import Loader from "../Loader/Loader.js";

interface CustomizeBotProps {
  saveSettings: (customSettings: SettingsType) => void;
  selectedProjectConfig?: object;
  loading?: boolean;
}

const CustomizeBot: React.FC<CustomizeBotProps> = ({
  saveSettings,
  selectedProjectConfig,
  loading,
}) => {
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
    const maxAttempts = 5; // Maximum number of attempts
  
    // Function to keep dispatching event until bot is mounted or max attempts reached
    async function dispatchUntilMounted() {
      let attempts = 0;
      
      while (!(window as any).isBotMounted && attempts < maxAttempts) {
        attempts++;
        console.log(`Attempt ${attempts}: Bot is not mounted, dispatching initFsBot event...`);
        document.dispatchEvent(initFsBotEvent);
        await sleep(time); // Wait for 500ms before the next check
      }
      console.log("is bot mounted", (window as any).isBotMounted)
      if ((window as any).isBotMounted) {
        console.log("Bot is successfully mounted!");
      } else {
        console.log(`Bot failed to mount after ${maxAttempts} attempts.`);
      }
    }
  
    // Start the process
    sleep(time).then(() => {
      console.log(`Initialized bot after ${time} ms!`);
      dispatchUntilMounted(); // Start dispatching events until bot is mounted or max attempts are reached
    });
  }

  useEffect(() => {
    let botSettings: SettingsType = defaultSettings;

    // On dashboard page, if a project is selected this config is passed down
    if (selectedProjectConfig) {
      botSettings = { ...botSettings, ...selectedProjectConfig };
    }

    botSettings = { ...botSettings, ...botStaticDisplayConfig };
    botSettings.save_callback = saveSettings;

    initBot("bot-container", botSettings);
  }, [saveSettings, selectedProjectConfig]);

  return (
    <section className="bot-customization-section">
      {loading && loading == true ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div className="bot-customization-section-wrapper">
          <div id="custom-container"></div>
          <div id="bot-container"></div>
        </div>
      )}
    </section>
  );
};

export default CustomizeBot;
