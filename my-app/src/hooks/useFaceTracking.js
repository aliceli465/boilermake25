import * as facemesh from "@tensorflow-models/facemesh";
import * as tf from "@tensorflow/tfjs";
import { useEffect, useState } from "react";

async function setupTensorFlow() {
    await tf.setBackend("webgl"); // Set WebGL backend
    await tf.ready(); // Ensure TensorFlow is fully initialized
  }
  
  setupTensorFlow();

export const useFaceTracking = (videoRef) => {
  const [faceData, setFaceData] = useState(null);

  useEffect(() => {
    let model;
    
    const loadModel = async () => {
      model = await facemesh.load();
    };

    const detectFaces = async () => {
      if (!videoRef.current || !videoRef.current.readyState >= 2) {
        return requestAnimationFrame(detectFaces); // Retry if video isn't ready
      }

      const predictions = await model.estimateFaces(videoRef.current);
      if (predictions.length > 0) {
        setFaceData(predictions[0].annotations);
      }
      requestAnimationFrame(detectFaces);
    };

    loadModel().then(() => {
      if (videoRef.current) {
        videoRef.current.addEventListener("loadeddata", detectFaces);
      }
    });

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadeddata", detectFaces);
      }
    };
  }, [videoRef]);

  return faceData;
};
