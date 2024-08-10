import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  DeleteUserFailure,
  DeleteUserStart,
  DeleteUserSuccess,
  SignOut,
  UpdateUserFailure,
  UpdateUserStart,
  UpdateUserSuccess,
} from "../redux/userSlice";
import {

  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { Link } from "react-router-dom";
export default function DashProfile() {
  const dispatch = useDispatch();

  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModel, setShowModel] = useState(false);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const [updateUserError, setupdateUserError] = useState(null);
  const [imageuploadingSuccess, setimageuploadingSuccess] = useState(false);
  const [imageFileUploadingProgress, setimageFileUploadingProgress] =
    useState(null);
  const [updateUserStatus, setupdateUserStatus] = useState(null);
  const [imageFileUploadingError, setimageFileUploadingError] = useState(null);
  const filePickerRef = useRef();
  const { currentUser, error, loading } = useSelector((state) => state.user);

  const handleImage = (e) => {
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
    setimageuploadingSuccess(true);
    setimageFileUploadingError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;

    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setimageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setimageFileUploadingError(
          "Could not upload image (File must be less than 2MB"
        );
        setimageFileUploadingProgress(null);
        setImageFileUrl(null);
        setImageFileUrl(null);
        setimageuploadingSuccess(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setimageuploadingSuccess(false);
        });
      }
    );
  };

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setupdateUserError(null);
    setupdateUserStatus(null);
    if (Object.keys(formData).length === 0) {
      setupdateUserError("No Changes Made");
      return;
    }
    if (imageuploadingSuccess) {
      return;
    }
    try {
      dispatch(UpdateUserStart());
      const res = await fetch(`/api/user/updateuser/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(UpdateUserFailure(data.message));
      } else {
        dispatch(UpdateUserSuccess(data));
        setupdateUserStatus("User profile updated successfully");
      }
    } catch (error) {
      dispatch(UpdateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      dispatch(DeleteUserStart());
      const res = await fetch(`/api/user/deleteuser/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(DeleteUserFailure(data.message));
      } else {
        dispatch(DeleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(DeleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/user/signout/${currentUser._id}`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(SignOut());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h2 className="my-7 text-center font-semibold text-3xl">Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImage}
          ref={filePickerRef}
        />
        <div
          className=" relative w-32 h-32 self-center  cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
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
                  stroke: `rgba(62,152,199,${
                    imageFileUploadingProgress / 100
                  })`,
                },
              }}
            ></CircularProgressbar>
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-50"
            } `}
          />
        </div>
        {imageFileUploadingError && (
          <Alert color="failure">{imageFileUploadingError}</Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleInput}
        ></TextInput>

        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleInput}
        ></TextInput>
        <TextInput
          type="password"
          id="password"
          onChange={handleInput}
          placeholder="****************"
        ></TextInput>
        <Button
          type="submit"
          disabled={loading}
          gradientDuoTone="purpleToBlue"
          outline
        >
          {loading ? "Loading.." : "Update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to="/createpost">
            <Button
              type="buuton"
              gradientDuoTone="purpleToBlue"
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModel(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      {updateUserStatus && (
        <Alert color="success" className="mt-5">
          {updateUserStatus}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}

      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200  mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete Your account{" "}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes,I'm sure
              </Button>
              <Button color="success" onClick={() => setShowModel(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
