import '../globals.css';


export default function SignupLayout({ children }) {
  return (
    <html style={{ height: "100%" }}>
      <body
        style={{
          margin: 0,
          height: "100%",
          backgroundColor: "var(--bg)",
          backgroundImage: "url('/images/coolbackgrounds-fractalize-clear_lagoon.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {children}
      </body>
    </html>
  );
}