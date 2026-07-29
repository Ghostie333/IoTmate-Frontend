import { useState } from "react";
import { loginUser } from "../api/authApi";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Logowanie dla:", email);

    const response = await loginUser({ email, password });
    if (response.ok) {
      alert("Zalogowano pomyślnie!");
    } else {
      alert("Błąd logowania!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Logowanie</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Hasło: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Zaloguj
        </button>
      </form>
    </div>
  );
}
