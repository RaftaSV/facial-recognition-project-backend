import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const Delete = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const canvas2Ref = useRef(null);
  const [photoBlob, setPhotoBlob] = useState(null);

  useEffect(() => {
    startApp();
  }, []);

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
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
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
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ]).then(() => {
      faceDetector();
    });
  };
  const faceDetector = async () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(
          webcamRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks();
      canvas2Ref.current.innerHTML = faceapi.createCanvasFromMedia(
        webcamRef.current
      );
      faceapi.matchDimensions(canvasRef.current, webcamRef.current);
      const resizedDetections = faceapi.resizeResults(detections, {
        width: 320,
        height: 240,
      });
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
    }, 100);
  };

  const startApp = async () => {
    await loadModels();
    console.log('Models loaded.');
  };

  return (
    <div className="App">
      <h1>Face Recognition App</h1>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <canvas id="canvas" ref={canvas2Ref}></canvas>
      <div>
        <button onClick={capturePhoto}>Tomar Foto</button>
        <button onClick={clearPhoto}>Limpiar</button>
        <button onClick={drawPhoto}>Dibujar Foto</button>
      </div>
      <canvas id="canvas" ref={canvasRef}></canvas>
    </div>
  );
};

export default Delete;
