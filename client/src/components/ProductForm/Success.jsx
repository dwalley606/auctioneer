import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";

const theme = createTheme();

const Success = () => {
  return (
    <ThemeProvider theme={theme}>
      <Dialog open fullWidth maxWidth="sm">
        <AppBar title="Success" />
        <h1>Thank You For Your Submission</h1>
        <p>You will get an email with further instructions.</p>
      </Dialog>
    </ThemeProvider>
  );
};

export default Success;
