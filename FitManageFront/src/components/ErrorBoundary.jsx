import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <h2 style={styles.title}>Algo salió mal 😓</h2>
          <p style={styles.text}>Estamos trabajando para solucionarlo.</p>
          <button
            style={styles.button}
            onClick={() => window.location.reload()}
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  text: {
    fontSize: "1.2rem",
    marginBottom: "1.5rem",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#d9534f",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ErrorBoundary;
