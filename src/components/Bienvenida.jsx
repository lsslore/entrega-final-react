import styles from "./Bienvenida.module.css";

const Bienvenida = () => (
  <section className={styles.welcome} aria-labelledby="welcome-title">
    <p className={styles.eyebrow}>TECNOLOGÍA PARA VOS</p>
    <h1 id="welcome-title" className={styles.title}>
      Bienvenidos a <span>Neon Tech</span>
    </h1>
    <p className={styles.subtitle}>
      Descubrí productos y accesorios para llevar tu experiencia al próximo nivel.
    </p>
  </section>
);

export default Bienvenida;
