import { useState, useEffect, useRef, useCallback } from "react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const GOLD_GLOW = "rgba(212,175,55,0.25)";

const THEMES = {
  dark: {
    bg: "#0D0D0D", bg2: "#111111", bg3: "#161616",
    text: "#EAEAEA", textMuted: "#888", textFaint: "#444",
    gold: "#D4AF37", goldDark: "#C9A227", goldRgb: "212,175,55",
    glass: "rgba(13,13,13,0.88)", glassBorder: "rgba(212,175,55,0.12)",
    cardBg: "rgba(20,20,20,0.95)", border: "rgba(255,255,255,0.07)",
    shadow: "0 8px 40px rgba(0,0,0,0.4)", navShadow: "0 2px 40px rgba(0,0,0,0.6)",
    inputBg: "rgba(255,255,255,0.04)",
  },
  light: {
    bg: "#F8F9FB", bg2: "#F0F1F3", bg3: "#FFFFFF",
    text: "#1A1A1A", textMuted: "#666", textFaint: "#aaa",
    gold: "#C9A227", goldDark: "#B08D16", goldRgb: "201,162,39",
    glass: "rgba(248,249,251,0.92)", glassBorder: "rgba(201,162,39,0.2)",
    cardBg: "#FFFFFF", border: "#E5E7EB",
    shadow: "0 4px 24px rgba(0,0,0,0.07)", navShadow: "0 2px 20px rgba(0,0,0,0.1)",
    inputBg: "#ffffff",
  },
};

const SERVICES = [
  { name: "Classic Haircut", icon: "✂", desc: "Precision cut tailored to your unique style and face shape.", tag: "POPULAR" },
  { name: "Beard Trim", icon: "🪒", desc: "Expert beard shaping and grooming for a polished look.", tag: "" },
  { name: "Haircut + Beard", icon: "💈", desc: "The complete grooming experience — cut and groom together.", tag: "BEST VALUE" },
  { name: "Fade", icon: "⚡", desc: "Sharp gradient fade with crisp lines for a modern silhouette.", tag: "" },
  { name: "Hair Styling", icon: "✨", desc: "Premium styling for special occasions or daily perfection.", tag: "" },
  { name: "Hot Towel Shave", icon: "🔥", desc: "Traditional straight razor shave with a hot towel treatment.", tag: "PREMIUM" },
];

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

