import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const Delete = () => {

  const webcamRef = useRef(null);
  const [photoBlob, setPhotoBlob] = useState(null);

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then((res) => res.blob());
    setPhotoBlob(blob);
    localStorage.setItem('photoBlob', blob);
  };

  const clearPhoto = () => {
    setPhotoBlob(null);
    localStorage.removeItem('photoBlob');
  };

  const drawPhoto = () => {
    if (photoBlob) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        document.body.appendChild(canvas);
      };

      const blobUrl = URL.createObjectURL(photoBlob);
      img.src = blobUrl;
    }
  };

  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]);
  };

  const startApp = async () => {
    await loadModels();
    console.log('Models loaded.');
  };

  startApp();

  return (
    <div className="App">
      <h1>Face Recognition App</h1>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <div>
        <button onClick={capturePhoto}>Tomar Foto</button>
        <button onClick={clearPhoto}>Limpiar</button>
        <button onClick={drawPhoto}>Dibujar Foto</button>
      </div>
    </div>
  );
}

export default Delete;