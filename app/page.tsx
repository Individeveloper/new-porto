"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlinkBlur } from "react-loading-indicators";
import { projects } from "@/lib/projects";

const achievements = [
  {
    title: "1st Place — Provincial LKS IT Software Solution for Business",
    org: "Disdikbud Kalimantan Timur",
    year: "2026",
  },
  {
    title: "Medallion of Excellence — National LKS (LKSN) IT Software",
    org: "Puspresnas",
    year: "2026",
  },
];

// ── Blown alphabet effect ─────────────────────────────
const LETTERS = "JAYDEN DWI NAUFAL GRACE AVIOLYN RIFWANSYAH".replace(/ /g, "").split("");

function WindCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    type Letter = {
      char: string;
      x: number;
      y: number;
      vx: number;       // constant horizontal speed
      baseY: number;    // vertical center for sine wave
      drift: number;    // amplitude of vertical wave
      driftSpeed: number;
      angle: number;
      spin: number;
      size: number;
      opacity: number;
      life: number;
      maxLife: number;
    };

    const COUNT = 14;
    const letters: Letter[] = [];

    const spawn = (initialX?: number): Letter => {
      const x = initialX !== undefined ? initialX : -30 - Math.random() * 60;
      const y = H * 0.15 + Math.random() * H * 0.7;
      const vx = 0.5 + Math.random() * 0.7;
      const dist = (W + 60) - x;
      const maxLife = Math.max(120, Math.ceil(dist / vx) + 60);
      return {
        char: LETTERS[Math.floor(Math.random() * LETTERS.length)],
        x,
        y,
        baseY: y,
        vx,
        drift: 5 + Math.random() * 12,
        driftSpeed: 0.006 + Math.random() * 0.01,
        angle: (Math.random() - 0.5) * 0.25,
        spin: (Math.random() - 0.5) * 0.006,
        size: 16 + Math.floor(Math.random() * 22),
        opacity: 0,
        life: 0,
        maxLife,
      };
    };

    for (let i = 0; i < COUNT; i++) {
      const initX = Math.random() * W;
      letters.push(spawn(initX));
    }

    let raf: number;
    const startTime = performance.now();
    const FADE_IN_MS = 1800;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / FADE_IN_MS);
      // Smooth cubic ease-out
      const canvasFade = 1 - Math.pow(1 - progress, 3);

      const fadeInDist = Math.max(60, W * 0.12);
      const fadeOutDist = Math.max(80, W * 0.15);
      const fadeOutStart = W - fadeOutDist;

      for (const l of letters) {
        l.life++;
        l.x += l.vx;
        l.y = l.baseY + Math.sin(l.life * l.driftSpeed) * l.drift;
        l.angle += l.spin;

        // Fade in di kiri, tampil penuh di badan layar, dan fade out halus saat sampai ke kanan
        if (l.x < fadeInDist) {
          l.opacity = Math.max(0, Math.min(1, (l.x + 20) / (fadeInDist + 20)));
        } else if (l.x > fadeOutStart) {
          l.opacity = Math.max(0, Math.min(1, 1 - (l.x - fadeOutStart) / (fadeOutDist + 30)));
        } else {
          l.opacity = 1;
        }

        const alpha = Math.min(1, Math.max(0, l.opacity)) * 0.22 * canvasFade;

        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.angle);
        ctx.globalAlpha = alpha;
        ctx.font = `400 ${l.size}px 'PT Serif Caption', serif`;
        ctx.fillStyle = "#000000";
        ctx.fillText(l.char, 0, 0);
        ctx.restore();

        // Respawn hanya setelah mencapai atau keluar dari sisi kanan layar
        if (l.x > W + 40 || l.life >= l.maxLife) {
          Object.assign(l, spawn());
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero__wind" aria-hidden="true" />;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const fadeRefs = useRef<HTMLElement[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLElement | null) => {
    if (el && !fadeRefs.current.includes(el)) {
      fadeRefs.current.push(el);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.ACCESS_KEY,
          ...formData,
        }),
      });
      if (res.ok) setSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      {/* Navigation */}
      <nav className="nav">
        <span className="nav__logo">Individev</span>
        <ul className="nav__links">
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <a
              href="https://github.com/Individeveloper"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/jayden-dwi-naufal-5a1b66294/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className={`nav__hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
        >
          <span className="nav__hamburger-line" />
          <span className="nav__hamburger-line" />
          <span className="nav__hamburger-line" />
        </button>
      </nav>

      {/* Mobile Backdrop */}
      <div
        className={`nav__backdrop ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Sidebar with Translucent Blur */}
      <aside
        className={`nav__sidebar ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="nav__sidebar-header">
          <button
            type="button"
            className="nav__sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Tutup menu"
          >
            ✕
          </button>
        </div>
        <ul className="nav__sidebar-links">
          <li>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>
          </li>
          <li>
            <a href="#projects" onClick={() => setMenuOpen(false)}>
              Projects
            </a>
          </li>
          <li>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
          </li>
          <li className="nav__sidebar-divider" />
          <li>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Github ↗
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              LinkedIn ↗
            </a>
          </li>
        </ul>
      </aside>

      {/* Hero Section */}
      <section className="hero">
        <WindCanvas />
        <div className="hero__text">
          <p className="hero__label">Portfolio</p>
          <h1 className="hero__name">
            Jayden Dwi Naufal
          </h1>
        </div>
      </section>


      {/* About Section */}
      <section
        id="about"
        className="about fade-up"
        ref={addRef as React.RefCallback<HTMLElement>}
      >
        <h2 className="section__label">About</h2>
        <div className="about__body">
          <div className="about__text-col">
            <p className="about__text">
              Hi, I&apos;m <strong>Jayden Dwi Naufal</strong> — a Full-Stack
              Developer and Data Scientist who loves turning complex problems
              into elegant software solutions.
            </p>
            <p className="about__text">
              As a 2025 Dicoding bootcamp graduate, 1st place winner at the
              Provincial LKS, and recipient of a Medallion of Excellence at
              the National LKS (LKSN) in IT Software Solution for Business,
              I am always eager to take on new challenges.
            </p>
            <div className="about__skills">
              <span className="skill-tag">React / Next.js</span>
              <span className="skill-tag">Python</span>
              <span className="skill-tag">ASP.Net</span>
              <span className="skill-tag">Jetpack Compose</span>
            </div>
          </div>
          <div className="about__photo-col">
            <div className="about__photo-frame">
              <Image
                src="/foto/foto-diri.jpg"
                alt="Jayden Dwi Naufal"
                width={320}
                height={400}
                unoptimized
                className="about__photo"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Section */}
      <section
        className="achievements fade-up"
        ref={addRef as React.RefCallback<HTMLElement>}
      >
        <h2 className="section__label">Achievements</h2>
        <ul className="achievement__list">
          {achievements.map((item, i) => (
            <li key={i} className="achievement-item">
              <span className="achievement-item__year">{item.year}</span>
              <div className="achievement-item__body">
                <p className="achievement-item__title">{item.title}</p>
                <p className="achievement-item__org">{item.org}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="projects fade-up"
        ref={addRef as React.RefCallback<HTMLElement>}
      >
        <h2 className="section__label">Projects</h2>
        <ul className="projects__list">
          {projects.map((project, i) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="project-item">
                <span className="project-item__index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="project-item__info">
                  <span className="project-item__title">{project.title}</span>
                  <span className="project-item__tag">{project.tag}</span>
                </div>
                <div className="project-item__meta">
                  <span className="project-item__year">{project.year}</span>
                  <span className="project-item__arrow" aria-hidden="true">↗</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="contact fade-up"
        ref={addRef as React.RefCallback<HTMLElement>}
      >
        <h2 className="section__label">Contact</h2>
        <div className="contact__body">
          <div className="contact__intro">
            <p className="contact__desc">
              Interested in working together or have a project idea? I&apos;d
              love to hear from you. Fill out the form and I&apos;ll get back
              to you as soon as possible.
            </p>
            <div className="contact__info">
              <p className="contact__info-item">
                <span className="contact__info-label">Email</span>
                <a href="mailto:dwinaufaljayden@gmail.com" className="contact__info-val">
                  dwinaufaljayden@gmail.com
                </a>
              </p>
              <p className="contact__info-item">
                <span className="contact__info-label">Location</span>
                <span className="contact__info-val">Indonesia</span>
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="contact__success">
              <p>Thank you! I&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  className="form-input form-textarea"
                  placeholder="Tell me about your project or idea..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className={`btn btn--primary btn--full ${isSubmitting ? "btn--loading" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <BlinkBlur
                    color="#000000"
                    size="medium"
                    text="Please Wait"
                    textColor="#000000"
                  />
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer__copy">
          &copy; 2026 Jayden Dwi Naufal. All rights reserved.
        </p>
        <div className="footer__links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            Github
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  );
}
