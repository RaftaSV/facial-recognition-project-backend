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

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/png' });
    console.log(blob);
    return blob;
  };

  const blobToDataURL = (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  const takePhoto = () => {
    const context = canvas2Ref.current.getContext('2d');
    context.drawImage(viedoRef.current, 0, 0, 320, 240);
    const data = canvas2Ref.current.toDataURL('image/png');
    //convertir la imagen a blob
    const blob = dataURItoBlob(data);

    localStorage.setItem('photo', blob);
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

  // const drawImage = () => {
  //   const context = canvas2Ref.current.getContext('2d');
  //   const data = localStorage.getItem('photo');
  //   //convertir blob a dataURI
  //   const dataURI = URL.createObjectURL(data);
  //   const image = new Image();
  //   image.src = dataURI;
  //   image.onload = () => {
  //     context.drawImage(image, 0, 0);
  //   };
  // };

  const drawImg = () => {
    const context = canvas2Ref.current.getContext('2d');
    let savedBlob = localStorage.getItem('photo');
    let data = blobToDataURL(savedBlob);
    console.log(data);

    const dataURI = URL.createObjectURL(data);
    const image = new Image();
    image.src = dataURI;
    image.onload = () => {
      context.drawImage(image, 0, 0);
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
        <button className="botonD" onClick={drawImg}>
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
