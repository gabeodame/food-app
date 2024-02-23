import React, { useState, useEffect } from "react";

function detectOS() {
  // This function remains the same
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "unknown";
  }

  const platform = navigator.platform.toLowerCase();
  const userAgent = navigator.userAgent.toLowerCase();

  if (platform.includes("mac") || userAgent.includes("mac")) return "macOS";
  if (platform.includes("win")) return "Windows";
  if (platform.includes("linux")) return "Linux";

  return "unknown";
}

function SearchShortCut() {
  const [os, setOs] = useState("unknown");

  useEffect(() => {
    // Detect OS only on the client side
    setOs(detectOS());
  }, []);

  return (
    <div>
      {os === "macOS" ? (
        <p>
          <kbd>
            <span>⌘</span>
          </kbd>{" "}
          K
        </p>
      ) : (
        <p>
          {/* Provide a consistent initial render, and allow the useEffect to update it */}
          <kbd>
            <span>CTRL</span>
          </kbd>{" "}
          K
        </p>
      )}
    </div>
  );
}

export default SearchShortCut;
