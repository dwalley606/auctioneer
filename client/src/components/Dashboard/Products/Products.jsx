import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
} from "../../../redux/products/productsSlice";
import EditProductModal from "../EditProductModal/EditProductModal";
import { Box, Typography } from "@mui/material";
import ProductCard from "../ProductCard/ProductCard";

const DashProducts = () => {
  const dispatch = useDispatch();
  const { items: products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { currentUser, loading: userLoading } = useSelector(
    (state) => state.user
  );
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (productsLoading || userLoading) {
    return <div>Loading...</div>;
  }

  if (!products || !currentUser) {
    return <div>No products available</div>;
  }

  const userProducts = products.filter(
    (product) => product.seller && product.seller.id === currentUser.id
  );

  if (userProducts.length === 0) {
    return <div>No products available</div>;
  }

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  const handleEdit = (product) => {
    setEditProduct(product);
  };

  const handleClose = () => {
    setEditProduct(null);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Products
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {userProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </Box>
      {editProduct && (
        <EditProductModal
          open={Boolean(editProduct)}
          handleClose={handleClose}
          product={editProduct}
        />
      )}
    </div>
  );
};

export default DashProducts;
