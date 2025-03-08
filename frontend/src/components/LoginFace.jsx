import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import * as faceapi from "face-api.js";

const LoginFace = () => {
  const [image, setImage] = useState(null);
  const [userName, setUserName] = useState(null);
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

  // Verify Face
  const verifyFace = async () => {
    if (!image) return alert("Please capture or upload an image!");

    const imgElement = imgRef.current || document.createElement("img");
    imgElement.src = image;

    const detections = await faceapi.detectSingleFace(imgElement)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      return alert("No face detected. Try again.");
    }

    try {
      const faceDescriptorArray = Array.from(detections.descriptor);

      const response = await axios.post("http://localhost:5000/api/auth/login", {
        faceDescriptor: faceDescriptorArray,
      });

      alert(`✅ Face Matched! Welcome, ${response.data.username}!`);
      setUserName(response.data.username);
    } catch (error) {
      console.error("Login failed:", error);
      alert("❌ Face does not match!");
    }
  };

  return (
    <div>
      <h2>Login with Face</h2>
      <Webcam ref={webcamRef} screenshotFormat="image/png" width={400} height={300} />
      <button onClick={capture}>Capture from Webcam</button>
      <br />
      <input type="file" accept="image/*" onChange={handleUpload} />
      <br />
      {image && <img ref={imgRef} src={image} alt="Captured Face" width="200" />}
      <br />
      <button onClick={verifyFace}>Verify Face</button>
      {userName && <h3>Welcome, {userName}!</h3>}
    </div>
  );
};

export default LoginFace;
