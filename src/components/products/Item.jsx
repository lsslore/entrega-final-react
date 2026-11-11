import { Link } from "react-router-dom"; 
import BotonFavorito from "../BotonFavorito";
import { useCarrito } from "../../context/CarritoContext";
import styles from "./Item.module.css";

const Item = (producto) => {
  const { id, nombre, precio, imagen } = producto;
  const { carrito, agregarACarrito, decrementarCantidad } = useCarrito();

  // La tarjeta muestra la cantidad real del producto guardada en el carrito.
  const cantidad = carrito.find((item) => item.id === id)?.cantidad ?? 0;

  // Agrega una unidad; el contexto suma a la cantidad existente si ya estaba agregado.
  const incrementar = () => agregarACarrito({ producto, cantidad: 1 });

  // El contexto resta una unidad y elimina el producto del carrito si llega a cero.
  const decrementar = () => {
    if (cantidad > 0) {
      decrementarCantidad(id);
    }
  };

  return (
    <article className={styles.card}>
      {/* Clic en la imagen te lleva al detalle */}
      <Link to={`/producto/${id}`} className={styles.imageLink}>
        <img src={imagen} alt={nombre} className={styles.image} />
      </Link>
      <div className={styles.favoriteButton}>
        <BotonFavorito />
      </div>
      
      <h2 className={styles.title}>{nombre}</h2>
      <p className={styles.price}>AR${precio}</p>

      <Link to={`/producto/${id}`} className={styles.detailButton}>
        Ver detalle
      </Link>
      
      <div className={styles.actions}>
        <div className={styles.counter}>
          <button
            onClick={decrementar}
            className={styles.counterBtn}
            disabled={cantidad === 0}
          >
            -
          </button>
          <span className={styles.countText}>{cantidad}</span>
          <button onClick={incrementar} className={styles.counterBtn}>+</button>
        </div>
      </div>

    </article>
  );
};

export default Item;