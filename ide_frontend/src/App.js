import { useState } from "react";

export default function Notepad() {
  const [text, setText] = useState("");

  return (
    <div className="bg-[#faf9f5] w-screen h-screen flex justify-center items-center">
      <div className="w-[70%] h-full flex">
        <textarea
          className="w-full h-full bg-[#fff] outline-none font-mono text-lg p-4 border-none resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your notes here..."
        />
      </div>
    </div>
  );
}

