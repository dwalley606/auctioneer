import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import { getToken } from "../../../utils/auth";
import "../../../pages/css/Dashboard.css";
import {
  useGetUserProfile,
  useUpdateUserProfile,
} from "../../../utils/actions";
import { uploadImage } from "../../../utils/uploadImage";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../../../redux/user/userSlice";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const { data: userProfileData, refetch: refetchUserProfile } =
    useGetUserProfile();
  const [updateUserProfile] = useUpdateUserProfile();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImageFile();
    }
  }, [imageFile]);

  const uploadImageFile = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);

    try {
      const downloadURL = await uploadImage(imageFile);
      setImageFileUrl(downloadURL);
      setFormData({ ...formData, photoUrl: downloadURL });
      setImageFileUploading(false);
    } catch (error) {
      setImageFileUploadError(error);
      setImageFileUploadProgress(null);
      setImageFile(null);
      setImageFileUrl(null);
      setImageFileUploading(false);
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }

    const token = getToken();
    if (!token) {
      setUpdateUserError("No authentication token found");
      return;
    }

    try {
      dispatch(updateStart());
      const { data } = await updateUserProfile({
        variables: { input: formData },
        context: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });
      if (data && data.updateUserProfile) {
        dispatch(updateSuccess(data.updateUserProfile));
        setUpdateUserSuccess("User's profile updated successfully");
        refetchUserProfile();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    const token = getToken();
    if (!token) {
      setUpdateUserError("No authentication token found");
      return;
    }

    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/signout`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-header">Profile</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="profile-avatar-container"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`profile-avatar ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "profile-avatar-uploading"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          autoComplete="username"
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
          autoComplete="new-password"
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>
      </form>
      <div className="profile-footer">
        <span
          onClick={() => setShowModal(true)}
          className="profile-footer-link"
        >
          Delete Account
        </span>
        <span onClick={handleSignout} className="profile-footer-link">
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="profile-alert">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="profile-alert">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="profile-alert">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="modal-icon" />
            <h3 className="modal-header">
              Are you sure you want to delete your account?
            </h3>
            <div className="modal-footer">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
