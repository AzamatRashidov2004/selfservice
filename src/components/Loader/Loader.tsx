import "./Loader.css";

interface LoaderProps {
  loader?: string;
}

const Loader: React.FC<LoaderProps> = ({ loader = "black" }) => {
  return (
    <div className={loader === "black" ? "lds-roller" : "lds-roller-white"}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;
