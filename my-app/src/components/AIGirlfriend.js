import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

//
// 1) Scene component (inside Canvas)
//    - We can safely useFrame here.
//
function KitaScene({ isTalking }) {
  const meshRef = useRef(null);

  // Load the model
  const { scene } = useGLTF("/kita_ikuyo__bocchi_the_rock.glb");

  // On mount, find the first mesh with morph targets
  useEffect(() => {
    let foundMesh = null;
    scene.traverse((obj) => {
      if (!foundMesh && obj.morphTargetDictionary && obj.morphTargetInfluences) {
        foundMesh = obj;
      }
    });
    if (foundMesh) {
      meshRef.current = foundMesh;
      console.log("Found mesh with morph targets:", foundMesh.name);
      console.log("MorphTargetDictionary:", foundMesh.morphTargetDictionary);
      console.log("MorphTargetInfluences:", foundMesh.morphTargetInfluences);
    } else {
      console.warn("No mesh with morph targets found in this model.");
    }
  }, [scene]);

  // Animate morph target index 0 (the mouth) while isTalking
  useFrame(() => {
    if (!meshRef.current) return;
    const influences = meshRef.current.morphTargetInfluences;
    if (!influences) return;

    if (isTalking) {
      const time = performance.now() / 100;
      // Animate with a sine wave, 0..1
      influences[0] = 0.5 + 0.5 * Math.sin(time);
    } else {
      influences[0] = 0;
    }
  });

  return (
    <>
      <OrbitControls enablePan enableZoom />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {/* Display the loaded scene */}
      <primitive object={scene} scale={[2, 2, 2]} position={[0, -1.5, 0]} />
    </>
  );
}

//
// 2) Parent component (outside Canvas)
//    - Holds TTS logic and text input
//
export default function KitaIkuyoMouth() {
  const [isTalking, setIsTalking] = useState(false);
  const [text, setText] = useState("");

  // Text-to-Speech logic
  const speak = () => {
    const input = text.trim();
    if (!input) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(input);

    utterance.onstart = () => {
      console.log("Speech started");
      setIsTalking(true);
    };

    utterance.onend = () => {
      console.log("Speech ended");
      // Slight delay after speech
      setTimeout(() => {
        setIsTalking(false);
      }, 2000);
    };

    synth.speak(utterance);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Kita Ikuyo - Mouth at Index 0</h1>

      {/* Canvas with the Scene component inside */}
      <Canvas style={{ width: "600px", height: "600px" }}>
        <KitaScene isTalking={isTalking} />
      </Canvas>

      {/* TTS UI */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Type something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ padding: "8px", width: "300px", fontSize: "16px" }}
        />
        <button
          onClick={speak}
          style={{
            marginLeft: "10px",
            padding: "8px 16px",
            fontSize: "16px",
            background: "#e91e63",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Speak 💬
        </button>
      </div>
    </div>
  );
} 