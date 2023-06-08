import * as faceapi from 'face-api.js';
import React, { useEffect } from 'react';

const Delete = () => {
  const viedoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const canvas2Ref = React.useRef(null);

  useEffect(() => {
    startVideo();
    loadModels();
  });

  //inicio de la camara
  const startVideo = () => {
    navigator.getUserMedia(
      { video: {} },
      (stream) => (viedoRef.current.srcObject = stream),
      (err) => console.error(err)
    );
  };

  const takePhoto = async () => {
    const context = canvas2Ref.current.getContext('2d');
    context.drawImage(viedoRef.current, 0, 0, 320, 240);
    //convertir la imagen a base64
    const data = canvas2Ref.current.toDataURL('image/png');
    localStorage.setItem('photo', data);
  };

  const clearPhoto = () => {
    const context = canvas2Ref.current.getContext('2d');
    context.clearRect(
      0,
      0,
      canvas2Ref.current.width,
      canvas2Ref.current.height
    );
  };

  const drawImage = () => {
    const context = canvas2Ref.current.getContext('2d');
    const data = localStorage.getItem('photo');
    const img = new Image();
    img.src = data;
    img.onload = () => {
      context.drawImage(img, 0, 0);
    };
  };

  //cargar los modelos
  const loadModels = async () => {
    const MODEL_URL = '/models';
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]).then(() => {
      faceMyDetector();
    });
  };

  const faceMyDetector = async () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(viedoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
        viedoRef.current
      );
      faceapi.matchDimensions(canvasRef.current, viedoRef.current);
      const resizedDetections = faceapi.resizeResults(detections, {
        width: 320,
        height: 240,
      });
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
    }, 100);
  };
  return (
    <div className="main">
      <div className="appface">
        <div className="video">
          <video
            crossOrigin="anonymous"
            ref={viedoRef}
            autoPlay
            width={320}
            height={240}
          ></video>
        </div>
        <div className="canva">
          <canvas ref={canvasRef} width={320} height={240}></canvas>
        </div>
      </div>
      <div>
        <button className="botonT" onClick={takePhoto}>
          Tomar Foto
        </button>
        <button className="botonC" onClick={clearPhoto}>
          Limpiar
        </button>
        <button className="botonD" onClick={drawImage}>
          Dibujar
        </button>
      </div>
      <div className="canva">
        <canvas ref={canvas2Ref} width={320} height={240}></canvas>
      </div>
    </div>
  );
};

export default Delete;
