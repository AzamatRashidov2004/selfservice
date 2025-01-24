import { useState } from "react";

type DropDownButtonProps = {
  setSelectedTimeInterval: React.Dispatch<React.SetStateAction<string>>;
};

export default function DropDownButton({
  setSelectedTimeInterval,
}: DropDownButtonProps) {
  const [selectedOption, setSelectedOption] = useState<string>("Last Day"); // Default: "Day"

  const handleSelect = (option: string) => {
    if (option == "Day") {
      setSelectedOption("Last Day");
    }
    if (option == "Hour") {
      setSelectedOption("Last Hour");
    }
    if (option == "Week") {
      setSelectedOption("Last Week");
    }
    if (option == "Month") {
      setSelectedOption("Last Month");
    }
    if (option == "All") {
      setSelectedOption("All");
    }
    setSelectedTimeInterval(option.toLowerCase());
  };

  return (
    <div className="dropdown" style={{ position: "relative", width: "200p" }}>
      {/* Dropdown button */}
      <style>
        {`
          /* Change active state color */
          button:active,
          button:focus {
            outline: none; /* Remove the default blue outline */
            background-color: #6c757d !important; /* Grey background color */
            border-color: #6c757d !important; /* Grey border */
            box-shadow: none !important; /* Remove focus box-shadow */
          }
        `}
      </style>
      <button
        className="btn btn-secondary dropdown-toggle" // Changed to 'btn-secondary' for grey color
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ minWidth: "100px" }} // Adjusted width
      >
        {selectedOption}
      </button>

      {/* Dropdown menu */}
      <ul
        className="dropdown-menu"
        aria-labelledby="dropdownMenuButton"
        style={{ minWidth: "150px", position: "absolute", zIndex: 10500 }} // Adjusted menu width to match the button
      >
        <li>
          <button
            className="dropdown-item"
            onClick={() => handleSelect("Hour")}
          >
            Last Hour
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => handleSelect("Day")}>
            Last Day
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => handleSelect("Week")}
          >
            Last Week
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => handleSelect("Month")}
          >
            Last Month
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => handleSelect("All")}>
            All
          </button>
        </li>
      </ul>
    </div>
  );
}
