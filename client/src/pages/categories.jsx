import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_PRODUCTS_BY_CATEGORY, GET_CATEGORIES } from "../utils/queries";
import CategoryProductCard from "../components/CategoryProductCard/CategoryProductCard";
import { Box, Typography } from "@mui/material";

const Categories = () => {
  const { categoryId, subcategoryId } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");

  console.log("Params:", { categoryId, subcategoryId });

  const {
    loading: loadingProducts,
    error: errorProducts,
    data: dataProducts,
    refetch,
  } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { categoryId, subcategoryId },
    onCompleted: (data) => {
      console.log("Fetched products by category:", data);
    },
    onError: (error) => {
      console.error("Error fetching products by category:", error.message);
    },
  });

  const {
    loading: loadingCategories,
    error: errorCategories,
    data: dataCategories,
  } = useQuery(GET_CATEGORIES, {
    onCompleted: (data) => {
      const category = data.categories.find((cat) => cat.id === categoryId);
      if (category) {
        setCategoryName(category.name);
        if (subcategoryId) {
          const subcat = category.subcategories.find(
            (sub) => sub.id === subcategoryId
          );
          if (subcat) {
            setSubcategoryName(subcat.name);
          }
        }
      }
    },
    onError: (error) => {
      console.error("Error fetching categories:", error.message);
    },
  });

  useEffect(() => {
    console.log("Refetching products for category/subcategory change...");
    refetch();
  }, [categoryId, subcategoryId, refetch]);

  if (loadingProducts || loadingCategories) return <div>Loading...</div>;
  if (errorProducts || errorCategories)
    return (
      <div>Error: {errorProducts?.message || errorCategories?.message}</div>
    );

  const products = dataProducts?.productsByCategory || [];
  console.log("Products to display:", products);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Products in {subcategoryName || categoryName}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {products.length > 0 ? (
          products.map((product) => (
            <CategoryProductCard key={product.id} product={product} />
          ))
        ) : (
          <Typography variant="body1">No products found.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Categories;
