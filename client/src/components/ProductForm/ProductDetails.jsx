import React, { useEffect, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useDropzone } from "react-dropzone";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/categories/categoriesSlice";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./ProductForm.css";

const ProductDetails = ({
  values,
  handleChange,
  nextStep,
  prevStep,
  categories,
}) => {
  const dispatch = useDispatch();
  const {
    items: fetchedCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.categories);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const filePickerRef = useRef();

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB limit
  });

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          handleChange("image")({ target: { value: downloadURL } });
          setImageFileUploading(false);
        });
      }
    );
  };

  const continueStep = (e) => {
    e.preventDefault();
    nextStep();
  };

  const backStep = (e) => {
    e.preventDefault();
    prevStep();
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
          placeholder="Enter Description"
          onChange={handleChange("description")}
          defaultValue={values.description}
          margin="normal"
          fullWidth
        />
      </Box>
      <Box className="form-section">
        <TextField
          label="Price"
          name="price"
          placeholder="Enter Price"
          onChange={handleChange("price")}
          defaultValue={values.price}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Quantity"
          name="quantity"
          placeholder="Enter Quantity"
          onChange={handleChange("quantity")}
          defaultValue={values.quantity}
          margin="normal"
          fullWidth
        />
      </Box>
      <Box className="box-form-section">
        <TextField
          label="Category"
          name="category"
          select
          value={values.category}
          onChange={handleChange("category")}
          SelectProps={{
            native: true,
          }}
          margin="normal"
          fullWidth
        >
          <option value=""></option>
          {categoriesLoading && <option>Loading...</option>}
          {categoriesError && <option>Error loading categories</option>}
          {Array.isArray(fetchedCategories) &&
            fetchedCategories.length > 0 &&
            fetchedCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </TextField>
      </Box>
      <Box className="form-section">
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? "active" : ""}`}
          style={{
            height: "300px",
            border: "2px dotted gray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "20px",
            cursor: "pointer",
          }}
        >
          <input {...getInputProps()} />
          {!imageFile && (
            <div>
              <CloudUploadIcon style={{ fontSize: 50, color: "gray" }} />
              <p>Drag 'n' drop files here to upload</p>
            </div>
          )}
          {imageFile && (
            <div className="image-preview-container">
              <img
                src={imageFileUrl || "/placeholder-image.jpg"}
                alt="product"
                className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]`}
              />
              {imageFileUploadError && (
                <Box className="alert alert-danger">{imageFileUploadError}</Box>
              )}
            </div>
          )}
        </div>
      </Box>
      <Box className="form-actions">
        <Button color="secondary" variant="contained" onClick={backStep}>
          Back
        </Button>
        <Button color="primary" variant="contained" onClick={continueStep}>
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default ProductDetails;
