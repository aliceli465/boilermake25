import { useState } from "react";

export default function Notepad() {
  const [text, setText] = useState("");

  return (
    <div className="bg-[#faf9f5] min-h-screen min-w-screen p-4 flex justify-center items-center">
      <div className="w-full h-full bg-[#fff] border-2 border-gray-400 shadow-lg p-4 font-mono text-lg leading-relaxed outline-none overflow-auto">
        <textarea
          className="w-full h-full bg-transparent resize-none outline-none font-mono text-lg"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your notes here..."
        />
      </div>
    </div>
  );
}

