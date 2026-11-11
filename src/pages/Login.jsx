import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const manejarLogin = async (evento) => {
    evento.preventDefault();
    try {
      await login(email, password);
      alert("¡Inicio de sesión exitoso!");
      navigate("/");
    } catch (error) {
      console.error("Error en el login:", error.code, error.message);
      alert("Error: " + error.message);
    }
  };

  return (
    <section className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.accentMark} aria-hidden="true" />
        <p className={styles.eyebrow}>NEON TECH</p>
        <h1 className={styles.title}>Iniciar sesión</h1>
        <p className={styles.subtitle}>Ingresa tu cuenta para continuar</p>

        <form className={styles.form} onSubmit={manejarLogin}>
          <div className={styles.field}>
            <label htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              placeholder="Ingresá tu contraseña"
              value={password}
              onChange={(evento) => setPassword(evento.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button className={styles.submitButton} type="submit">Ingresar</button>
        </form>

        <p className={styles.registerPrompt}>
          ¿No tenés una cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;