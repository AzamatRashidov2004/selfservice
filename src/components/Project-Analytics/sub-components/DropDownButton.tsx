import { useState } from "react";

export const DropDownButton = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Day"); // Default: "Day"

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected: ${option}`); // Add logic for handling the selection
  };

  return (
    <div className="dropdown" style={{ position: "relative" }}>
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
            Hour
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => handleSelect("Day")}>
            Day
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => handleSelect("Week")}
          >
            Week
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => handleSelect("Last Month")}
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
};
