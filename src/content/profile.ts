// Source of truth: Ansh_Sharma_Resume.pdf. Do not add claims that are not in the PDF.
import { links } from "./links";

export const profile = {
  name: "Ansh Sharma",
  role: "Software Developer",
  tagline: "Full-Stack & AI Applications",
  summary: [
    "B.Tech CSE student, graduating 2027, with two software development internships building full-stack web applications in React, Node.js and Express: REST APIs, database design, authentication and debugging.",
    "My personal projects go further into AI, with LLM integration, retrieval-augmented generation and computer vision in TypeScript and Python.",
  ],
} as const;

export const experience = [
  {
    role: "Junior Software Engineer Intern",
    company: "TechJain IT",
    place: "Bhopal",
    period: "June 2026 - September 2026",
    points: [
      "Developed and deployed full-stack web application features using React, Node.js, Express, and database systems.",
      "Connected frontend and backend modules through RESTful APIs, handling data flow between the UI and server.",
      "Debugged and fixed application issues, improving user workflows and overall system efficiency.",
    ],
  },
  {
    role: "Full Stack Development Intern",
    company: "Dadamani Enterprises",
    place: "Tamnar",
    period: "June 2026 - July 2026",
    points: [
      "Built responsive user interfaces and integrated server-side REST APIs to process user transactions.",
      "Managed database schemas, implemented user authentication flows, and maintained deployment scripts.",
      "Improved UI component rendering performance and simplified day-to-day user workflows.",
    ],
  },
  {
    role: "SEO Intern",
    company: "Digital Veda",
    place: "Raipur",
    period: "May 2026 - June 2026",
    points: [
      "Carried out technical website audits, content optimization, and performance analytics reporting.",
    ],
  },
] as const;

export const projects = [
  {
    id: "resume-analyser",
    index: "01",
    title: "AI Resume Analyser",
    stack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Prisma", "LLM APIs"],
    points: [
      "Built a full-stack app that parses PDF/DOCX resumes and uses LLMs to score them on ATS compatibility, formatting, and content, match them to job descriptions, and generate interview questions and skill roadmaps.",
      "Designed a layered Express REST API (controllers, services, repositories) on PostgreSQL with JWT auth, refresh-token rotation, Zod validation, and a switchable provider layer for Claude, OpenAI, and Gemini.",
    ],
    href: links.projects.resumeAnalyser,
  },
  {
    id: "nexora-rag",
    index: "02",
    title: "NexoraRAG",
    stack: ["Python", "LangChain", "Ollama", "FAISS", "Streamlit", "Docker"],
    points: [
      "Implemented a local RAG pipeline that chunks uploaded PDF and text files, embeds them with Hugging Face models, and retrieves relevant passages from a FAISS vector store to answer questions.",
      "Ran local LLMs such as Gemma 3 through Ollama to keep documents private, added query expansion and cross-encoder re-ranking, and containerized the app with Docker Compose.",
    ],
    href: links.projects.nexoraRag,
  },
  {
    id: "gesture-control",
    index: "03",
    title: "Computer Vision Project",
    stack: ["Python", "OpenCV", "MediaPipe", "scikit-learn"],
    points: [
      "Developed a real-time hand gesture controller that tracks hand landmarks from a webcam with MediaPipe and OpenCV and maps finger counts to zoom and rotate actions via PyAutoGUI.",
      "Trained a KNN classifier on hand-landmark data after comparing five scikit-learn models with 10-fold cross-validation.",
    ],
    href: links.projects.gestureControl,
  },
] as const;

export const skills = [
  { group: "Languages", items: ["JavaScript", "TypeScript", "Python", "Java", "C", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "HTML5", "CSS3", "Tailwind CSS"] },
  { group: "Backend & APIs", items: ["Node.js", "Express.js", "RESTful APIs", "API Integration", "JWT Authentication"] },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "Prisma ORM"] },
  { group: "AI & ML", items: ["LLM APIs (OpenAI, Anthropic, Gemini)", "LangChain", "RAG", "Ollama", "FAISS", "OpenCV", "MediaPipe", "scikit-learn"] },
  { group: "Tools", items: ["Git", "GitHub", "Docker", "Postman", "VS Code", "Figma", "Netlify", "Render"] },
  { group: "Core Concepts", items: ["Data Structures & Algorithms", "Object-Oriented Programming", "DBMS", "SDLC", "Debugging"] },
] as const;

export const education = {
  degree: {
    school: "O.P. Jindal University, Raigarh",
    title: "Bachelor of Technology (B.Tech) in Computer Science & Engineering",
    period: "2023 - 2027",
    cgpa: "CGPA 6.4",
  },
  // Year pairing verified against PDF word positions: 12th = 2023, 10th = 2021.
  school: [
    { name: "12th Grade, Indian School, Raigarh", detail: "PCM", year: "2023" },
    { name: "10th Grade, Carmer School, Raigarh", detail: "", year: "2021" },
  ],
} as const;

export const credentials = {
  certifications: [
    "HackerRank Software Engineer",
    "Coursera: Android Mobile App Dev",
    "Tata Forage: GenAI Data Analytics",
    "Simplilearn: SQL",
  ],
  leadership: [
    "Smart India Hackathon (SIH) 2024 & 2025",
    "Co-Convenor of Sponsorship, Technorollix",
    "IEEE Student Member",
  ],
  competitions: [
    "Adobe Hackathon Participant",
    "UI/UX Competition Participant at IIIT Raipur",
  ],
} as const;
