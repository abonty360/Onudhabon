import React from "react";

export default function Donation() {
  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #E0F2F1, #FFFFFF)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Arial, sans-serif",
      color: "#333",
    },
    header: {
      backgroundColor: "#00695C",
      color: "white",
      padding: "60px 20px",
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    headerTitle: {
      fontSize: "36px",
      margin: 0,
    },
    headerSubtitle: {
      marginTop: "10px",
      fontSize: "18px",
      opacity: 0.9,
    },
    main: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    card: {
      maxWidth: "650px",
      width: "100%",
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "40px 30px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      textAlign: "center",
    },
    cardTitle: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#00695C",
      marginBottom: "20px",
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#00695C",
      marginBottom: "10px",
      borderBottom: "2px solid #E0E0E0",
      display: "inline-block",
      paddingBottom: "5px",
    },
    cardText: {
      fontSize: "16px",
      color: "#555",
      marginBottom: "30px",
      lineHeight: "1.6",
    },
    contactRow: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "15px",
      gap: "10px",
    },
    contactLabel: {
      fontWeight: "500",
      color: "#555",
    },
    contactValue: {
      color: "#00695C",
      fontWeight: "600",
    },
    footer: {
      marginTop: "30px",
      fontSize: "14px",
      fontStyle: "italic",
      color: "#888",
    },
    section: {
      marginBottom: "30px",
    },
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Onudhabon</h1>
        <p style={styles.headerSubtitle}>Together we can make a difference</p>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Support Our Mission</h2>
          <p style={styles.cardText}>
            Your kindness helps us continue our journey. Every gesture of
            support matters, and we are deeply grateful for your help.
          </p>

          {}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>To Donate</h3>
            <div style={styles.contactRow}>
              <span style={styles.contactLabel}>bKash No:</span>
              <span style={styles.contactValue}>01739860673</span>
            </div>
            <div style={styles.contactRow}>
              <span style={styles.contactLabel}>Nagad No:</span>
              <span style={styles.contactValue}>01716961917</span>
            </div>
          </div>

          {}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Contact To Collaborate</h3>
            <div style={styles.contactRow}>
              <span style={styles.contactLabel}>Phone:</span>
              <span style={styles.contactValue}>+8801790043162</span>
            </div>
            <div style={styles.contactRow}>
              <span style={styles.contactLabel}>Email:</span>
              <span style={styles.contactValue}>onudhabon@gmail.com</span>
            </div>
          </div>

          <p style={styles.footer}>
            “Alone we can do so little, together we can do so much.” – Helen
            Keller
          </p>
        </div>
      </main>
    </div>
  );
}
