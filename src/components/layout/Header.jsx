import Nav from "./Nav";
import { Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import styles from "./Header.module.css"; 

const Header = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className={styles.headerWrapper}>
      <header className={styles.headerContainer}>
        <div className={styles.brandSection}>
          <Link to="/" className={styles.brandLogo}>
            NEON TECH
          </Link>
        </div>
        <div className={styles.centerSection}>
          <Nav />
        </div>
        <div className={styles.userSection}>
          <ul className={styles.userList}>
            {/* Logica de renderizado condicional */}
            {user ? (
              <>
                <div className={styles.userGreeting}>
                  <span>¡Hola!</span>
                  <span className={styles.userEmail}>{user.email}</span>
                </div>
                {user.rol === "admin" && (
                  <li>
                    <Link to="/panel" style={{ color: "var(--clr-accent)" }}>
                      Panel
                    </Link>
                  </li>
                )}
                <button className={styles.logoutButton} onClick={logout}>Cerrar Sesión</button>
              </>
            ) : (
              <li>
                <Link to="/login" className={styles.loginLink}>Acceso</Link>
              </li>
            )}
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;