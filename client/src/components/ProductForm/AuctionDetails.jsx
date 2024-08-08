import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const AuctionDetails = ({ values, handleChange, nextStep, prevStep }) => {
  const continueStep = (e) => {
    e.preventDefault();
    console.log("Continuing to next step with values:", values);
    nextStep();
  };

  const backStep = (e) => {
    e.preventDefault();
    console.log("Going back to previous step");
    prevStep();
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="step">
        <h3>Enter Auction Details</h3>
        <TextField
          placeholder="Enter Starting Price"
          label="Starting Price"
          onChange={handleChange("startingPrice")}
          defaultValue={values.startingPrice}
          margin="normal"
          fullWidth
        />
        <TextField
          placeholder="Enter Start Time"
          label="Start Time"
          type="datetime-local"
          onChange={handleChange("startTime")}
          defaultValue={values.startTime}
          margin="normal"
          fullWidth
        />
        <TextField
          placeholder="Enter End Time"
          label="End Time"
          type="datetime-local"
          onChange={handleChange("endTime")}
          defaultValue={values.endTime}
          margin="normal"
          fullWidth
        />
        <Button color="secondary" variant="contained" onClick={backStep}>
          Back
        </Button>
        <Button color="primary" variant="contained" onClick={continueStep}>
          Continue
        </Button>
      </div>
    </ThemeProvider>
  );
};

export default AuctionDetails;
