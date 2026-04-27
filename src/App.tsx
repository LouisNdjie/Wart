import { BrowserRouter, Routes, Route } from "react-router-dom";

/**Layouts */
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
//import AdminLayout from "./layouts/AdminLayout";

/**Pages */
import Home from "./Pages/Home";
import Artistes from "./Pages/Artistes";
import Oeuvres from "./Pages/Oeuvres";
import Edito from "./Pages/Edito";
import Galerie from "./Pages/Galerie";



function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Layout utilisateurs */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="artistes" element={<Artistes />} />
          <Route path="oeuvres" element={<Oeuvres />} />
          <Route path="edito" element={<Edito />} />
          <Route path="galerie" element={<Galerie />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;