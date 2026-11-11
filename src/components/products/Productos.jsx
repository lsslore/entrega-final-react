import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import Bienvenida from "../Bienvenida";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const productosRef = collection(db, "productos");
        const resp = await getDocs(productosRef);
        
        const listaProductos = resp.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));

        setProductos(listaProductos);
      } catch (error) {
        console.error("Error al obtener productos de Firestore:", error);
        setError("No se pudieron cargar los productos. Intenta nuevamente más tarde.");
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  return (
    <div>
      <Bienvenida />
      {cargando ? (
        <p>Cargando productos...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          <h1>Productos</h1>
          <div className="lista-productos">
            {productos.length === 0 ? (
              <p>No hay productos disponibles.</p>
            ) : (
              productos.map(prod => (
                <div key={prod.id}>
                  {prod.imagen && (
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      style={{ width: "100px" }}
                    />
                  )}
                  <h3>{prod.nombre}</h3>
                  <p>Categoría: {prod.categoria}</p>
                  <p>Precio: ${prod.precio}</p>
                  <p>Stock: {prod.stock} unidades</p>
                  <hr />
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Productos;
