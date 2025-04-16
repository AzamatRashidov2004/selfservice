declare module '*.jsx' {
    const component: React.FC; // Replace `any` with specific prop types if available
    export default component;
  }

  declare module '*.svg' {
    const content: string;
    export default content;
  }