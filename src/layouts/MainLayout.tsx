import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default MainLayout;