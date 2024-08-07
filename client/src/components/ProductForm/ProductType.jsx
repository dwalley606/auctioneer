import React from "react";
import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

const theme = createTheme();

const ProductType = ({ nextStep, setIsAuction }) => {
  const handleForSale = () => {
    console.log("ProductType: Selected For Sale");
    setIsAuction(false);
    nextStep();
  };

  const handleForAuction = () => {
    console.log("ProductType: Selected For Auction");
    setIsAuction(true);
    nextStep();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <h3 style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>
          How would you like to list your product?
        </h3>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleForSale}
            sx={{ fontSize: "1.5rem", padding: "1rem 2rem" }}
          >
            For Sale
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleForAuction}
            sx={{ fontSize: "1.5rem", padding: "1rem 2rem" }}
          >
            For Auction
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ProductType;
