import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useTheme } from "../contexts/ThemeContext";

const Layout = () => {
  const { theme } = useTheme();
  console.log(theme);
  return (
    <div className={`${theme == 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <Navbar />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
