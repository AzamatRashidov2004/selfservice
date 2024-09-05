
  
  // Define ComponentColor type
  type ComponentColor = {
    background: string; // Component background color
    color: string; // Component text color
    hover_color?: string; // Component hover color (optional)
  };
  
  // Define Colors type
  type Colors = {
    bot: ComponentColor; // Bot component colors
    user: ComponentColor; // User component colors
    background_color: string; // Background color
    title_color: string; // Title color
    icon_color: string; // Icon color
    suggestions: ComponentColor; // Suggestions component colors
  };
  
  // Define FontSize type
  type FontSize = "small" | "standard" | "big" | "biggest"; // Font size options
  
  // Define FontSize type
  export type SuggestionStyle = "flex" | "grid"; // Suggestion button style options
  
  // Define SizeOptions type
  type SizeOptions = "small" | "standard" | "big" | "biggest" | "fullscreen"; // Size options
  
  // Define themes type
  type themes = "default" | "dark" | "light"; // Theme options
  
  type positions = "absolute" | "static";
  
  // Define CustomComponents type
  type CustomComponents = {
    // Custom components for the bot
    Bubble?: string;
    Messages?: string;
    Loading_Bar?: string;
    Suggestions?: string;
    TextInput?: string;
    Video?: string;
    Image?: string;
    Button?: string;
    Icon?: string;
    Bot?: string;
  };
  
  // Define Settings interface
  export type Settings = {
    title: string; // Title of the bot
    sound: boolean; // Indicates whether sound is enabled
    key: string; // Bot key
    attributes: { [key: string]: string };
    colors: Colors; // Color settings
    fontSize: FontSize; // Font size settings
    starting_pos: { x: number; y: number }; // Starting position of the bot
    resizing: boolean; // Indicates whether resizing is allowed
    dragging: boolean; // Indicates whether dragging is allowed
    customIcons?: string[]; // Custom icon URLs
    customComponents: CustomComponents; // Custom components for the bot
    theme?: themes; // Theme setting
    size: SizeOptions; // Size setting
    search: boolean; // Indicates whether search is enabled
    toggle: boolean; // Toggle the bot or Always leave open
    positioning: positions; // The position of the bot, static or absolute
  
    // PDF Options
    pdfId?: string; // PDF ID
    pdfScale: number; // PDF scale
    file_selector: boolean; // Indicates whether file selector is enabled
  
    // Input Field
    inputLineLimit: number; // Limit for input lines
  
    // Suggestion Button Styles
    suggestion_button_style: SuggestionStyle;
  
    // Fullscreen margins
    fullscreen_margin?: number;
  
    // Dev Options
    customize_ID?: string; // Customization element id
    save_customization: boolean; // Customization save button
    save_callback: (customSettings: Settings) => void; // Callback function to handle the custom settings
  };

    // Default settings object
export const defaultSettings: Settings = {
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
  save_callback: (customSettings) => {
    console.log(customSettings);
  },
  toggle: true,
  suggestion_button_style: "grid",
  fullscreen_margin: 0
};

  export const botConfig: Settings = {
    ...defaultSettings,
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

