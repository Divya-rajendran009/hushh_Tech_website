const CookiePolicyPage = () => {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0b1020",
        color: "#ffffff",
        padding: "80px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          backgroundColor: "#111827",
          border: "1px solid #1f2937",
          borderRadius: "24px",
          padding: "48px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
        }}
      >
        <p
          style={{
            color: "#60a5fa",
            fontWeight: 700,
            letterSpacing: "1px",
            marginBottom: "12px",
          }}
        >
          LEGAL
        </p>

        <h1
          style={{
            fontSize: "48px",
            lineHeight: "1.1",
            marginBottom: "16px",
            fontWeight: 800,
          }}
        >
          Cookie Policy
        </h1>

        <p
          style={{
            color: "#9ca3af",
            marginBottom: "40px",
            fontSize: "16px",
          }}
        >
          Last updated: April 2026
        </p>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "26px", marginBottom: "12px" }}>
            What are cookies?
          </h2>
          <p style={{ color: "#d1d5db", lineHeight: "1.8" }}>
            Cookies are small text files stored on your device when you visit a
            website. They help websites remember preferences, improve
            performance, and provide a better browsing experience.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "26px", marginBottom: "12px" }}>
            How we use cookies
          </h2>
          <p style={{ color: "#d1d5db", lineHeight: "1.8" }}>
            Hushh may use cookies to improve website functionality, understand
            usage, remember preferences, support security, and enhance the
            overall user experience.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "26px", marginBottom: "12px" }}>
            Types of cookies we may use
          </h2>
          <ul style={{ color: "#d1d5db", lineHeight: "1.9", paddingLeft: "24px" }}>
            <li>Essential cookies required for core website functionality.</li>
            <li>Performance cookies that help understand website usage.</li>
            <li>Preference cookies that remember selected settings.</li>
            <li>Analytics cookies that help improve the website experience.</li>
          </ul>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "26px", marginBottom: "12px" }}>
            Managing cookies
          </h2>
          <p style={{ color: "#d1d5db", lineHeight: "1.8" }}>
            You can manage or disable cookies through your browser settings.
            Disabling certain cookies may affect parts of the website
            experience.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "26px", marginBottom: "12px" }}>
            Contact us
          </h2>
          <p style={{ color: "#d1d5db", lineHeight: "1.8" }}>
            If you have questions about this Cookie Policy, please contact the
            Hushh team through the official website contact channels.
          </p>
        </section>
      </div>
    </main>
  );
};

export default CookiePolicyPage;