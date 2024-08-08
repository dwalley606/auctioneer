import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CardActions,
} from "@mui/material";

const ProductCard = ({ product, handleEdit, handleDelete }) => {
  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      {product.image && (
        <CardMedia
          component="img"
          height="140"
          image={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.src = "/path/to/default-image.jpg"; // Fallback image
          }}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="h6" color="text.primary">
          ${product.price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => handleEdit(product)}
        >
          Edit
        </Button>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(product.id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
