import React, { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PRODUCT } from "../../utils/mutations";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";

const theme = createTheme();

const Success = ({ values }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [createProduct] = useMutation(CREATE_PRODUCT);

  useEffect(() => {
    const submitProduct = async () => {
      try {
        console.log("Success: Creating product with values:", values);
        const { data } = await createProduct({
          variables: {
            name: values.name,
            description: values.description,
            price: parseFloat(values.price),
            quantity: parseInt(values.quantity, 10),
            categoryId: values.categoryId,
            image: values.image,
          },
        });
        console.log("Product created successfully:", data.createProduct);
      } catch (error) {
        console.error("Error creating product:", error);
      }
    };

    submitProduct();
  }, [createProduct, values, currentUser]);

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
