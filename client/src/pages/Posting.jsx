import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_PRODUCT } from "../utils/mutations";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase/config";
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

const Posting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.categories.items);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
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

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const filePickerRef = useRef();

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    context: {
      headers: {
        "Content-Type": "application/json",
        "x-apollo-operation-name": "CreateProduct",
      },
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

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
          setFormData((prevData) => ({ ...prevData, image: downloadURL }));
          setImageFileUploading(false);
        });
      }
    );
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

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = "First name is required";
    if (!formData.lastName) errors.lastName = "Last name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.name) errors.name = "Name is required";
    if (!formData.description) errors.description = "Description is required";
    if (!formData.price) errors.price = "Price is required";
    if (!formData.quantity) errors.quantity = "Quantity is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.image) errors.image = "Image is required";
    if (isAuction) {
      if (!auctionData.startingPrice)
        errors.startingPrice = "Starting price is required";
      if (!auctionData.startTime) errors.startTime = "Start time is required";
      if (!auctionData.endTime) errors.endTime = "End time is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const productData = {
      ...formData,
      auction: isAuction ? auctionData : null,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
    };

    try {
      const { data } = await createProduct({ variables: productData });
      console.log("Product created:", data.createProduct);
      navigate("/");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

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

  const handleNext = () => {
    nextStep();
  };

  const handleBack = () => {
    prevStep();
  };

  const handleStep = (step) => () => {
    setStep(step);
  };

  const handleComplete = () => {
    if (step === 2) {
      // Validate product details
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }

    nextStep();
  };

  const handleReset = () => {
    setStep(0);
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
              <StepButton color="inherit" onClick={handleStep(index)}>
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
                values={values}
                categories={categories}
              />
            )}
            {step === 3 && isAuction && (
              <AuctionDetails
                nextStep={nextStep}
                prevStep={prevStep}
                handleChange={handleAuctionChange}
                values={values}
              />
            )}
            {step === 3 && !isAuction && (
              <Confirm
                nextStep={nextStep}
                prevStep={prevStep}
                values={values}
              />
            )}
            {step === 4 && isAuction && (
              <Confirm
                nextStep={nextStep}
                prevStep={prevStep}
                values={values}
              />
            )}
            {step === 4 && !isAuction && <Success />}
            {step === 5 && isAuction && <Success />}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              {step > 0 && (
                <Button
                  color="inherit"
                  disabled={step === 0}
                  onClick={handleBack}
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
