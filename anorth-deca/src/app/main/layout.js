export default function MainLayout({ children }) {
  return (
    <html style={{ height: "100%" }}>
      <body
        style={{
          margin: 0,
          backgroundColor: "var(--bg)",
        }}
      >
        {children}
      </body>
    </html>
  );
}