// ---- GLOBAL STYLES ----
const GlobalStyles = ({ t, theme }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Mea+Culpa&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'DM Sans', sans-serif;
      background: ${t.bg};
      color: ${t.text};
      overflow-x: hidden;
      transition: background 0.45s ease, color 0.45s ease;
    }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: ${t.bg}; }
    ::-webkit-scrollbar-thumb { background: ${t.gold}; border-radius: 2px; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes spinSlowRev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(${t.goldRgb}, 0.5); }
      50% { box-shadow: 0 0 0 14px rgba(${t.goldRgb}, 0); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes slideDown {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); } to { transform: rotate(360deg); }
    }
    @keyframes menuSlide {
      from { opacity: 0; transform: translateY(-12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .gold-text {
      background: linear-gradient(135deg, #D4AF37 0%, #F5E17A 40%, #C9A227 70%, #D4AF37 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }
    .btn-gold {
      background: linear-gradient(135deg, #D4AF37, #C9A227);
      color: #0D0D0D;
      font-weight: 600;
      letter-spacing: 0.1em;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      border: none;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      text-transform: uppercase;
      font-size: 12px;
    }
    .btn-gold:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 35px rgba(212,175,55,0.45);
      background: linear-gradient(135deg, #E8C44A, #D4AF37);
    }
    .btn-gold:active { transform: translateY(0); }
    .btn-gold:disabled { opacity: 0.7; cursor: not-allowed; }
    input[type="date"]::-webkit-calendar-picker-indicator {
      filter: ${theme === "dark" ? "invert(1) sepia(1) saturate(2) hue-rotate(5deg)" : "none"};
      cursor: pointer; opacity: 0.7;
    }
    input, textarea { font-family: 'DM Sans', sans-serif; }
    a { text-decoration: none; }
    @media (max-width: 480px) {
      .hero-btns { flex-direction: column !important; align-items: stretch !important; }
      .hero-btns button { width: 100% !important; }
      .booking-name-grid { grid-template-columns: 1fr !important; }
      .admin-row { flex-direction: column !important; align-items: flex-start !important; }
      .admin-actions { width: 100% !important; justify-content: flex-start !important; }
    }
  `}</style>
);

// ---- NAVBAR ----
const Navbar = ({ t, theme, toggleTheme, currentPage, setCurrentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 768;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (currentPage !== "home") {
      setCurrentPage("home");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 120);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Services", id: "services" },
    { label: "Booking", id: "booking" },
    { label: "Contact", id: "contact" },
  ];

  const linkStyle = {
    background: "none", border: "none", cursor: "pointer",
    color: t.textMuted, fontSize: "12px", fontWeight: "500",
    letterSpacing: "0.12em", textTransform: "uppercase",
    fontFamily: "'DM Sans', sans-serif", transition: "color 0.3s ease", padding: "6px 0",
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled || menuOpen ? t.glass : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(24px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled || menuOpen ? "blur(24px) saturate(180%)" : "none",
        borderBottom: scrolled || menuOpen ? `1px solid ${t.glassBorder}` : "none",
        boxShadow: scrolled ? t.navShadow : "none",
        padding: isMobile ? "0 5%" : "0 6%",
        height: "70px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.5s ease",
        animation: "slideDown 0.7s ease",
      }}>
        <div onClick={() => { setCurrentPage("home"); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
              width: "39px", height: "39px", borderRadius: "50%",
              background: `linear-gradient(135deg, ${t.gold}, ${t.goldDark})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", fontWeight: "600", color: "#0D0D0D",
              fontFamily: "'Mea Culpa', cursive", flexShrink: 0,
              boxShadow: theme === "dark" ? `0 0 18px ${GOLD_GLOW}` : "none",
          }}>J</div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: "600", letterSpacing: "0.06em", color: t.text }}>Jayzzy</span>
        </div>
          

        {isMobile ? (
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <button onClick={toggleTheme} style={{
              width: "42px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
              background: theme === "dark" ? `linear-gradient(135deg, ${t.gold}, ${t.goldDark})` : t.border,
              position: "relative", transition: "all 0.4s ease", flexShrink: 0,
            }}>
              <div style={{
                position: "absolute", top: "3px",
                left: theme === "dark" ? "21px" : "3px",
                width: "18px", height: "18px", borderRadius: "50%",
                background: theme === "dark" ? "#0D0D0D" : t.gold,
                transition: "left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px",
              }}>{theme === "dark" ? "🌙" : "☀"}</div>
            </button>
            <button onClick={() => setMenuOpen(p => !p)} style={{
              background: "none", border: `1px solid ${t.glassBorder}`, cursor: "pointer",
              borderRadius: "8px", padding: "8px 10px",
              display: "flex", flexDirection: "column", gap: "5px",
              transition: "border-color 0.3s",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: "20px", height: "1.5px",
                  background: menuOpen && i === 1 ? "transparent" : t.gold,
                  borderRadius: "2px",
                  transition: "all 0.3s ease",
                  transform: menuOpen
                    ? i === 0 ? "rotate(45deg) translate(4.5px, 4.5px)"
                      : i === 2 ? "rotate(-45deg) translate(4.5px, -4.5px)"
                      : "none"
                    : "none",
                }} />
              ))}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {navLinks.map(({ label, id }) => (
              <button key={id} onClick={() => scrollTo(id)} style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = t.gold}
                onMouseLeave={e => e.currentTarget.style.color = t.textMuted}>{label}</button>
            ))}
            <button onClick={() => setCurrentPage(p => p === "admin" ? "home" : "admin")} style={linkStyle}
              onMouseEnter={e => e.currentTarget.style.color = t.gold}
              onMouseLeave={e => e.currentTarget.style.color = t.textMuted}>Admin</button>
            <button onClick={toggleTheme} style={{
              width: "46px", height: "26px", borderRadius: "13px", border: "none", cursor: "pointer",
              background: theme === "dark" ? `linear-gradient(135deg, ${t.gold}, ${t.goldDark})` : t.border,
              position: "relative", transition: "all 0.4s ease", flexShrink: 0,
              boxShadow: theme === "dark" ? `0 0 12px ${GOLD_GLOW}` : "none",
            }}>
              <div style={{
                position: "absolute", top: "4px",
                left: theme === "dark" ? "24px" : "4px",
                width: "18px", height: "18px", borderRadius: "50%",
                background: theme === "dark" ? "#0D0D0D" : t.gold,
                transition: "left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px",
              }}>{theme === "dark" ? "🌙" : "☀"}</div>
            </button>
            <button className="btn-gold" onClick={() => scrollTo("booking")} style={{ padding: "11px 22px", borderRadius: "5px" }}>Book Now</button>
          </div>
        )}
      </nav>

      {isMobile && menuOpen && (
        <div style={{
          position: "fixed", top: "70px", left: 0, right: 0, zIndex: 999,
          background: t.glass,
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: `1px solid ${t.glassBorder}`,
          padding: "16px 5% 24px",
          animation: "menuSlide 0.3s ease",
        }}>
          {navLinks.map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              display: "block", width: "100%", textAlign: "left",
              background: "none", border: "none", cursor: "pointer",
              color: t.textMuted, fontSize: "14px", fontWeight: "500",
              letterSpacing: "0.12em", textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif", padding: "14px 0",
              borderBottom: `1px solid ${t.border}`,
              transition: "color 0.3s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = t.gold}
            onMouseLeave={e => e.currentTarget.style.color = t.textMuted}
            >{label}</button>
          ))}
          <button onClick={() => { setCurrentPage(p => p === "admin" ? "home" : "admin"); setMenuOpen(false); }} style={{
            display: "block", width: "100%", textAlign: "left",
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: "14px", fontWeight: "500",
            letterSpacing: "0.12em", textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif", padding: "14px 0",
            borderBottom: `1px solid ${t.border}`, transition: "color 0.3s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = t.gold}
          onMouseLeave={e => e.currentTarget.style.color = t.textMuted}
          >Admin</button>
          <button className="btn-gold" onClick={() => scrollTo("booking")} style={{ width: "100%", padding: "16px", borderRadius: "8px", marginTop: "16px", fontSize: "12px" }}>
            Book Appointment
          </button>
        </div>
      )}
    </>
  );
};

