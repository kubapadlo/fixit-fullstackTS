import { login } from "../services/login";
import { useState } from "react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // konieczne w react - zapobiega przeladowaniu strony
    login({ email, password });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="text"
          name="email"
          onChange={(e) => setEmail(e.target.value)} // pobranie wartosci z pola inputowego
        />

        <label>
          Password
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit">przycisk</button>
      </form>
    </>
  );
}
