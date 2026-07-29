import { Link } from "react-router-dom";
import { logoutUser } from "../api/authApi";

export default function Navbar() {
  return (
    <nav className="bg-slate-700 text-slate-300 p-3 flex gap-3">
      <Link to="/">Strona Główna</Link>
      <Link to="/login">Logowanie</Link>
      <Link to="/register">Rejestracja</Link>
      <button onClick={logoutUser} className="hover:cursor-pointer">
        Wyloguj
      </button>
    </nav>
  );
}
