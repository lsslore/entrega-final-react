import { useState, useEffect, useContext, createContext } from 'react';
import { useAuth } from './AuthContext';

// Creamos el contexto
export const CarritoContext = createContext();

// Custom Hook
export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
};

const CarritoUsuarioProvider = ({ children, userId }) => {
  const storageKey = `neon-tech-carrito-${userId || 'invitado'}`;
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem(storageKey);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(carrito));
  }, [carrito, storageKey]);

  const agregarACarrito = ({ producto, cantidad = 1 }) => {
    const itemEnCarrito = carrito.find(item => item.id === producto.id);

    if (itemEnCarrito) {
      const carritoActualizado = carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      );
      setCarrito(carritoActualizado);
    } else {
      setCarrito(carritoPrevio => [...carritoPrevio, { ...producto, cantidad }]);
    }
  };

  // Eliminamos el producto
  const eliminarDelCarrito = (id) => {
    setCarrito(carritoPrevio => carritoPrevio.filter(item => item.id !== id));
  };

  // Incrementar cantidad en 1
  const incrementarCantidad = (id) => {
    setCarrito(carritoPrevio =>
      carritoPrevio.map(item =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  // Decrementar cantidad en 1 (Si llega a 0, se elimina)
  const decrementarCantidad = (id) => {
    setCarrito(carritoPrevio =>
      carritoPrevio
        .map(item =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter(item => item.cantidad > 0)
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const itemsEnCarrito = () => {
    return carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);
  };

  const cobroTotal = () => {
    return carrito.reduce((acumulador, item) => acumulador + (item.precio * item.cantidad), 0);
  };

  return (
    <CarritoContext.Provider value={{ 
      carrito, 
      agregarACarrito, 
      eliminarDelCarrito,
      incrementarCantidad,
      decrementarCantidad,
      vaciarCarrito,
      itemsEnCarrito, 
      cobroTotal 
    }}>
      {children}
    </CarritoContext.Provider>
  );
};

// Cada cuenta usa una instancia distinta del estado y una clave propia de almacenamiento.
export const CarritoProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.uid || 'invitado';

  return (
    <CarritoUsuarioProvider key={userId} userId={userId}>
      {children}
    </CarritoUsuarioProvider>
  );
};