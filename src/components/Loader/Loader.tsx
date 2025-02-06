import "./Loader.css";

interface LoaderProps {
  loader?: string;
  loaderText?: string;
}

const Loader: React.FC<LoaderProps> = ({ loader = "black", loaderText = "Loading" }) => {
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
      <span className={`loader-text ${loader === "white" ? "loader-text-white" : ""}`}>{loaderText}</span>
    </div>
  );
};

export default Loader;
