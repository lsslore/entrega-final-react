import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import ItemList from '../components/products/ItemList';

const Categorias = () => {
  const { idCategoria } = useParams(); 
  const nombresCategorias = {
    computacion: "Computación",
    audio: "Audio",
  };
  const nombreCategoria =
    nombresCategorias[idCategoria?.toLowerCase()] ??
    (idCategoria
      ? idCategoria.charAt(0).toUpperCase() + idCategoria.slice(1)
      : "");
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setCargando(true);
        setError(null);
        
        // Obtenemos todos los productos
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filtramos en el cliente ignorando mayúsculas y minúsculas
        const productosFiltrados = docs.filter(
          prod => prod.categoria?.toLowerCase() === idCategoria?.toLowerCase()
        );

        setProductos(productosFiltrados);
      } catch (error) {
        console.error("Error al cargar los productos de la categoría:", error);
        setError("No se pudieron cargar los productos. Intenta nuevamente más tarde.");
      } finally {
        setCargando(false); 
      }
    };

    if (idCategoria) {
      fetchCategorias();
    }
  }, [idCategoria]);

  return (
    <div>
      <h1>{nombreCategoria}</h1>
      {cargando ? (
        <p>Cargando productos...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : productos.length === 0 ? (
        <p>No hay productos en esta categoría.</p>
      ) : (
        <ItemList productos={productos}/>
      )}
    </div>
  );
};

export default Categorias;