"use client";
import { useRef } from "react";

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const inputFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <div>
      <input ref={inputRef} className="border border-border" />
      <button onClick={inputFocus}>click here</button>
    </div>
  );
}
