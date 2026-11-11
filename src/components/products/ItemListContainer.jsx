import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import ItemList from "./ItemList";
import estilos from "./ItemListContainer.module.css";

const ItemListContainer = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await getDocs(collection(db, "productos"));
        setProductos(respuesta.docs.map(documento => ({
          ...documento.data(),
          id: documento.id,
        })));
      } catch (err) {
        console.error("Error al obtener productos de Firestore:", err);
        setError("No se pudieron cargar los productos. Intenta nuevamente más tarde.");
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  if (cargando) 
    return <div className={estilos.statusMessage}>Cargando productos...</div>;
  

  if (error) 
    return <div className={estilos.statusMessage}>Error: {error}</div>;
  

  return (
    <section className={estilos.container}>
      <h1>Productos</h1>
      <ItemList productos={productos} />
    </section>
  );
};

export default ItemListContainer;