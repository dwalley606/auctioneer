import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import { createProduct } from "../../redux/products/productsSlice";

const theme = createTheme();

const Success = ({ values }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const submitProduct = async () => {
      try {
        console.log("Success: Creating product with values:", values);
        const productData = {
          name: values.name,
          description: values.description,
          price: parseFloat(values.price),
          quantity: parseInt(values.quantity, 10),
          categoryId: String(values.categoryId),
          subcategoryId: String(values.subcategoryId),
          image: values.image,
          sellerId: String(currentUser.id),
        };

        const result = await dispatch(createProduct(productData)).unwrap();
        console.log("Product created successfully:", result);
      } catch (error) {
        console.error("Error creating product:", error);
      }
    };

    submitProduct();
  }, [dispatch, values, currentUser]);

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
