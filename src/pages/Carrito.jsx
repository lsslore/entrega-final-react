import { useCarrito } from '../context/CarritoContext';
import styles from './Carrito.module.css';

const Carrito = () => {
  const { 
    carrito, 
    vaciarCarrito, 
    eliminarDelCarrito, 
    incrementarCantidad, 
    decrementarCantidad, 
    cobroTotal 
  } = useCarrito();

  if (carrito.length === 0) {
    return (
      <div>
        <h1>El carrito está vacío</h1>
        <p>Agrega productos para continuar la compra.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Carrito de Compras</h1>
      {carrito.map(item => (
        <div 
          key={item.id} 
          className={styles.cartItem}
        >
          <img
            src={item.imagen || item.image}
            alt={item.nombre}
            className={styles.productImage}
          />
          <div className={styles.productInfo}>
            <h4>{item.nombre}</h4>
            <p>Precio unitario: ${item.precio}</p>
            <p>Subtotal: ${(item.precio * item.cantidad).toFixed(2)}</p>
          </div>

          {/* Controles de cantidad (+ / -) */}
          <div className={styles.quantityControls}>
            <button onClick={() => decrementarCantidad(item.id)}>-</button>
            <span>{item.cantidad}</span>
            <button onClick={() => incrementarCantidad(item.id)}>+</button>
          </div>

          {/* Botón con icono de papelera */}
          <button 
            className={styles.removeButton}
            onClick={() => eliminarDelCarrito(item.id)}
            title="Eliminar producto"
            aria-label={`Eliminar ${item.nombre} del carrito`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      ))}

      <hr />
      <div className={styles.summary}>
        <h3>Total a pagar: ${cobroTotal().toFixed(2)}</h3>
        <button
          className={styles.clearButton}
          onClick={vaciarCarrito}
        >
          Vaciar Carrito
        </button>
      </div>
    </div>
  );
};

export default Carrito;
