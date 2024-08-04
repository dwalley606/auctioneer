import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import "./ProductForm.css"; // Create and use a separate CSS file if needed for custom styles

const UserDetails = ({ values, handleChange, nextStep }) => {
  const continueStep = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <Box>
      <h3 className="section-title">Enter User Details</h3>
      <Box className="form-section">
        <TextField
          label="First Name"
          name="firstName"
          placeholder="Enter Your First Name"
          onChange={handleChange("firstName")}
          defaultValue={values.firstName}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Last Name"
          name="lastName"
          placeholder="Enter Your Last Name"
          onChange={handleChange("lastName")}
          defaultValue={values.lastName}
          margin="normal"
          fullWidth
        />
      </Box>
      <Box className="form-section">
        <TextField
          label="Email"
          name="email"
          placeholder="Enter Your Email"
          onChange={handleChange("email")}
          defaultValue={values.email}
          margin="normal"
          fullWidth
        />
      </Box>
      <Box className="form-actions">
        <Button color="primary" variant="contained" onClick={continueStep}>
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default UserDetails;
