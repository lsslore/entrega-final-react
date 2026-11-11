import { Link } from 'react-router-dom';
import styles from './Nav.module.css';
import { useCarrito } from '../../context/CarritoContext';
import { useAuth } from '../../context/AuthContext';

const Nav = () => {
  const { itemsEnCarrito } = useCarrito();
  const { user } = useAuth();
  const totalItems = itemsEnCarrito();
  
  return (
    <nav className={styles.navContainer}>
      {user && (
        <ul className={styles.navList}>
          <li>
            <Link to="/productos" className={styles.navLink}>
              PRODUCTOS
            </Link>
          </li>
          <li>
            <Link to="/computacion" className={styles.navLink}>
              COMPUTACION
            </Link>
          </li>
          <li>
            <Link to="/audio" className={styles.navLink}>
              AUDIO
            </Link>
          </li>
          <li>
            <Link to="/carrito" className={`${styles.navLink} ${styles.cartLink}`}>
              CARRITO
              {totalItems > 0 && (
                <span className={styles.cartCount}>{totalItems}</span>
              )}
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Nav;