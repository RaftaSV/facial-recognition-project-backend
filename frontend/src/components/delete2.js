// Cargar Face API.js
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startComparison);

// Función para realizar la comparación
function startComparison() {
  // Capturar imagen de la cámara web
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        // Realizar la detección facial en la imagen de la cámara web
        detectFaceFromCamera();
      };
    })
    .catch((error) => {
      console.error('Error al acceder a la cámara:', error);
    });

  // Función para realizar la detección facial en la imagen de la cámara web
  function detectFaceFromCamera() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    faceapi.detectSingleFace(canvas).then((face) => {
      if (face) {
        // Se detectó un rostro en la imagen de la cámara web
        const cameraFaceDescriptor = face.descriptor;

        // Cargar la otra foto para comparar
        const imageToCompare = document.getElementById('imageToCompare');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = 'ruta_de_la_otra_foto';
        img.onload = () => {
          // Crear un elemento canvas para dibujar la imagen
          const canvas2 = document.createElement('canvas');
          canvas2.width = img.width;
          canvas2.height = img.height;
          const context2 = canvas2.getContext('2d');
          context2.drawImage(img, 0, 0);

          // Realizar la detección facial en la otra foto
          faceapi.detectSingleFace(canvas2).then((face2) => {
            if (face2) {
              // Se detectó un rostro en la otra foto
              const imageFaceDescriptor = face2.descriptor;

              // Comparar los descriptores faciales
              const distance = faceapi.euclideanDistance(
                cameraFaceDescriptor,
                imageFaceDescriptor
              );

              // Establecer un umbral de similitud
              const similarityThreshold = 0.6;

              if (distance < similarityThreshold) {
                // Las dos fotos representan a la misma persona
                console.log('Las fotos representan a la misma persona.');
              } else {
                // Las dos fotos no representan a la misma persona
                console.log('Las fotos no representan a la misma persona.');
              }
            } else {
              console.log('No se detectó un rostro en la otra foto.');
            }
          });
        };
      } else {
        console.log('No se detectó un rostro en la imagen de la cámara web.');
      }
    });
  }
}
