import { Box, SxProps, ToggleButton, ToggleButtonGroup } from "@mui/material";

type T = {
  selectedTimeInterval: string;
  setSelectedTimeInterval: React.Dispatch<React.SetStateAction<string>>;
};

export const TimeControlButtons = ({
  selectedTimeInterval,
  setSelectedTimeInterval,
}: T) => {
  const handleIntervalChange = (
    _event: React.MouseEvent<HTMLElement>,
    newInterval: string | null
  ) => {
    if (newInterval !== null && setSelectedTimeInterval) {
      setSelectedTimeInterval(newInterval);
    }
  };

  const toggleGroupStyles: SxProps = {
    // Outer container’s background & border radius for a pill shape.
    borderRadius: "24px",
    p: "2px",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    // Remove the default borders between grouped toggles.
    "& .MuiToggleButtonGroup-grouped": {
      border: 0,
      borderRadius: "24px",
      textTransform: "none",
      marginLeft: "-120px",
      color: "black", // Brighter unselected text color
      fontWeight: "bold",
      "&.Mui-selected": {
        // Selected state styles
        color: "#fff",
        backgroundColor: "#1a73e8",
        "&:hover": {
          backgroundColor: "#1669c1",
        },
      },
      "&:hover": {
        // Hover for unselected
        backgroundColor: "#e0e0e0",
      },
      // Remove extra border between buttons
      "&:not(:first-of-type)": {
        borderLeft: 0,
        marginLeft: "4px",
      },
    },
  };

  return (
    <Box
      sx={{
        zIndex: "10001",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "-50px",
      }}
    >
      <ToggleButtonGroup
        value={selectedTimeInterval}
        exclusive
        onChange={handleIntervalChange}
        sx={toggleGroupStyles}
      >
        <ToggleButton
          value="hour"
          sx={{ textTransform: "none", borderRadius: 0, px: 3 }}
        >
          1H
        </ToggleButton>
        <ToggleButton
          value="day"
          sx={{ textTransform: "none", borderRadius: 0, px: 3 }}
        >
          1D
        </ToggleButton>
        <ToggleButton
          value="week"
          sx={{ textTransform: "none", borderRadius: 0, px: 3 }}
        >
          1W
        </ToggleButton>
        <ToggleButton
          value="month"
          sx={{ textTransform: "none", borderRadius: 0, px: 3 }}
        >
          1M
        </ToggleButton>
        <ToggleButton
          value="all"
          sx={{ textTransform: "none", borderRadius: 0, px: 3 }}
        >
          1Y
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
