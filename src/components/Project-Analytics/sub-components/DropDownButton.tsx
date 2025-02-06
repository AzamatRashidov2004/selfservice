import { useState, useEffect } from "react";

type DropDownButtonProps = {
  setSelectedTimeInterval: React.Dispatch<React.SetStateAction<string>>;
};

export default function DropDownButton({
  setSelectedTimeInterval,
}: DropDownButtonProps) {
  const [selectedOption, setSelectedOption] = useState<string>("Last Day"); // Default: "Last Day"

  useEffect(() => {
    // Load cached selection from sessionStorage
    const cachedOption = sessionStorage.getItem("selectedTimeInterval");
    if (cachedOption) {
      setSelectedOption(cachedOption); // Update local state
      setSelectedTimeInterval(cachedOption.toLowerCase()); // Sync parent state
    }
  }, [setSelectedTimeInterval]);

  const handleSelect = (option: string) => {
    let displayText = "";
    switch (option) {
      case "Hour":
        displayText = "Last Hour";
        break;
      case "Day":
        displayText = "Last Day";
        break;
      case "Week":
        displayText = "Last Week";
        break;
      case "Month":
        displayText = "Last Month";
        break;
      case "All":
        displayText = "All";
        break;
      default:
        displayText = "Last Day";
    }

    // Update local state and parent state
    setSelectedOption(displayText);
    setSelectedTimeInterval(option.toLowerCase());

    // Cache the selection in sessionStorage
    sessionStorage.setItem("selectedTimeInterval", displayText);
  };

  return (
    <div className="dropdown" style={{ position: "relative", width: "200px" }}>
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
