import "../../assets/bot/453.88f55f10.chunk.js";
import "../../assets/bot/main.9fd2091d.css";
import "../../assets/bot/main.daa918cd.js";
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

    function sleep(ms: number): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    const time = 500; // Delay time in milliseconds
    const maxAttempts = 5; // Maximum number of attempts

    async function dispatchUntilMounted() {
      let attempts = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      while (!(window as any).isBotMounted && attempts < maxAttempts) {
        attempts++;
        document.dispatchEvent(initFsBotEvent);
        await sleep(time); // Wait for 500ms before the next check
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).isBotMounted) {
        console.log("Bot is successfully mounted!");
      } else {
        console.log(`Bot failed to mount after ${maxAttempts} attempts.`);
      }
    }

    sleep(time).then(() => {
      console.log(`Initialized bot after ${time} ms!`);
      dispatchUntilMounted(); // Start dispatching events until bot is mounted or max attempts are reached
    });
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).isBotMounted = false;
  }, []);

  useEffect(() => {
    let botSettings: SettingsType = defaultSettings;

    if (selectedProjectConfig) {
      botSettings = { ...botSettings, ...selectedProjectConfig };
    }

    botSettings = { ...botSettings, ...botStaticDisplayConfig };
    botSettings.save_callback = saveSettings;

    initBot("bot-container", botSettings);

    // Cleanup function to remove the listener if needed
    return () => {
      // Optionally, you could remove the listener here if you add one in this component
      // document.removeEventListener("initFsBot", yourEventListener);
    };
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
