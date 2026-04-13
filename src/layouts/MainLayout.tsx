import Navbar from "../Components/navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-400">
      <Navbar />

      {/* Affichage des pages */}
      <div className="pt-24 px-6">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;