// ---- HERO ----
const Hero = ({ t, theme, scrollTo }) => {
  const canvasRef = useRef(null);
  const w = useWindowWidth();
  const isMobile = w < 640;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: isMobile ? 40 : 70 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3, vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.05), a: Math.random() * 0.45 + 0.08,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -8) { p.y = canvas.height + 8; p.x = Math.random() * canvas.width; }
        if (p.x < -8) p.x = canvas.width + 8;
        if (p.x > canvas.width + 8) p.x = -8;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${t.goldRgb},${p.a})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [t.goldRgb, isMobile]);

  return (
    <section style={{
      position: "relative", height: "100svh", minHeight: "600px",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      background: theme === "dark"
        ? `radial-gradient(ellipse at 25% 60%, rgba(${t.goldRgb},0.055) 0%, transparent 55%), radial-gradient(ellipse at 75% 40%, rgba(${t.goldRgb},0.035) 0%, transparent 55%), #0D0D0D`
        : `radial-gradient(ellipse at 25% 60%, rgba(${t.goldRgb},0.07) 0%, transparent 55%), radial-gradient(ellipse at 75% 40%, rgba(${t.goldRgb},0.04) 0%, transparent 55%), #F8F9FB`,
    }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      {!isMobile && <>
        <div style={{ position: "absolute", width: "min(700px, 90vw)", height: "min(700px, 90vw)", borderRadius: "50%", border: `1px solid rgba(${t.goldRgb},0.05)`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "spinSlow 35s linear infinite" }} />
        <div style={{ position: "absolute", width: "min(1050px, 130vw)", height: "min(1050px, 130vw)", borderRadius: "50%", border: `1px solid rgba(${t.goldRgb},0.025)`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "spinSlowRev 55s linear infinite" }} />
      </>}

      <div style={{ position: "relative", textAlign: "center", padding: isMobile ? "0 24px" : "0 40px", maxWidth: "820px", width: "100%" }}>
        <div style={{ opacity: 0, animation: "fadeUp 0.7s ease 0.2s forwards" }}>
          <span style={{ color: t.gold, fontSize: isMobile ? "9px" : "11px", letterSpacing: isMobile ? "0.2em" : "0.35em", textTransform: "uppercase", fontWeight: "500" }}>
            ✦&nbsp;&nbsp;Premium Barbershop Experience&nbsp;&nbsp;✦
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isMobile ? "clamp(58px, 18vw, 80px)" : "clamp(62px, 11vw, 120px)",
          fontWeight: "700", lineHeight: "0.92", letterSpacing: "-0.025em",
          color: t.text, marginTop: "16px",
          opacity: 0, animation: "fadeUp 0.9s ease 0.38s forwards",
        }}>Jayzzy</h1>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isMobile ? "clamp(16px, 5vw, 22px)" : "clamp(18px, 3.5vw, 30px)",
          fontWeight: "300", fontStyle: "italic", color: t.gold, letterSpacing: "0.1em",
          marginTop: "6px", opacity: 0, animation: "fadeUp 0.8s ease 0.54s forwards",
        }}>Where Style Meets Craft</p>
        <p style={{
          color: t.textMuted, fontSize: isMobile ? "14px" : "16px",
          lineHeight: "1.85", fontWeight: "300",
          maxWidth: isMobile ? "320px" : "460px", margin: "20px auto 0",
          opacity: 0, animation: "fadeUp 0.8s ease 0.7s forwards",
        }}>
          Step into a realm of refined grooming. Every visit is a tailored experience crafted for the modern gentleman.
        </p>
        <div className="hero-btns" style={{
          display: "flex", gap: "12px", justifyContent: "center",
          marginTop: isMobile ? "32px" : "44px", flexWrap: "wrap",
          opacity: 0, animation: "fadeUp 0.8s ease 0.86s forwards",
          padding: isMobile ? "0 10px" : "0",
        }}>
          <button className="btn-gold" onClick={() => scrollTo("booking")} style={{
            padding: isMobile ? "15px 32px" : "16px 42px", borderRadius: "5px", fontSize: "12px",
            animation: "pulse 3.5s ease-in-out 1.8s infinite",
            flex: isMobile ? "1 1 auto" : "0 0 auto", minWidth: isMobile ? "0" : "auto",
          }}>Book Appointment</button>
          <button onClick={() => scrollTo("services")} style={{
            padding: isMobile ? "15px 32px" : "16px 42px", borderRadius: "5px", fontSize: "12px",
            background: "transparent", border: `1px solid ${t.glassBorder}`,
            color: t.text, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            fontWeight: "500", letterSpacing: "0.1em", textTransform: "uppercase",
            transition: "all 0.3s ease",
            flex: isMobile ? "1 1 auto" : "0 0 auto",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = t.gold; e.currentTarget.style.color = t.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = t.glassBorder; e.currentTarget.style.color = t.text; }}>Our Services</button>
        </div>
        {!isMobile && (
          <div style={{ position: "absolute", bottom: "-130px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0, animation: "fadeIn 1s ease 1.6s forwards" }}>
            <div style={{ width: "1px", height: "55px", background: `linear-gradient(to bottom, transparent, ${t.gold})` }} />
            <span style={{ color: t.textFaint, fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase" }}>Scroll</span>
          </div>
        )}
      </div>
    </section>
  );
};

// ---- SERVICE CARD ----
const ServiceCard = ({ service, t, theme, index, isMobile }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 80 + 100);
    return () => clearTimeout(timer);
  }, [index]);

  const onMouseMove = useCallback((e) => {
    if (isMobile) return;
    const card = ref.current; if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.04) translateZ(10px)`;
    card.style.boxShadow = theme === "dark" ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(${t.goldRgb},0.15)` : `0 20px 50px rgba(0,0,0,0.14)`;
  }, [theme, t.goldRgb, isMobile]);

  const onMouseLeave = useCallback(() => {
    const card = ref.current; if (!card) return;
    card.style.transform = "perspective(900px) rotateY(0) rotateX(0) scale(1) translateZ(0)";
    card.style.boxShadow = t.shadow;
  }, [t.shadow]);

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{
      background: t.cardBg, border: `1px solid ${t.border}`,
      borderRadius: "14px", padding: isMobile ? "28px 22px" : "38px 30px",
      cursor: "default", position: "relative", overflow: "hidden", boxShadow: t.shadow,
      opacity: visible ? 1 : 0,
      transform: visible ? "perspective(900px) rotateY(0) rotateX(0) scale(1)" : "perspective(900px) translateY(18px)",
      transition: `opacity 0.55s ease, transform ${visible ? "0.15s" : "0.55s"} ease, box-shadow 0.3s ease`,
      transformStyle: "preserve-3d",
    }}>
      <div style={{ position: "absolute", top: 0, left: "22px", right: "22px", height: "1px", background: `linear-gradient(90deg, transparent, rgba(${t.goldRgb},0.5), transparent)` }} />
      {service.tag && <div style={{ position: "absolute", top: "14px", right: "14px", background: `linear-gradient(135deg, ${t.gold}, ${t.goldDark})`, color: "#0D0D0D", fontSize: "8px", fontWeight: "700", letterSpacing: "0.15em", padding: "4px 8px", borderRadius: "3px", textTransform: "uppercase" }}>{service.tag}</div>}
      <div style={{ fontSize: isMobile ? "26px" : "30px", marginBottom: "14px" }}>{service.icon}</div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "20px" : "22px", fontWeight: "600", color: t.text, letterSpacing: "0.02em", marginBottom: "10px" }}>{service.name}</h3>
      <p style={{ color: t.textMuted, fontSize: "14px", lineHeight: "1.75", fontWeight: "300" }}>{service.desc}</p>
    </div>
  );
};

