import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Modal, TextField, Button, Typography } from "@mui/material";
import { updateProduct } from "../../../redux/products/productsSlice";

const EditProductModal = ({ open, handleClose, product }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    quantity: 0,
    price: 0,
    categoryId: "",
    subcategoryId: "",
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        image: product.image,
        quantity: product.quantity,
        price: product.price,
        categoryId: product.category?.id || "",
        subcategoryId: product.subcategory?.id || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    dispatch(updateProduct({ id: product.id, productData: formData }));
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        p={3}
        bgcolor="white"
        borderRadius={3}
        boxShadow={24}
        mx="auto"
        mt="10%"
        width="400px"
      >
        <Typography variant="h6" gutterBottom>
          Edit Product
        </Typography>
        <TextField
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="image"
          label="Image URL"
          value={formData.image}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="quantity"
          label="Quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="price"
          label="Price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            fullWidth
          >
            Update
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProductModal;
