import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { List, ListItem, ListItemText } from "@mui/material";
import Button from "@mui/material/Button";

const theme = createTheme();

const Confirm = ({ values, nextStep, prevStep }) => {
  const {
    name,
    description,
    price,
    quantity,
    category,
    startingPrice,
    startTime,
    endTime,
  } = values;

  const continueStep = (e) => {
    e.preventDefault();
    nextStep();
  };

  const backStep = (e) => {
    e.preventDefault();
    prevStep();
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="step">
        <h3>Confirm Product Data</h3>
        <List>
          <ListItem>
            <ListItemText primary="Product Name" secondary={name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Description" secondary={description} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Price" secondary={price} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Quantity" secondary={quantity} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Category" secondary={category} />
          </ListItem>
          {startingPrice && (
            <>
              <ListItem>
                <ListItemText
                  primary="Starting Price"
                  secondary={startingPrice}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Start Time" secondary={startTime} />
              </ListItem>
              <ListItem>
                <ListItemText primary="End Time" secondary={endTime} />
              </ListItem>
            </>
          )}
        </List>
        <Button color="secondary" variant="contained" onClick={backStep}>
          Back
        </Button>
        <Button color="primary" variant="contained" onClick={continueStep}>
          Confirm & Continue
        </Button>
      </div>
    </ThemeProvider>
  );
};

export default Confirm;