// ---- SERVICES ----
const Services = ({ t, theme }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="services" ref={ref} style={{ padding: isMobile ? "80px 5%" : "120px 6%", background: t.bg2 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "48px" : "72px", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(28px)", transition: "all 0.8s ease" }}>
          <span style={{ color: t.gold, fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: "500" }}>✦&nbsp;&nbsp;What We Offer&nbsp;&nbsp;✦</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "clamp(30px, 9vw, 42px)" : "clamp(36px, 5vw, 56px)", fontWeight: "700", color: t.text, letterSpacing: "-0.02em", lineHeight: "1.1", marginTop: "14px" }}>Our <span className="gold-text">Services</span></h2>
          <p style={{ color: t.textMuted, fontSize: "15px", marginTop: "14px", fontWeight: "300" }}>Crafted with precision. Delivered with care.</p>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: isMobile ? "14px" : "22px",
        }}>
          {SERVICES.map((s, i) => <ServiceCard key={s.name} service={s} t={t} theme={theme} index={i} isMobile={isMobile} />)}
        </div>
      </div>
    </section>
  );
};

// ---- BOOKING ----
const Booking = ({ t, theme }) => {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", notes: "" });
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 640;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.06 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const handleDateChange = async (e) => {
    const val = e.target.value;
    const d = new Date(val + "T00:00:00");
    if (d.getDay() === 1) {
      setErrors(p => ({ ...p, date: "We are closed on Mondays — please choose another day." }));
      setDate(""); setSlots([]); return;
    }
    setErrors(p => ({ ...p, date: "" }));
    setDate(val); setSelectedTime(""); setSlotsLoading(true);
    try {
      const res = await fetch(`${API}/slots/?date=${val}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch { setSlots([]); }
    finally { setSlotsLoading(false); }
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.phone.trim() || !/^\+?[\d\s\-()\\.]{7,}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    if (!date) e.date = "Please select a date";
    if (!selectedTime) e.time = "Please select a time slot";
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitStatus("loading"); setSubmitError("");
    try {
      const res = await fetch(`${API}/reservations/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: form.firstName, last_name: form.lastName, phone: form.phone, notes: form.notes, date, time: selectedTime }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.time?.[0] || data.date?.[0] || data.non_field_errors?.[0] || "Something went wrong. Please try again.");
        setSubmitStatus(""); return;
      }
      setSubmitStatus("success");
      setForm({ firstName: "", lastName: "", phone: "", notes: "" });
      setDate(""); setSelectedTime(""); setSlots([]);
      setTimeout(() => setSubmitStatus(""), 6000);
    } catch {
      setSubmitError("Could not reach the server. Make sure the backend is running.");
      setSubmitStatus("");
    }
  };

  const iStyle = (field) => ({
    width: "100%", padding: isMobile ? "13px 14px" : "14px 16px", background: t.inputBg,
    border: `1px solid ${errors[field] ? "#EF4444" : t.border}`,
    borderRadius: "9px", color: t.text, fontSize: "14px",
    outline: "none", fontFamily: "'DM Sans', sans-serif",
    transition: "border 0.25s ease, box-shadow 0.25s ease",
  });

  const focusInput = (e) => { e.target.style.borderColor = t.gold; e.target.style.boxShadow = `0 0 0 3px ${GOLD_GLOW}`; };
  const blurInput = (e, field) => { e.target.style.borderColor = errors[field] ? "#EF4444" : t.border; e.target.style.boxShadow = "none"; };

  return (
    <section id="booking" ref={ref} style={{ padding: isMobile ? "80px 5%" : "120px 6%", background: t.bg }}>
      <div style={{ maxWidth: "740px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "40px" : "60px", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(28px)", transition: "all 0.8s ease" }}>
          <span style={{ color: t.gold, fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: "500" }}>✦&nbsp;&nbsp;Reserve Your Seat&nbsp;&nbsp;✦</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "clamp(30px, 9vw, 42px)" : "clamp(36px, 5vw, 56px)", fontWeight: "700", color: t.text, letterSpacing: "-0.02em", marginTop: "14px" }}>Book an <span className="gold-text">Appointment</span></h2>
          <p style={{ color: t.textMuted, fontSize: "14px", marginTop: "12px", fontWeight: "300" }}>Closed on Mondays. Slots fill quickly — book ahead.</p>
        </div>

        {submitStatus === "success" ? (
          <div style={{ background: theme === "dark" ? "rgba(212,175,55,0.06)" : "rgba(212,175,55,0.08)", border: `1px solid rgba(212,175,55,0.28)`, borderRadius: "16px", padding: isMobile ? "48px 24px" : "64px 40px", textAlign: "center", animation: "fadeIn 0.5s ease" }}>
            <div style={{ fontSize: "40px", marginBottom: "18px" }}>✦</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "26px" : "34px", color: t.gold, marginBottom: "12px" }}>Appointment Requested!</h3>
            <p style={{ color: t.textMuted, fontSize: "14px", lineHeight: "1.85", maxWidth: "340px", margin: "0 auto" }}>Your reservation is pending confirmation. We'll reach out to confirm your slot shortly.</p>
          </div>
        ) : (
          <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: "18px", padding: isMobile ? "24px 20px" : "clamp(28px, 5%, 50px)", boxShadow: t.shadow, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(22px)", transition: "all 0.9s ease 0.2s" }}>

            <div className="booking-name-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              {[["firstName", "First Name"], ["lastName", "Last Name"]].map(([field, label]) => (
                <div key={field}>
                  <label style={{ display: "block", color: t.textMuted, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "7px", fontWeight: "500" }}>{label}</label>
                  <input value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} style={iStyle(field)} placeholder={label} onFocus={focusInput} onBlur={e => blurInput(e, field)} />
                  {errors[field] && <span style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors[field]}</span>}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", color: t.textMuted, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "7px", fontWeight: "500" }}>Phone Number</label>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={iStyle("phone")} placeholder="+216 50 415 665" onFocus={focusInput} onBlur={e => blurInput(e, "phone")} />
              {errors.phone && <span style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.phone}</span>}
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", color: t.textMuted, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "7px", fontWeight: "500" }}>Select Date</label>
              <input type="date" value={date} min={today} onChange={handleDateChange} style={{ ...iStyle("date"), colorScheme: theme === "dark" ? "dark" : "light" }} onFocus={focusInput} onBlur={e => blurInput(e, "date")} />
              {errors.date && <span style={{ color: "#EF4444", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.date}</span>}
            </div>

            {date && (
              <div style={{ marginBottom: "14px", animation: "fadeUp 0.4s ease" }}>
                <label style={{ display: "block", color: t.textMuted, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px", fontWeight: "500" }}>Available Times</label>
                {slotsLoading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: t.textMuted, fontSize: "14px", padding: "14px 0" }}>
                    <span style={{ width: "14px", height: "14px", border: `2px solid ${t.border}`, borderTopColor: t.gold, borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                    Loading available slots...
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(auto-fill, minmax(88px, 1fr))", gap: "8px" }}>
                    {slots.map(({ time, available }) => (
                      <button key={time} disabled={!available} onClick={() => setSelectedTime(time)} style={{
                        padding: isMobile ? "11px 4px" : "12px 6px", borderRadius: "9px",
                        fontSize: isMobile ? "12px" : "13px",
                        fontFamily: "'DM Sans', sans-serif", fontWeight: "500",
                        cursor: !available ? "not-allowed" : "pointer",
                        border: `1px solid ${selectedTime === time ? t.gold : t.border}`,
                        background: !available ? (theme === "dark" ? "rgba(255,255,255,0.02)" : "#f7f7f7") : selectedTime === time ? `linear-gradient(135deg, ${t.gold}, ${t.goldDark})` : t.inputBg,
                        color: !available ? t.textFaint : selectedTime === time ? "#0D0D0D" : t.text,
                        opacity: !available ? 0.38 : 1,
                        textDecoration: !available ? "line-through" : "none",
                        boxShadow: selectedTime === time ? `0 4px 18px ${GOLD_GLOW}` : "none",
                        transition: "all 0.2s ease",
                      }}>{time}</button>
                    ))}
                  </div>
                )}
                {errors.time && <span style={{ color: "#EF4444", fontSize: "12px", marginTop: "6px", display: "block" }}>{errors.time}</span>}
              </div>
            )}

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: t.textMuted, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "7px", fontWeight: "500" }}>
                Notes <span style={{ textTransform: "none", letterSpacing: 0, fontSize: "11px", color: t.textFaint }}>(optional)</span>
              </label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Any special requests..." style={{ ...iStyle("notes"), resize: "vertical", minHeight: "78px", lineHeight: "1.65" }} onFocus={focusInput} onBlur={e => blurInput(e, "notes")} />
            </div>

            {submitError && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "9px", padding: "13px 15px", marginBottom: "14px", color: "#EF4444", fontSize: "13px" }}>{submitError}</div>
            )}

            <button className="btn-gold" onClick={handleSubmit} disabled={submitStatus === "loading"} style={{ width: "100%", padding: isMobile ? "16px" : "18px", borderRadius: "9px", fontSize: "12px" }}>
              {submitStatus === "loading" ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <span style={{ width: "14px", height: "14px", border: "2px solid rgba(0,0,0,0.25)", borderTopColor: "#0D0D0D", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Processing...
                </span>
              ) : "Confirm Reservation"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// ---- CONTACT ----
const Contact = ({ t, theme }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 640;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const cards = [
    { icon: "📍", title: "Location", a: "Sidi Daoued", b: "Tunis, Tunisia" },
    { icon: "📞", title: "Phone", a: "+216 50 415 665", b: "Tue–Sun: 9:00 AM – 10:00 PM" },
    { icon: "✉", title: "Email", a: "Jasserhammdi7@gmail.com", b: "We reply within 24 hours" },
  ];

  return (
    <section id="contact" ref={ref} style={{ padding: isMobile ? "80px 5%" : "120px 6%", background: t.bg2 }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? "48px" : "64px", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(28px)", transition: "all 0.8s ease" }}>
          <span style={{ color: t.gold, fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: "500" }}>✦&nbsp;&nbsp;Find Us&nbsp;&nbsp;✦</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "clamp(30px, 9vw, 42px)" : "clamp(36px, 5vw, 56px)", fontWeight: "700", color: t.text, letterSpacing: "-0.02em", marginTop: "14px" }}>Get In <span className="gold-text">Touch</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? "14px" : "22px", marginBottom: "28px" }}>
          {cards.map((c, i) => (
            <div key={c.title} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: "14px", padding: isMobile ? "26px 22px" : "34px 28px", boxShadow: t.shadow, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(22px)", transition: `all 0.65s ease ${i * 0.12 + 0.15}s` }}
              onMouseEnter={e => { if (!isMobile) { e.currentTarget.style.borderColor = t.glassBorder; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = theme === "dark" ? `0 16px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(${t.goldRgb},0.1)` : "0 12px 40px rgba(0,0,0,0.1)"; }}}
              onMouseLeave={e => { if (!isMobile) { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = t.shadow; }}}>
              <div style={{ fontSize: "24px", marginBottom: "14px" }}>{c.icon}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "19px", fontWeight: "600", color: t.text, marginBottom: "8px" }}>{c.title}</h3>
              <p style={{ color: t.gold, fontSize: "14px", marginBottom: "4px", fontWeight: "500" }}>{c.a}</p>
              <p style={{ color: t.textMuted, fontSize: "13px", fontWeight: "300" }}>{c.b}</p>
            </div>
          ))}
        </div>
        <div style={{ borderRadius: "16px", overflow: "hidden", border: `1px solid ${t.border}`, height: isMobile ? "200px" : "260px", background: theme === "dark" ? "#161616" : "#e8eaed", display: "flex", alignItems: "center", justifyContent: "center", opacity: visible ? 1 : 0, transition: "opacity 0.9s ease 0.5s" }}>
          <div style={{ textAlign: "center", padding: "0 20px" }}>
            <div style={{ fontSize: "34px", marginBottom: "12px" }}>🗺</div>
            <p style={{ color: t.textMuted, fontSize: "14px", fontWeight: "300" }}>Sidi Daoued, Tunis</p>
            <a href="https://maps.app.goo.gl/vC97G9Q4u4qDckpe9" target="_blank" rel="noopener noreferrer" style={{ color: t.gold, fontSize: "12px", marginTop: "10px", display: "inline-block", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "500", transition: "opacity 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>Open in Maps →</a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---- ADMIN ----
const Admin = ({ t, theme }) => {
  const [authed, setAuthed] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [filter, setFilter] = useState("all");
  const [shake, setShake] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const w = useWindowWidth();
  const isMobile = w < 640;

  const fetchReservations = async (password) => {
    setLoading(true); setFetchError("");
    try {
      const res = await fetch(`${API}/reservations/`, { headers: { "X-Admin-Password": password } });
      if (!res.ok) { setFetchError("Failed to load reservations."); return; }
      setReservations(await res.json());
    } catch { setFetchError("Could not reach the server."); }
    finally { setLoading(false); }
  };

  const login = async () => {
    setPwdErr("");
    try {
      const res = await fetch(`${API}/admin/login/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pwd }) });
      if (res.ok) { setAuthed(true); setAdminPassword(pwd); fetchReservations(pwd); }
      else { setPwdErr("Incorrect password. Try again."); setPwd(""); setShake(true); setTimeout(() => setShake(false), 500); }
    } catch { setPwdErr("Could not reach the server. Is the backend running?"); setShake(true); setTimeout(() => setShake(false), 500); }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API}/reservations/${id}/status/`, { method: "PATCH", headers: { "Content-Type": "application/json", "X-Admin-Password": adminPassword }, body: JSON.stringify({ status: newStatus }) });
      if (res.ok) { const updated = await res.json(); setReservations(p => p.map(r => r.id === id ? updated : r)); }
    } catch { alert("Failed to update. Check your connection."); }
  };

  const filtered = filter === "all" ? reservations : reservations.filter(r => r.status === filter);

  const BADGE = {
    pending: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B", label: "Pending" },
    accepted: { bg: "rgba(52,211,153,0.12)", color: "#34D399", label: "Accepted" },
    rejected: { bg: "rgba(239,68,68,0.12)", color: "#EF4444", label: "Rejected" },
  };

  if (!authed) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: t.bg, padding: "20px" }}>
      <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: "18px", padding: isMobile ? "36px 24px" : "50px 44px", width: "100%", maxWidth: "400px", boxShadow: t.shadow, textAlign: "center", animation: "fadeUp 0.5s ease", transform: shake ? "translateX(-6px)" : "none", transition: "transform 0.1s ease" }}>
        <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: `linear-gradient(135deg, ${t.gold}, ${t.goldDark})`, margin: "0 auto 22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", boxShadow: theme === "dark" ? `0 0 20px ${GOLD_GLOW}` : "none" }}>🔐</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", color: t.text, marginBottom: "8px" }}>Admin Access</h2>
        <p style={{ color: t.textMuted, fontSize: "14px", marginBottom: "28px", fontWeight: "300" }}>Enter your barber password to continue</p>
        <input type="password" value={pwd} onChange={e => { setPwd(e.target.value); setPwdErr(""); }} onKeyDown={e => e.key === "Enter" && login()} placeholder="Password"
          style={{ width: "100%", padding: "14px 16px", background: t.inputBg, border: `1px solid ${pwdErr ? "#EF4444" : t.border}`, borderRadius: "9px", color: t.text, fontSize: "15px", outline: "none", fontFamily: "'DM Sans', sans-serif", transition: "border 0.25s, box-shadow 0.25s", marginBottom: "6px" }}
          onFocus={e => { e.target.style.borderColor = t.gold; e.target.style.boxShadow = `0 0 0 3px ${GOLD_GLOW}`; }}
          onBlur={e => { e.target.style.borderColor = pwdErr ? "#EF4444" : t.border; e.target.style.boxShadow = "none"; }}
        />
        {pwdErr && <p style={{ color: "#EF4444", fontSize: "13px", marginBottom: "12px", textAlign: "left" }}>{pwdErr}</p>}
        <button className="btn-gold" onClick={login} style={{ width: "100%", padding: "16px", borderRadius: "9px", marginTop: "8px" }}>Access Dashboard</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: t.bg, padding: isMobile ? "90px 5% 60px" : "100px 6% 80px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", marginBottom: "36px", flexWrap: "wrap", gap: "16px", borderBottom: `1px solid ${t.border}`, paddingBottom: "28px" }}>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "36px" : "46px", color: t.text, fontWeight: "700", lineHeight: 1 }}><span className="gold-text">Dashboard</span></h1>
            <p style={{ color: t.textMuted, fontSize: "13px", marginTop: "8px", fontWeight: "300" }}>
              {reservations.length} total · <span style={{ color: "#F59E0B" }}>{reservations.filter(r => r.status === "pending").length} pending</span>
            </p>
          </div>
          <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", alignItems: "center" }}>
            {["all", "pending", "accepted", "rejected"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: isMobile ? "8px 13px" : "9px 18px", borderRadius: "7px",
                fontSize: "10px", fontFamily: "'DM Sans', sans-serif", fontWeight: "600",
                letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
                border: `1px solid ${filter === f ? t.gold : t.border}`,
                background: filter === f ? `linear-gradient(135deg, ${t.gold}, ${t.goldDark})` : "transparent",
                color: filter === f ? "#0D0D0D" : t.textMuted, transition: "all 0.25s ease",
              }}>{f}</button>
            ))}
            <button onClick={() => fetchReservations(adminPassword)} style={{ padding: "9px 12px", borderRadius: "7px", fontSize: "14px", border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.gold; e.currentTarget.style.color = t.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}
              title="Refresh">↻</button>
          </div>
        </div>

        {fetchError && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "9px", padding: "13px 16px", color: "#EF4444", fontSize: "13px", marginBottom: "20px" }}>{fetchError}</div>}

        {loading ? (
          <div style={{ textAlign: "center", padding: "70px 20px", color: t.textMuted }}>
            <span style={{ width: "22px", height: "22px", border: `2px solid ${t.border}`, borderTopColor: t.gold, borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
            <p style={{ marginTop: "14px", fontSize: "14px", fontWeight: "300" }}>Loading reservations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "70px 20px", background: t.cardBg, borderRadius: "18px", border: `1px solid ${t.border}`, animation: "fadeIn 0.4s ease" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📋</div>
            <p style={{ color: t.textMuted, fontSize: "15px", fontWeight: "300" }}>No {filter !== "all" ? filter : ""} reservations yet</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map((r, i) => (
              <div key={r.id} className="admin-row" style={{
                background: t.cardBg, border: `1px solid ${t.border}`,
                borderRadius: "13px", padding: isMobile ? "18px 16px" : "22px 28px",
                display: "flex", alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "space-between", flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "14px" : "14px", boxShadow: t.shadow,
                animation: `fadeUp 0.4s ease ${i * 0.04}s both`,
                transition: "border 0.3s, transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { if (!isMobile) { e.currentTarget.style.borderColor = t.glassBorder; e.currentTarget.style.transform = "translateY(-1px)"; }}}
              onMouseLeave={e => { if (!isMobile) { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "none"; }}}>

                <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", flex: 1, minWidth: 0 }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, rgba(${t.goldRgb},0.12), rgba(${t.goldRgb},0.22))`, border: `1px solid rgba(${t.goldRgb},0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: "600", color: t.gold }}>
                    {r.first_name[0]}{r.last_name[0]}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: "600", color: t.text, fontSize: "14px" }}>{r.first_name} {r.last_name}</p>
                    <p style={{ color: t.textMuted, fontSize: "12px", marginTop: "2px", fontWeight: "300" }}>{r.phone}</p>
                  </div>
                  <div style={{ display: "flex", gap: isMobile ? "12px" : "16px", flexWrap: "wrap" }}>
                    <span style={{ color: t.textMuted, fontSize: "12px" }}>📅 {r.date}</span>
                    <span style={{ color: t.textMuted, fontSize: "12px" }}>🕐 {r.time}</span>
                    {r.notes && !isMobile && <span style={{ color: t.textFaint, fontSize: "12px", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📝 {r.notes}</span>}
                  </div>
                  {r.notes && isMobile && <p style={{ color: t.textFaint, fontSize: "12px", width: "100%" }}>📝 {r.notes}</p>}
                </div>

                <div className="admin-actions" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", flexShrink: 0 }}>
                  <span style={{ padding: "4px 11px", borderRadius: "20px", fontSize: "10px", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", background: BADGE[r.status].bg, color: BADGE[r.status].color }}>{BADGE[r.status].label}</span>
                  {r.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(r.id, "accepted")} style={{ padding: isMobile ? "9px 16px" : "8px 16px", borderRadius: "7px", border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)", color: "#34D399", cursor: "pointer", fontSize: "13px", fontWeight: "500", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.18)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(52,211,153,0.08)"; }}>✓ Accept</button>
                      <button onClick={() => updateStatus(r.id, "rejected")} style={{ padding: isMobile ? "9px 16px" : "8px 16px", borderRadius: "7px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#EF4444", cursor: "pointer", fontSize: "13px", fontWeight: "500", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}>✕ Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ---- FOOTER ----
const Footer = ({ t, theme, scrollTo }) => {
  const w = useWindowWidth();
  const isMobile = w < 640;

  return (
    <footer style={{ background: theme === "dark" ? "#080808" : "#181818", padding: isMobile ? "56px 5% 32px" : "70px 6% 36px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: isMobile ? "36px" : "48px", marginBottom: isMobile ? "40px" : "56px" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "280px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ width: "39px", height: "39px", borderRadius: "50%", background: `linear-gradient(135deg, #D4AF37, #C9A227)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "600", color: "#0D0D0D", fontFamily: "'Mea Culpa', cursive" }}>J</div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "21px", fontWeight: "600", color: "#EAEAEA", letterSpacing: "0.05em" }}>Jayzzy</span>
            </div>
            <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.8", fontWeight: "300" }}>Premium barbershop experience for the modern gentleman. Precision cuts, refined grooming.</p>
          </div>

          <div style={{ display: "flex", gap: isMobile ? "40px" : "60px", flexWrap: "wrap" }}>
            <div>
              <h4 style={{ color: "#C9A227", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "18px", fontWeight: "600" }}>Navigate</h4>
              {["services", "booking", "contact"].map(id => (
                <button key={id} onClick={() => scrollTo(id)} style={{ display: "block", background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: "14px", textTransform: "capitalize", marginBottom: "11px", fontFamily: "'DM Sans', sans-serif", transition: "color 0.3s", padding: 0, textAlign: "left", fontWeight: "300" }}
                  onMouseEnter={e => e.target.style.color = "#C9A227"}
                  onMouseLeave={e => e.target.style.color = "#555"}>{id}</button>
              ))}
            </div>
            <div>
              <h4 style={{ color: "#C9A227", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "18px", fontWeight: "600" }}>Hours</h4>
              {[["Tue – Fri", "9AM – 10PM"], ["Saturday", "9AM – 10PM"], ["Sunday", "9AM – 10PM"], ["Monday", "Closed"]].map(([d, h]) => (
                <div key={d} style={{ marginBottom: "9px", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#555", fontSize: "13px", minWidth: isMobile ? "70px" : "80px", fontWeight: "300" }}>{d}</span>
                  <span style={{ color: d === "Monday" ? "#EF4444" : "#777", fontSize: "13px", fontWeight: "300" }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px", display: "flex", justifyContent: isMobile ? "center" : "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", textAlign: isMobile ? "center" : "left" }}>
          <p style={{ fontSize: "12px", color: "#444", fontWeight: "300" }}>© {new Date().getFullYear()} Jayzzy Barbershop. All rights reserved.</p>
          {!isMobile && <p style={{ fontSize: "12px", color: "#444", fontWeight: "300" }}>Crafted with precision ✦</p>}
        </div>
      </div>
    </footer>
  );
};

// ---- APP ----
export default function App() {
  const [theme, setTheme] = useState("dark");
  const [currentPage, setCurrentPage] = useState("home");
  const t = THEMES[theme];
  const toggleTheme = () => setTheme(p => p === "dark" ? "light" : "dark");
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <GlobalStyles t={t} theme={theme} />
      <Navbar t={t} theme={theme} toggleTheme={toggleTheme} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === "home" ? (
        <main>
          <Hero t={t} theme={theme} scrollTo={scrollTo} />
          <Services t={t} theme={theme} />
          <Booking t={t} theme={theme} />
          <Contact t={t} theme={theme} />
          <Footer t={t} theme={theme} scrollTo={scrollTo} />
        </main>
      ) : (
        <Admin t={t} theme={theme} />
      )}
    </>
  );
}