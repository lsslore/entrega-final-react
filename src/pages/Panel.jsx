import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import FormProductContainer from '../components/products/FormProductoContainer';
import styles from './Panel.module.css';

const mostrarCategoria = (categoria) => {
  const categoriasVisibles = {
    computacion: 'Computación',
    audio: 'Audio',
  };

  return categoriasVisibles[categoria?.trim().toLowerCase()] ?? '-';
};

const Panel = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Carga inicial de productos desde Firestore
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosRef = collection(db, "productos");
        const resp = await getDocs(productosRef);
        setProductos(resp.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setErrorCarga("No se pudieron cargar los productos. Intenta nuevamente más tarde.");
      } finally {
        setCargando(false);
      }
    };

    fetchProductos();
  }, []);

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este producto?")) return;

    try {
      await deleteDoc(doc(db, "productos", id));
      setProductos(prev => prev.filter((prod) => prod.id !== id));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Hubo un error al intentar eliminar el producto.");
    }
  };

  const abrirModalAgregar = () => {
    setProductoAEditar(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (producto) => {
    setProductoAEditar(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setProductoAEditar(null);
    setModalAbierto(false);
  };

  const handleProductoGuardado = (productoGuardado, esEdicion) => {
    if (esEdicion) {
      setProductos(prev => prev.map(p => p.id === productoGuardado.id ? productoGuardado : p));
    } else {
      setProductos(prev => [...prev, productoGuardado]);
    }
    cerrarModal();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Administración</h2>

      {/* Navegación por pestañas */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.activeTab}`} type="button">
          Productos
        </button>
      </div>

      <section>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Listado de Productos</h3>
          <button className={styles.btnPrimary} onClick={abrirModalAgregar}>
            <span>+</span> Agregar Producto
          </button>
        </div>

        {cargando ? (
          <p className={styles.emptyText}>Cargando productos...</p>
        ) : errorCarga ? (
          <p className={styles.emptyText} role="alert">{errorCarga}</p>
        ) : productos.length === 0 ? (
          <p className={styles.emptyText}>No hay productos cargados todavía.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(prod => (
                  <tr key={prod.id}>
                    <td data-label="Imagen">
                      <img
                        src={prod.imagen || 'https://via.placeholder.com/50'}
                        alt={prod.nombre}
                        className={styles.productImg}
                      />
                    </td>
                    <td data-label="Nombre"><strong>{prod.nombre}</strong></td>
                    <td data-label="Categoría">{mostrarCategoria(prod.categoria)}</td>
                    <td data-label="Precio">${prod.precio}</td>
                    <td data-label="Acciones" className={styles.actionsCell}>
                      <button
                        className={styles.btnOutline}
                        onClick={() => abrirModalEditar(prod)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.btnDanger}
                        onClick={() => eliminarProducto(prod.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal para agregar o editar producto */}
      {modalAbierto && (
        <div className={styles.modalOverlay} onClick={cerrarModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.sectionTitle}>
                {productoAEditar ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h3>
              <button className={styles.btnClose} onClick={cerrarModal}>✕</button>
            </div>

            <FormProductContainer 
              productoAEditar={productoAEditar} 
              setProductoAEditar={setProductoAEditar}
              onProductoAgregado={(producto, esEdicion) => handleProductoGuardado(producto, esEdicion)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Panel;