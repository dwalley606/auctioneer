import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../redux/products/productsSlice";
import ProductType from "../components/ProductForm/ProductType";
import UserDetails from "../components/ProductForm/UserDetails";
import ProductDetails from "../components/ProductForm/ProductDetails";
import AuctionDetails from "../components/ProductForm/AuctionDetails";
import Confirm from "../components/ProductForm/Confirm";
import Success from "../components/ProductForm/Success";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./css/Posting.css";
import { uploadImage } from "../utils/uploadImage";

const validateForm = (formData, auctionData, isAuction) => {
  const errors = {};
  if (!formData.name) errors.name = "Name is required";
  if (!formData.description) errors.description = "Description is required";
  if (!formData.price) errors.price = "Price is required";
  if (!formData.quantity) errors.quantity = "Quantity is required";
  if (!formData.categoryId) errors.categoryId = "Category is required";
  if (!formData.subcategoryId) errors.subcategoryId = "Subcategory is required";
  if (!formData.image) errors.image = "Image is required";
  if (isAuction) {
    if (!auctionData.startingPrice)
      errors.startingPrice = "Starting price is required";
    if (!auctionData.startTime) errors.startTime = "Start time is required";
    if (!auctionData.endTime) errors.endTime = "End time is required";
  }
  return errors;
};

const Posting = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.categories.items);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    subcategoryId: "",
    image: null,
  });

  const [auctionData, setAuctionData] = useState({
    startingPrice: "",
    startTime: "",
    endTime: "",
  });

  const [isAuction, setIsAuction] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [step, setStep] = useState(0);

  const handleImageUpload = (file) => {
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleChange = (input) => (e) => {
    const { value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [input]: files ? files[0] : value,
    }));
  };

  const handleAuctionChange = (input) => (e) => {
    const { value } = e.target;
    setAuctionData((prevData) => ({
      ...prevData,
      [input]: value,
    }));
  };

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

   const handleNext = () => nextStep();
   const handleBack = () => prevStep();
   const handleStep = (step) => () => setStep(step);

  const values = { ...formData, ...auctionData };

  const stepsForSale = [
    "Product Type",
    "User Details",
    "Product Details",
    "Confirm",
    "Success",
  ];
  const stepsForAuction = [
    "Product Type",
    "User Details",
    "Product Details",
    "Auction Details",
    "Confirm",
    "Success",
  ];

  const steps = isAuction ? stepsForAuction : stepsForSale;

  const totalSteps = () => steps.length;
  const isLastStep = () => step === totalSteps() - 1;
  const allStepsCompleted = () => step === totalSteps();

  const handleComplete = () => {
    if (step === 3 || (step === 2 && !isAuction)) {
      const errors = validateForm(formData, auctionData, isAuction);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        console.log("Posting: Form validation errors", errors);
        return;
      }
    }
    nextStep();
  };

  const handleReset = () => setStep(0);

 const handleSubmit = async (
   e,
   formData,
   auctionData,
   isAuction,
   currentUser
 ) => {
   e.preventDefault();
   const errors = validateForm(formData, auctionData, isAuction);
   if (Object.keys(errors).length > 0) {
     setFormErrors(errors);
     console.log("Posting: Form validation errors", errors);
     return;
   }

   try {
     const imageUrl = await uploadImage(formData.image);
     const productData = {
       name: formData.name,
       description: formData.description,
       price: parseFloat(formData.price),
       quantity: parseInt(formData.quantity, 10),
       categoryId: formData.categoryId,
       subcategoryId: formData.subcategoryId,
       image: imageUrl,
       sellerId: currentUser.id.toString(),
     };

     if (isAuction) {
       productData.startingPrice = parseFloat(auctionData.startingPrice);
       productData.startTime = auctionData.startTime;
       productData.endTime = auctionData.endTime;
     }

     console.log("Form Data to be sent:", productData);

     const result = await dispatch(createProduct(productData)).unwrap();
     console.log("Product created successfully", result);
     nextStep();
   } catch (error) {
     console.error("Error creating product:", error);
     console.error("Full error object:", JSON.stringify(error, null, 2));
     setFormErrors({ submit: error.message || "Failed to create product" });
   }
 };


  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </Box>
      {step > 0 && (
        <Stepper nonLinear activeStep={step}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton color="inherit" onClick={() => setStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      )}
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you're finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {step === 0 && (
              <ProductType nextStep={nextStep} setIsAuction={setIsAuction} />
            )}
            {step === 1 && (
              <UserDetails
                nextStep={nextStep}
                handleChange={handleChange}
                values={values}
              />
            )}
            {step === 2 && (
              <ProductDetails
                nextStep={nextStep}
                prevStep={prevStep}
                handleChange={handleChange}
                handleImageUpload={handleImageUpload}
                values={values}
                categories={categories}
              />
            )}
            {step === 3 && (
              <Confirm
                nextStep={nextStep}
                prevStep={prevStep}
                values={values}
                auctionData={auctionData}
                isAuction={isAuction}
                handleSubmit={handleSubmit}
                currentUser={currentUser}
              />
            )}
            {step === 4 && <Success values={values} />}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              {step > 0 && (
                <Button
                  color="inherit"
                  disabled={step === 0}
                  onClick={prevStep}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
              )}
              <Box sx={{ flex: "1 1 auto" }} />
              {step !== steps.length && step > 0 && (
                <Button onClick={handleComplete} sx={{ mr: 1 }}>
                  {isLastStep() ? "Finish" : "Complete Step"}
                </Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
};

export default Posting;
