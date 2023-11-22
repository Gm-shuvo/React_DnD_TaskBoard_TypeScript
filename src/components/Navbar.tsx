// import { useState, useEffect } from "react";
import { BsSun } from "react-icons/bs";
import { BiMenu, BiSolidSun } from "react-icons/bi";
import { useTheme } from "../contexts/ThemeContext";
import { useState } from "react";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuButton = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <div
      className={`navbar shadow-md px-4 sm:px-8${
        theme === "dark" ? "bg-mainDarkBackgroundColor" : "bg-mainLightBackgroundColor"
      } fixed top-0 `}
    >
      <div className="flex-1">
        <a href="/" className="text-lg font-bold mx-4">
          TasksBoard
        </a>
      </div>
      <div className="flex-none">
        {/* Toggle button here */}
        <button className="btn btn-square btn-ghost">
          <label className="swap swap-rotate w-12 h-12">
            <input
              type="checkbox"
              onChange={toggleTheme}
              // show toggle image based on localstorage theme
              checked={theme === "light" ? false : true}
            />
            {/* light theme sun image */}
            <BiSolidSun className="w-8 h-8 swap-off" />
            <BsSun className="w-8 h-8 swap-on" />
            {/* dark theme moon image */}
          </label>
        </button>
      </div>
      <div className="dropdown dropdown-end">
        <label
          tabIndex={1}
          className="btn btn-ghost"
          onClick={() => handleMenuButton()}
        >
          <BiMenu className="w-6 h-6" />
        </label>
        {menuOpen && (
          <ul className={`
          mt-3 
          z-[20] 
          p-2
          shadow-md 
          menu 
          menu-md 
          dropdown-content 
          ${theme === "dark" ? "bg-darkColumnBackgroundColor" : "bg-lightColumnBackgroundColor"}
          rounded-box
          w-52
          `}>
            <li>
              <a href="/settings" className="hover:text-red-500 ">Settings</a>
            </li>
            <li>
              <a href="/about" className=" hover:text-red-500 ">About</a>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};
export default Navbar;
