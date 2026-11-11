import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore'; 
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext"; 
import styles from './Registro.module.css';

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { signup } = useAuth(); 
  
  const manejarSubmit = async (evento) => {
    evento.preventDefault();
    setError(null);

    try {
      // Creamos el usuario usando la función 'signup' del AuthContext
      const credencialUsuario = await signup(email, password);
      const user = credencialUsuario.user;

      // Guardamos los datos adicionales en Firestore usando el UID generado
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: nombre,
        apellido: apellido,
        rol: "usuario", 
        email: email
      });

      // Redirigimos al inicio
      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        const quiereLoguearse = window.confirm(
          "Este correo electrónico ya está registrado. ¿Desea intentar iniciar sesión?"
        );

        if (quiereLoguearse) {
          navigate("/login");
        } else {
          navigate("/");
        }
      } else {
        setError(
          "Ocurrió un error al registrar el usuario. Verifique los datos e intente nuevamente."
        );
        console.error("Error en el registro:", error.message);
      }
    }
  };

  return (
    <section className={styles.registerPage}>
      <div className={styles.registerCard}>
        <div className={styles.accentMark} aria-hidden="true" />
        <p className={styles.eyebrow}>NEON TECH</p>
        <h1 className={styles.title}>Crear una cuenta</h1>
        <p className={styles.subtitle}>Registrate para comenzar a disfrutar</p>

        <form className={styles.form} onSubmit={manejarSubmit}>
          <div className={styles.field}>
            <label htmlFor="register-name">Nombre</label>
            <input
              id="register-name"
              type="text"
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
              autoComplete="given-name"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="register-surname">Apellido</label>
            <input
              id="register-surname"
              type="text"
              value={apellido}
              onChange={(evento) => setApellido(evento.target.value)}
              autoComplete="family-name"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="register-email">Correo electrónico</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="register-password">Contraseña</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(evento) => setPassword(evento.target.value)}
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          {error && <p className={styles.errorMessage} role="alert">{error}</p>}
          <button className={styles.submitButton} type="submit">Registrarme</button>
        </form>

        <p className={styles.loginPrompt}>
          ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </section>
  );
};

export default Registro;