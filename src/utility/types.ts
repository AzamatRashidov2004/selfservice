export interface ProjectType {
  name: string;
  lastUpdate: string;
  filename: string;
  docId: string;
  projectId?: string;
}

export type KronosProjectType = {
  _id: string;
  name: string;
  description: string;
  created_at: Date;
  modal_version: number;
  chatbot_config: SettingsType;
};

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
export type CustomComponents = {
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

export type FileItem = {
  id: string;
  name: string;
  isDir?: boolean;
  modDate?: string;
  childrenIds?: string[];
  childrenCount?: number;
  parentId?: string;
  size?: number;
  thumbnailUrl?: string;
};

type FileMap = Record<string, FileItem>;

export type FilesData = {
  rootFolderId: string;
  fileMap: FileMap;
};

export type ChatBotSceleton = {
  userMessageColor: string;
  botMessageColor: string;
  navbarColor: string;
  suggestionButtonColor: string;
  suggestionButtonFontColor: string;
  titleText: string;
  titleFontColor: string;
  botMessageFontColor: string;
  userMessageFontColor: string;
};

// Define Settings interface
export type SettingsType = {
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
  save_callback: (customSettings: SettingsType) => void; // Callback function to handle the custom settings
};

export interface ButtonConfig {
  text: string;
  type: "info" | "danger" | "success" | "primary" | "secondary";
}

export interface PopupState {
  isVisible: boolean;
  title: string;
  text: string;
  buttons: {
    success: ButtonConfig;
    cancel: ButtonConfig;
  };
  callback?: (success: boolean) => void; // Optional callback function
  notification_time?: number; // Optional time for popup display
}

export type kronosKnowledgeBaseType = {
  _id: string;
  project_id: string;
  name: string;
  description: string;
  embedding_model: string;
  language: string;
  total_pages: number;
  source_file: string;
  source_type: string;
  created_at: string;
  model_version: number;
};

export const defaultPopupState: PopupState = {
  isVisible: false,
  title: "",
  text: "",
  buttons: {
    success: { text: "Yes", type: "primary" },
    cancel: { text: "No", type: "secondary" },
  },
  notification_time: 5000, // Default time for popup display
};

export interface NotificationState {
  title: string;
  text: string;
  type: "info" | "danger" | "success" | "primary" | "secondary";
  notification_time?: number; // Optional time for notification display
  isVisible: boolean;
}

export const defaultNotificationState: NotificationState = {
  isVisible: false,
  title: "",
  text: "",
  type: "success",
  notification_time: 2000, // Default time for notification display
};

export type projectFetchReturn = {
  project: KronosProjectType;
  projectData: kronosKnowledgeBaseType[];
};

export type fetchProjectsDataReturn = {
  analytical: ProjectType[];
  project: projectFetchReturn[];
};

// for DataGrid
export type Session = {
  session_id: string;
  start_timestamp: string;
  query_count: number;
  feedback_count: number;
  positive_feedback: number;
  negative_feedback: number;
  feedback_percentage: number;
};
