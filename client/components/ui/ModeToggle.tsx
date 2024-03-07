import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";

type ModeToggleProps = {};

function ModeToggle({ ...rest }) {
  const { setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = ({}) => {
    setIsDarkMode(!isDarkMode);
    setTheme(isDarkMode ? "light" : "dark");
  };

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, [isDarkMode]);

  return (
    <div
      {...rest}
      className="flex gap-2 items-center justify-center cursor-pointer"
    >
      {isDarkMode ? (
        <SunIcon className="h-8 w-8 text-gray-500" onClick={toggleTheme} />
      ) : (
        <MoonIcon className="h-8 w-8 text-gray-500" onClick={toggleTheme} />
      )}
    </div>
  );
}

export default ModeToggle;
