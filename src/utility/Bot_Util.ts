import { ChatBotSceleton, SettingsType } from "./types.ts";

export const ChatBotSceletonDefaultSettings: ChatBotSceleton = {
  userMessageColor: "#81C89F",
  botMessageColor: "#808080",
  navbarColor: "#0E3F90",
  suggestionButtonColor: "#0E3F90",
};

// Default settings object
export const defaultSettings: SettingsType = {
  title: "Bot",
  sound: true,
  key: "646b4706a47a67009f647d79",
  fontSize: "standard",
  starting_pos: {
    x: 0,
    y: 0,
  },
  resizing: true,
  dragging: true,
  size: "standard",
  customComponents: {
    Bubble: "",
    Button: "",
    Bot: "",
    Suggestions: "",
    Video: "",
    TextInput: "",
    Loading_Bar: "",
    Image: "",
    Messages: "",
    Icon: "",
  },
  attributes: {},
  colors: {
    bot: {
      background: "#37258D",
      color: "white",
    },
    user: {
      background: "#7881CB",
      color: "white",
    },
    suggestions: {
      hover_color: "#ffffff80",
      color: "black",
      background: "#ffffffb3",
    },
    title_color: "white",
    background_color: "#5341DA",
    icon_color: "#5A5A5A",
  },
  search: false,
  file_selector: false,
  positioning: "absolute",
  pdfScale: 1,
  inputLineLimit: 5,
  save_customization: true,
  save_callback: (customSettings: SettingsType) => {
    console.log(customSettings);
  },
  toggle: true,
  suggestion_button_style: "grid",
  fullscreen_margin: 0
};

// The necessary config to statically display the bot
  export const botStaticDisplayConfig: object = {
    title: "Custom Bot",
    sound: true,
    key: "646b4706a47a67009f647d79",
    fontSize: "standard",
    starting_pos: {
        x: 930,
        y: 100,
    },
    resizing: true,
    dragging: true,
    size: "standard",
    toggle: false,
    customize_ID: "custom-container",
    save_customization: true,
    positioning: "static",
    save_callback: () => {}
  }

