import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import styles from './Opiniones.module.css';

const Opiniones = ({ productoId }) => {
  // Guarda las opiniones obtenidas y el estado de carga o error de la consulta.
  const [opiniones, setOpiniones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cada vez que cambia el producto, busca sus opiniones en Firestore.
  useEffect(() => {
    const fetchOpiniones = async () => {
      if (!productoId) return;
      setCargando(true);
      try {
        // Filtra la colección para traer únicamente las opiniones de este producto.
        const opinionesRef = collection(db, "opiniones");
        const q = query(opinionesRef, where("productoId", "==", productoId));
        const querySnapshot = await getDocs(q);

        // Convierte los documentos de Firestore en objetos e incluye su ID.
        const listaOpiniones = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setOpiniones(listaOpiniones);
      } catch (err) {
        console.error("Error al obtener opiniones:", err);
        setError("No se pudieron cargar las opiniones");
      } finally {
        // Finaliza el indicador de carga tanto si la consulta funciona como si falla.
        setCargando(false);
      }
    };

    fetchOpiniones();
  }, [productoId]);

  // Muestra estados especiales antes de renderizar la lista.
  if (cargando) return <div className={styles.cargando}>Cargando opiniones...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.opinionesContainer}>
      <h2 className={styles.titulo}>Opiniones de los clientes</h2>
      {opiniones.length === 0 ? (
        <p className={styles.sinOpiniones}>Aún no hay opiniones disponibles.</p>
      ) : (
        // Muestra únicamente las opiniones guardadas en Firebase.
        <ul className={styles.listaOpiniones}>
          {opiniones.map((op) => (
            <li key={op.id} className={styles.opinionCard}>
              <div className={styles.headerOpinion}>
                <strong className={styles.clienteNombre}>{op.clienteNombre || 'Anónimo'}</strong>
                <span className={styles.rating}>⭐ {op.rating} / 5</span>
              </div>
              <p className={styles.comentario}>{op.comentario}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Opiniones;