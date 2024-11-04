declare module '*.jsx' {
    const component: React.FC; // Replace `any` with specific prop types if available
    export default component;
  }