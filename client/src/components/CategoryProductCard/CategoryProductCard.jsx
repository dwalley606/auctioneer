// client/src/components/CategoryProductCard/CategoryProductCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const CategoryProductCard = ({ product }) => {
  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: "auto", borderRadius: "8px" }}
        />
      </Link>
      <Typography variant="h6" sx={{ marginTop: "8px" }}>
        {product.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {product.description.substring(0, 60)}...
      </Typography>
      <Typography variant="body1" sx={{ marginTop: "8px" }}>
        ${product.price}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: "16px" }}
        component={Link}
        to={`/products/${product.id}`}
      >
        View Details
      </Button>
    </Box>
  );
};

export default CategoryProductCard;
