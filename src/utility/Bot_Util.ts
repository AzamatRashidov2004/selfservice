import { ChatBotSceleton, SettingsType } from "./types.ts";

export const ChatBotSceletonDefaultSettings: ChatBotSceleton = {
  userMessageColor: "#81C89F",
  botMessageColor: "#808080",
  navbarColor: "#0E3F90",
  suggestionButtonColor: "#0E3F90",
  suggestionButtonFontColor: "black",
  titleFontColor: "white",
  titleText: "Chatbot",
  userMessageFontColor: "black",
  botMessageFontColor: "white",
  frameBorderColor: "white",
  sendButtonColor: "#6e757c",
  inputBackgroundColor: "white",
  // New properties with default values
  botIconColor: "#808080",
  userIconColor: "#81C89F",
  editFieldBackgroundColor: "white",
  editFieldBorderColor: "#e0e0e0",
  footerBackgroundColor: "white"
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
};

export type ChatBotSkeleton = {
  userMessageColor: string;
  botMessageColor: string;
  navbarColor: string;
  suggestionButtonColor: string;
  suggestionButtonFontColor: string;
  titleText: string;
  titleFontColor: string;
  botMessageFontColor: string;
  userMessageFontColor: string;
  frameBorderColor: string;
  sendButtonColor: string;
  inputBackgroundColor: string;
  // New properties
  botIconColor: string;
  userIconColor: string;
  editFieldBackgroundColor: string;
  editFieldBorderColor: string;
  footerBackgroundColor: string;
};

export type CommandType =
  | {
      type: 'image';
      text: string;
      link: string;
      next_state: number;
    }
  | {
      type: 'display_text';
      text: string;
      next_state: number;
    }
  | {
      type: 'get_rag';
      text: string;
      next_state: number;
      streaming: boolean;
      top_n_buttons_enabled: boolean;
      top_n_count: number;
    }
  | {
      type: 'get_top_n';
      text: string;
      next_state: number;
      top_n_count: number;
    };

export type Command = {
  name: string;
  state: number;
};

export type State = {
  state_id: number;
  command: CommandType;
};

export type FullBotConfig = {
  dialogue_id: number;
  dialogue_name: string;
  dialogue_author: string;
  dialogue_description: string;
  language: string;
  editor_active: boolean;
  editor_initial_file: string;
  commands: Command[];
  states: State[];
  chatbot: ChatBotSkeleton;
};