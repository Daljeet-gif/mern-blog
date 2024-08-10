import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadError, setimageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageUploadProgress, setimageUploadProgress] = useState(null);
  const handleImageUpload = async () => {
    try {
      if (!file) {
        setimageUploadError("please Select Image");
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setimageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setimageUploadError("Image upload failed");
          setimageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setimageUploadProgress(null);
            setimageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setimageUploadError("Image upload failed");
      setimageUploadProgress(null);
      console.log(error);
    }
  };
const navigate=useNavigate()
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.messsage);
        return;
      }
   
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
        
      }
    } catch (error) {
      setPublishError("somthing went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7">Create post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title "
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title:e.target.value })
            }
          ></TextInput>

          <Select
            onChange={(e) =>
              setFormData({ ...formData, category:e.target.value })
            }
          >
            <option value="uncategorized"> Select a category</option>
            <option value="javascript"> Javascript</option>
            <option value="reactjs"> Reactjs</option>
            <option value="nextjs"> Nextjs</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          ></FileInput>
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            disabled={imageUploadProgress}
            onClick={handleImageUpload}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="Upload"
            className="w-full h-72 object-cover"
          ></img>
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write Somthing about post"
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({...formData, content:value })}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {publishError &&<Alert color="failure"className="mt-5" >{publishError}</Alert>}
      </form>
    </div>
  );
}
