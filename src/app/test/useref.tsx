"use client";
import React, { useRef } from "react";

function App() {
  // Create a ref for the div element
  const myDivRef = useRef<HTMLDivElement | null>(null); // Add type annotation


  


  const changeText = () => {
    // Access and update the text content using the ref
    if (myDivRef.current) {
      myDivRef.current.textContent = "New Text Content";
    }
  };

  return (
    <div>
      <div id="myDiv" ref={myDivRef}>
        Initial Text Content
      </div>
      <button onClick={changeText}>Change Text</button>
    </div>
  );
}

export default App;
