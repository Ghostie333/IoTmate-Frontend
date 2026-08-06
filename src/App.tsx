import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RoomsPage from "./pages/rooms/RoomsPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* User login/register */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Rooms */}
          <Route path="/rooms" element={<RoomsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
