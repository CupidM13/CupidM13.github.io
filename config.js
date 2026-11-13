/* ============================================================
   SITE CONFIG — edit this file to personalize your portfolio.
   Everything on the page reads from window.SITE.
   ============================================================ */
window.SITE = {
  name: "Cupid Moolchandani",
  initials: "CM",
  role: "Aspiring AI / ML Engineer",
  tagline: "I turn data, math and code into systems that learn, adapt and create value.",
  location: "IIT Delhi · Jaipur, India",
  email: "cupidmoolchandani1@gmail.com",
  available: true, // shows "Open to opportunities" badge

  links: {
    github: "https://github.com/CupidM13",
    linkedin: "https://www.linkedin.com/in/cupidmoolchandani/",
    twitter: "",   // optional
    kaggle: "",    // optional
    resume: ""     // link to a PDF resume (optional)
  },

  about: "I'm Cupid — a B.Tech (Biotechnology & Biochemical Engineering) graduate from IIT Delhi (Class of 2026, grade 7.35/10). I've worked as an Energy Market Analyst at Futures First, a Laboratory Teaching Assistant at IIT Delhi, and an educational content creator on YouTube (2000+ subscribers). I'm pivoting into AI/ML engineering because I'm fascinated by how raw data becomes reasoning — and I love blending quantitative trading, teaching, and building things that feel a little bit magical.",

  education: [
    {
      school: "Indian Institute of Technology, Delhi",
      degree: "Bachelor of Technology — Biotechnology & Biochemical Engineering",
      years: "Oct 2022 – May 2026",
      grade: "7.35 / 10",
      activities: "Chess, Running, OCS",
      coursework: ["Data Structures and Algorithms", "Calculus", "Differential Equations", "Linear Algebra", "Macroeconomics", "Bioinformatics"],
      note: "57th Convocation, 2026"
    }
  ],

  experience: [
    {
      role: "Energy Market Analyst",
      org: "Futures First",
      type: "Full-time",
      years: "Jun 2026 – Sep 2026",
      location: "Jaipur, Rajasthan, India · On-site"
    },
    {
      role: "Laboratory Teaching Assistant",
      org: "Indian Institute of Technology, Delhi",
      years: "Aug 2025 – Nov 2025",
      location: "New Delhi, Delhi, India · On-site"
    },
    {
      role: "Educational Video Creator",
      org: "YouTube",
      type: "Self-employed",
      years: "May 2024 – Jun 2024"
    }
  ],

  skills: {
    "ML & AI": ["Python", "NumPy", "Pandas", "scikit-learn", "PyTorch (learning)", "LLMs & RAG (learning)"],
    "Programming": ["Python", "JavaScript", "SQL", "C++ (basics)"],
    "Tools": ["Git", "Jupyter", "Linux", "Docker (learning)"],
    "Domain": ["Quantitative trading", "Time-series", "Market microstructure", "Crude oil futures"],
    "Coursework": ["Data Structures & Algorithms", "Calculus", "Differential Equations", "Linear Algebra", "Macroeconomics", "Bioinformatics"]
  },

  projects: [
    {
      title: "Neural Playground",
      desc: "The interactive single-neuron & MLP visualizer you're looking at right now — built into this site.",
      tags: ["JavaScript", "Canvas", "ML"],
      link: "#playground",
      emoji: "🧠"
    }
    // Add your projects here as:
    // { title, desc, tags: [], link, emoji }
  ],

  // Fun facts shown in the "About" card stack
  funFacts: [
    "IIT Delhi '26 🎓",
    "Ex-quant @ Futures First 📊",
    "2000+ YouTube subs 🎬",
    "Believes every dataset has a story 📖",
    "Chess & running 🏃"
  ]
};
