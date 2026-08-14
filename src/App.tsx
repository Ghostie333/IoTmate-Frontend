import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RoomsPage from "./pages/rooms/RoomsPage";
import RoomPage from "./pages/rooms/RoomPage";
import { AuthProvider } from "./hooks/authProvider";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl px-6 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* User login/register */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* Rooms */}
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:roomId" element={<RoomPage />} />
            </Routes>
          </main>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
