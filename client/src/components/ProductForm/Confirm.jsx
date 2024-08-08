import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { List, ListItem, ListItemText } from "@mui/material";
import Button from "@mui/material/Button";

const theme = createTheme();

const Confirm = ({
  values,
  auctionData,
  isAuction,
  nextStep,
  prevStep,
  handleSubmit,
  currentUser,
}) => {
  const continueStep = (e) => {
    e.preventDefault();
    console.log("Confirm: Submitting form with values:", values);
    handleSubmit(e, values, auctionData, isAuction, currentUser);
    nextStep();
  };

  const backStep = (e) => {
    e.preventDefault();
    console.log("Confirm: Going back to previous step");
    prevStep();
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="step">
        <h3>Confirm Product Data</h3>
        <List>
          <ListItem>
            <ListItemText primary="Product Name" secondary={values.name} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Description"
              secondary={values.description}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Price" secondary={values.price} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Quantity" secondary={values.quantity} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Category" secondary={values.categoryId} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Subcategory"
              secondary={values.subcategoryId}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Image URL" secondary={values.image} />
          </ListItem>
          {isAuction && (
            <>
              <ListItem>
                <ListItemText
                  primary="Starting Price"
                  secondary={auctionData.startingPrice}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Start Time"
                  secondary={auctionData.startTime}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="End Time"
                  secondary={auctionData.endTime}
                />
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
