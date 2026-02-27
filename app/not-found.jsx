export default function NotFound() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "60px" }}>404</h1>
      <h2>Pagina non trovata</h2>
      <p>La pagina che stai cercando non esiste o è stata rimossa.</p>
      <a href="/" style={{ marginTop: "20px", color: "red" }}>
        Torna alla Home
      </a>
    </div>
  );
}