import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/categories/categoriesSlice";
import { uploadImage } from "../../utils/uploadImage";
import "./ProductForm.css";

const ProductDetails = ({
  values,
  handleChange,
  nextStep,
  prevStep,
  handleImageUpload,
  categories,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    values.categoryId || ""
  );
  const dispatch = useDispatch();
  const {
    items: fetchedCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.categories);

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        handleChange("image")({ target: { value: imageUrl } });
        console.log("ProductDetails: Image uploaded successfully", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        handleChange("image")({ target: { value: imageUrl } });
        console.log("ProductDetails: Image uploaded successfully", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    handleChange("categoryId")(e);
    handleChange("subcategoryId")({ target: { value: "" } });
  };

  const isFormValid = () => {
    const requiredFields = [
      "name",
      "description",
      "price",
      "quantity",
      "categoryId",
      "subcategoryId",
      "image",
    ];
    const missingFields = requiredFields.filter((field) => !values[field]);

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      return false;
    }
    return true;
  };

  return (
    <Box>
      <h3 className="section-title">Enter Product Details</h3>
      <Box className="form-section">
        <TextField
          label="Product Name"
          name="name"
          placeholder="Enter Product Name"
          onChange={handleChange("name")}
          defaultValue={values.name}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          placeholder="Enter Product Description"
          onChange={handleChange("description")}
          defaultValue={values.description}
          margin="normal"
          fullWidth
          multiline
        />
        <TextField
          label="Price"
          name="price"
          placeholder="Enter Price"
          onChange={handleChange("price")}
          defaultValue={values.price}
          margin="normal"
          type="number"
          fullWidth
        />
        <TextField
          label="Quantity"
          name="quantity"
          placeholder="Enter Quantity"
          onChange={handleChange("quantity")}
          defaultValue={values.quantity}
          margin="normal"
          type="number"
          fullWidth
        />
        <TextField
          select
          label="Category"
          name="categoryId"
          value={selectedCategory}
          onChange={handleCategoryChange}
          helperText="Please select a category"
          margin="normal"
          fullWidth
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {fetchedCategories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
        {selectedCategory && (
          <TextField
            select
            label="Subcategory"
            name="subcategoryId"
            value={values.subcategoryId}
            onChange={handleChange("subcategoryId")}
            helperText="Please select a subcategory"
            margin="normal"
            fullWidth
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {fetchedCategories
              .find((cat) => cat.id === selectedCategory)
              .subcategories.map((subcat) => (
                <MenuItem key={subcat.id} value={subcat.id}>
                  {subcat.name}
                </MenuItem>
              ))}
          </TextField>
        )}
        <Box
          className={`dropzone ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          <CloudUploadIcon />
          <p>Drag and drop an image or click to upload</p>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={nextStep}
          disabled={!isFormValid()}
        >
          Next
        </Button>
        <Button
          variant="contained"
          onClick={prevStep}
          style={{ marginLeft: "10px" }}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default ProductDetails;
