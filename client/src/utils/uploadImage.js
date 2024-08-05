import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase/config";

const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
const validImageExtensions = [".jpg", ".jpeg", ".png", ".gif"];

const isValidImageType = (file) => {
  const fileType = file.type;
  const fileExtension = file.name
    .substring(file.name.lastIndexOf("."))
    .toLowerCase();
  return (
    validImageTypes.includes(fileType) &&
    validImageExtensions.includes(fileExtension)
  );
};

const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    if (!isValidImageType(file)) {
      reject(
        "Invalid file type. Please upload an image file (jpg, jpeg, png, gif)."
      );
      return;
    }

    // Check if file size is less than 2MB
    if (file.size > 2 * 1024 * 1024) {
      reject("File must be less than 2MB.");
      return;
    }

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(
          "Upload progress:",
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        console.error("Image upload error:", error);
        reject("Could not upload image. Please try again.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("Image uploaded successfully:", downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
};

export { uploadImage };
