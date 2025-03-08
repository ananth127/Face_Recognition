import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import * as faceapi from "face-api.js";

const RegisterFace = () => {
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const webcamRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    };
    loadModels();
  }, []);

  // Capture Image from Webcam
  const capture = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
  };

  // Handle File Upload
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Save Face Descriptor to Backend
  const saveFaceDescriptor = async () => {
    if (!image || !username) {
      return alert("Please enter a username and capture/upload an image!");
    }

    const imgElement = imgRef.current || document.createElement("img");
    imgElement.src = image;

    const detections = await faceapi.detectSingleFace(imgElement)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      return alert("No face detected. Try again.");
    }

    try {
      const faceDescriptorArray = Array.from(detections.descriptor); // Convert to Array

      await axios.post("https://face-recognition-wheat.vercel.app/api/auth/register", {
        username,
        faceDescriptor: faceDescriptorArray,
      });

      alert("✅ Face registered successfully!");
    } catch (error) {
      console.error("Error registering face:", error);
      alert("❌ Registration failed.");
    }
  };

  return (
    <div>
      <h2>Register Face</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <Webcam ref={webcamRef} screenshotFormat="image/png" width={400} height={300} />
      <button onClick={capture}>Capture from Webcam</button>
      <br />
      <input type="file" accept="image/*" onChange={handleUpload} />
      <br />
      {image && <img ref={imgRef} src={image} alt="Captured Face" width="200" />}
      <br />
      <button onClick={saveFaceDescriptor}>Save Face ID</button>
    </div>
  );
};

export default RegisterFace;
