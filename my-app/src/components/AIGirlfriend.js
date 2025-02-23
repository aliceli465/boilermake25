import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

// ----------
// Syllable counting helpers (simple heuristic)
function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length === 0) return 0;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const syllableMatches = word.match(/[aeiouy]{1,2}/g);
  return syllableMatches ? syllableMatches.length : 1;
}

function countSyllablesInText(text) {
  const words = text.split(/\s+/);
  return words.reduce((total, word) => total + countSyllables(word), 0);
}
// ----------

// ----------
// Scene component (inside Canvas)
// This loads the GLB model and animates morph target index 0 (mouth)
// with a 0.2-second cycle while `isTalking` is true.
function KitaScene({ isTalking }) {
  const meshRef = useRef(null);
  const { scene } = useGLTF("/kita_ikuyo__bocchi_the_rock.glb");

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

  useFrame(() => {
    if (!meshRef.current) return;
    const influences = meshRef.current.morphTargetInfluences;
    if (!influences) return;
    if (isTalking) {
      const time = performance.now() / 1000; // seconds
      // 0.2-second cycle = 5 Hz
      const phase = 2 * Math.PI * 5 * time;
      influences[0] = 0.5 + 0.5 * Math.sin(phase);
    } else {
      influences[0] = 0;
    }
  });

  return (
    <>
      <OrbitControls enablePan enableZoom />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <primitive object={scene} scale={[2, 2, 2]} position={[0, -1.5, 0]} />
    </>
  );
}
// ----------

// ----------
// This function calls the OpenAI Chat API to fetch a response.
// WARNING: Do not expose your API key in production frontend code.
async function fetchGirlfriendResponse(userInput) {
  const apiKey = "******"; // Replace with your API key for testing
  const url = "https://api.openai.com/v1/chat/completions";

  const messages = [
    {
      role: "system",
      content:
        "You are a loving, supportive girlfriend who responds warmly and intimately to your partner.",
    },
    { role: "user", content: userInput },
  ];

  const body = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0.7,
    max_tokens: 100,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error("OpenAI API error:", response.statusText);
    return "I'm sorry, I couldn't think of a response.";
  }

  const data = await response.json();
  const reply = data.choices[0].message.content.trim();
  return reply;
}
// ----------

// Main component: Chat interface with conversation, TTS, and 3D mouth animation.
export default function ChatWithGirlfriend() {
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const [isTalking, setIsTalking] = useState(false);

  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage) return;

    // Append user's message to the conversation
    setConversation((prev) => [...prev, { sender: "You", text: userMessage }]);
    setInput("");

    // Get a response from OpenAI Chat API
    const response = await fetchGirlfriendResponse(userMessage);
    setConversation((prev) => [
      ...prev,
      { sender: "Girlfriend", text: response },
    ]);

    // Count syllables in the response for timing (200ms per syllable)
    const syllableCount = countSyllablesInText(response);
    console.log("Response syllable count:", syllableCount);

    // Use TTS to speak the response
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(response);

    utterance.onstart = () => {
      console.log("Girlfriend speech started");
      setIsTalking(true);
      // Keep mouth animation active for syllableCount * 200ms
      setTimeout(() => {
        setIsTalking(false);
      }, syllableCount * 200);
    };

    utterance.onend = () => {
      console.log("Girlfriend speech ended");
    };

    synth.speak(utterance);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Chat with Your AI Girlfriend</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Canvas
          style={{ width: "600px", height: "600px" }}
          camera={{ position: [0, 1.5, 7], fov: 50 }}
        >
          <KitaScene isTalking={isTalking} />
        </Canvas>
      </div>
      <div
        style={{
          marginTop: "20px",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "left",
          border: "1px solid #ccc",
          padding: "10px",
          height: "200px",
          overflowY: "auto",
        }}
      >
        {conversation.map((msg, idx) => (
          <div key={idx} style={{ margin: "5px 0", textAlign: msg.sender === "You" ? "right" : "left" }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ width: "400px", padding: "8px", fontSize: "16px" }}
        />
        <button
          onClick={handleSend}
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
          Send
        </button>
      </div>
    </div>
  );
}