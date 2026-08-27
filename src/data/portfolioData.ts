import { Project, Skill, TimelineItem, Testimonial, PersonalInfo, AboutData, FaqItem } from '../types';

// ---------------------------------------------------------------------------
// Snapshot of the live Supabase content.
//
// At runtime the site loads this same data from Supabase, so the database stays
// the source of truth and edits made in the owner editor take effect
// immediately. This file is the fallback used when Supabase is unreachable or
// its env vars are not configured - for example on a host where
// VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY have not been set. Keeping it in
// sync means the deployed site shows the correct content either way.
//
// Image URLs point at Supabase Storage; the binaries are not stored in the repo.
// ---------------------------------------------------------------------------

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  bio: "Data Science graduate from Raffles University, holding a Bachelor Degree in Data Science alongside a Diploma in Computer Science. I have completed my internship as a Data Analyst and Software Developer, and have delivered production applications across AI platforms, web systems, mobile apps, and business automation for real clients. I am now actively seeking a Data Scientist role where I can build on that foundation, gain deeper industry experience, and turn data into decisions that matter.",
  name: "Rooben Prakaash",
  role: "Data Scientist",
  email: "r.prakaash@yahoo.com",
  phone: "+60 19-468 8052",
  stats: [
    {
      label: "Projects Delivered",
      value: "11+"
    },
    {
      label: "Years Industry Experience",
      value: "3+"
    },
    {
      label: "Professional Roles Held",
      value: "4"
    },
    {
      label: "Degree Completed",
      value: "BSc Data Science"
    }
  ],
  status: "Graduated & Actively Seeking Data Scientist Opportunities",
  socials: {
    email: "mailto:r.prakaash@yahoo.com",
    github: "https://github.com/roobenprakaash",
    indeed: "https://profile.indeed.com/p/roobenprakaash",
    website: "",
    facebook: "https://facebook.com/roobenprakaash",
    linkedin: "https://linkedin.com/in/roobenprakaash",
    whatsapp: "https://wa.me/60194688052",
    instagram: "https://instagram.com/roobenprakaash",
    jobstreet: "https://www.jobstreet.com.my/en/profile/rooben-prakaash"
  },
  tagline: "Data Analytics, Machine Learning & Full-Stack Development",
  location: "Jalan Puteri 1/3, 81800 Ulu Tiram, Johor",
  timezone: "Asia/Kuala_Lumpur (GMT+8)",
  avatarUrl: "https://oavchmjzxjhwkltiowll.supabase.co/storage/v1/object/public/portfolio-media/avatars/avatar-1787804338635.png",
  formalName: "Rooben Prakaash A/L Soomu",
  headerName: "Mr. Rooben",
  portraitUrl: "https://oavchmjzxjhwkltiowll.supabase.co/storage/v1/object/public/portfolio-media/avatars/portrait-1787804346153.png"
};

export const DEFAULT_ABOUT_DATA: AboutData = {
  quote: "Graduated, hands-on, and ready to grow — actively seeking my next role in data science.",
  pillars: [
    {
      desc: "Data cleaning, exploratory analysis, statistical modelling, time series forecasting, and visualisation with Power BI, Matplotlib, Seaborn, and Plotly.",
      title: "Data Science & Analytics",
      iconName: "Brain"
    },
    {
      desc: "React, Next.js, and Vue on the front end; Node, Express, and FastAPI on the back end, with SQL and NoSQL databases and REST API design.",
      title: "Full-Stack Development",
      iconName: "Layers"
    },
    {
      desc: "Gemini and OpenAI-powered platforms, chatbots, and workflow automation that put AI assistance directly into everyday business operations.",
      title: "AI Integration & Automation",
      iconName: "Cpu"
    }
  ],
  badgeText: "Graduated • Open to Opportunities",
  paragraph1: "I have completed my Bachelor Degree in Data Science at Raffles University, building on a Diploma in Computer Science from Crescendo International College. My studies covered machine learning, statistical analysis, data mining, and database design, which I pair with practical programming across Python, R, SQL, and JavaScript.",
  paragraph2: "I recently finished my internship as a Data Analyst and Software Developer at SJK(T) Ladang Mount Austin, and alongside my studies I have shipped production software for real clients — AI platforms, cross-platform apps, business automation, and commercial websites. I am now looking for a Data Scientist role where I can deepen that experience and contribute to work that has real impact.",
  description: "Data analysis and machine learning, backed by real industry experience in IT infrastructure and software development.",
  formalTitle: "Data Scientist • BSc Data Science, Raffles University",
  headlineMain: "BUILDING WITH",
  sectionTitle: "01 / PROFILE & BACKGROUND",
  sectionSubtitle: "Data Science",
  headlineHighlight: "DATA & CODE"
};

export const PERSONAL_INFO = DEFAULT_PERSONAL_INFO;

export const PROJECTS: Project[] = [
  {
    id: "mpt-omniportal",
    tags: [
      "Python",
      "Next.js",
      "Gemini API",
      "TypeScript"
    ],
    image: "",
    title: "MPT OmniPortal",
    category: "ai_ml",
    featured: false,
    subtitle: "Million Precision Time — AI Business Platform",
    highlights: [
      "Centralised fragmented business operations into a single portal",
      "Integrated Google Gemini for AI-assisted day-to-day workflows",
      "Built with Next.js and TypeScript on a Python service layer"
    ],
    description: "An AI-powered business portal built on Google’s Gemini API that centralises company operations and brings AI-assisted workflows into day-to-day business management.",
    categoryLabel: "AI Platform · Enterprise",
    longDescription: "MPT OmniPortal replaces scattered manual processes with a single operational hub for Million Precision Time. Built on Next.js with a Python service layer and Google’s Gemini API, it brings AI assistance directly into everyday tasks — surfacing information, drafting content, and guiding staff through workflows that previously depended on institutional knowledge."
  },
  {
    id: "logiclens-ai",
    tags: [
      "Flutter",
      "Dart",
      "Supabase",
      "OpenAI",
      "Gemini"
    ],
    image: "",
    title: "LogicLens.AI",
    category: "ai_ml",
    featured: false,
    subtitle: "Government School — Immersive Maths Learning",
    highlights: [
      "AI virtual guide that explains maths concepts conversationally",
      "Interactive 360° tours for exploring algebra and geometry visually",
      "Cross-platform Flutter build backed by Supabase"
    ],
    description: "An immersive mathematics learning application for schools, using an AI-powered virtual guide and interactive 360° tours to help students explore algebra and geometry.",
    categoryLabel: "AI Application · Education",
    longDescription: "LogicLens.AI was built for a government school to make abstract mathematics tangible. Students move through interactive 360° environments accompanied by an AI virtual guide that explains algebraic and geometric concepts conversationally, letting them explore and visualise ideas at their own pace, anywhere they are."
  },
  {
    id: "rstar-pos-system",
    tags: [
      "Flutter",
      "Dart",
      "JavaScript",
      "SQLite"
    ],
    image: "",
    title: "R-Star POS System",
    category: "mobile_ui",
    featured: false,
    subtitle: "RStar Mini Mart — Windows Point of Sale",
    highlights: [
      "Immutable stock-movement ledger making every inventory change auditable",
      "Batch inventory with stock levels and product conversions",
      "Daily cycle counts with variance reasons and theft/shrinkage tracking",
      "Reporting for sales, profit/COGS, discounts, payments, and cash settlement"
    ],
    description: "A complete point-of-sale and inventory system handling the full shop workflow: sales, batch inventory, stock ledgers, cycle counts, and daily cash settlement.",
    categoryLabel: "Windows Application · Retail",
    longDescription: "R-Star POS runs the entire operation of a mini mart. Beyond selling items, it tracks inventory by batch with stock levels and product conversions, and maintains an immutable stock-movement ledger so every change is auditable. Daily cycle counts capture variance reasons and flag theft or shrinkage, while the reporting layer covers business-day sales, profit and COGS, discounts, payment breakdown, and end-of-day cash settlement."
  },
  {
    id: "policy-snap",
    tags: [
      "Next.js",
      "Capacitor",
      "Electron",
      "Android"
    ],
    image: "",
    title: "Policy Snap",
    category: "ai_ml",
    featured: false,
    subtitle: "Great Eastern — Insurance Summary Generator",
    highlights: [
      "One-step conversion from NotebookLM JSON to a print-ready A4 summary",
      "PDF download, WhatsApp sharing, and direct printing",
      "Shipped as web, Android, and Windows desktop from one codebase"
    ],
    description: "Paste a NotebookLM JSON response and instantly generate a clean A4 insurance policy summary poster — downloadable as PDF, shareable on WhatsApp, or ready to print.",
    categoryLabel: "AI Tool · Multi-Platform",
    longDescription: "Policy Snap turns raw AI output into a client-ready document in one step. An agent pastes a NotebookLM JSON response and immediately gets a formatted A4 policy summary poster, ready to download as PDF, send over WhatsApp, or print. It ships as a web app, an Android app, and a Windows desktop application from a shared codebase."
  },
  {
    id: "mpt-watch-sales-bot",
    tags: [
      "Bot Automation",
      "Node.js"
    ],
    image: "",
    title: "MPT Watch Sales Bot",
    category: "iot_data",
    featured: false,
    subtitle: "Million Precision Time — Retail Assistant",
    highlights: [
      "Instant sale, commission, and discount calculation for shop-floor staff",
      "Eliminated manual arithmetic and reduced point-of-sale errors"
    ],
    description: "A sales assistant bot that lets retail staff instantly calculate watch sales, commissions, and discounts, removing manual maths from the shop floor.",
    categoryLabel: "Chatbot · Retail",
    longDescription: "Built for Million Precision Time’s retail team, this bot removes error-prone manual calculation at the point of sale. Staff query it directly and get immediate figures for sale totals, commission, and discounting — speeding up transactions and cutting mistakes during busy periods."
  },
  {
    id: "biometric-attendance",
    tags: [
      "Python",
      "OpenCV",
      "Biometrics",
      "Image Processing"
    ],
    image: "",
    title: "Biometric Attendance System",
    category: "iot_data",
    featured: false,
    subtitle: "Fingerprint Recognition & Tamper-Proof Logging",
    highlights: [
      "Fingerprint recognition powered by Python and OpenCV image processing",
      "Tamper-proof logging for a trustworthy attendance record"
    ],
    description: "A high-security attendance tracking system using fingerprint recognition, built with Python and OpenCV for accurate, tamper-proof logging.",
    categoryLabel: "Computer Vision · Security",
    longDescription: "This system replaces sign-in sheets and access cards with biometric verification. Python and OpenCV handle the image processing behind fingerprint recognition, and records are written so they cannot be retroactively altered — giving an attendance log that can actually be trusted."
  },
  {
    id: "ai-retail-manager",
    tags: [
      "Python",
      "Machine Learning",
      "Demand Forecasting",
      "Analytics"
    ],
    image: "",
    title: "AI Retail Manager",
    category: "ai_ml",
    featured: false,
    subtitle: "Machine Learning Retail Operations",
    highlights: [
      "Automated stock tracking across the retail catalogue",
      "Machine-learning demand forecasting to guide purchasing",
      "Real-time sales analytics dashboard"
    ],
    description: "A retail management solution powered by AI, featuring automated stock tracking, machine-learning demand forecasting, and real-time sales analytics.",
    categoryLabel: "AI Platform · Retail",
    longDescription: "AI Retail Manager applies machine learning to the operational side of retail. It tracks stock automatically, forecasts demand so ordering can be planned rather than reacted to, and surfaces sales analytics in real time — turning day-to-day transaction data into decisions about what to stock and when."
  },
  {
    id: "conglomerate-website",
    tags: [
      "HTML",
      "CSS",
      "TSX",
      "Supabase",
      "GoDaddy"
    ],
    image: "",
    title: "Conglomerate Website",
    category: "fullstack",
    featured: false,
    subtitle: "Conglomerate Consultant Company — Corporate Site",
    highlights: [
      "Clear presentation of four distinct corporate divisions",
      "Featured projects section for sustainable energy and infrastructure work",
      "Deployed on a client-managed GoDaddy domain"
    ],
    description: "A modern, professional website for a multinational corporation, presenting its energy, technology, manufacturing, and finance divisions in a clean corporate layout.",
    categoryLabel: "Website · Corporate",
    longDescription: "Built for a multinational consultancy, this site presents a complex organisation clearly. A clean layout and corporate palette carry the brand across key operational areas — energy, technology, manufacturing, and finance — with a featured projects section highlighting sustainable energy initiatives and global infrastructure work."
  },
  {
    id: "sun-tours-roma",
    tags: [
      "TSX",
      "JavaScript",
      "CSS",
      "Supabase",
      "GoDaddy"
    ],
    image: "",
    title: "Sun Tours Roma",
    category: "fullstack",
    featured: false,
    subtitle: "Sun Tours — Italian Tourism Landing Page",
    highlights: [
      "Delivered for an international client within the Sun Tours Virtual Guide initiative",
      "Responsive landing page pairing design with destination photography"
    ],
    description: "A landing page for Italian tourism built for an Italian client as part of the Sun Tours Virtual Guide initiative.",
    categoryLabel: "Website · Travel",
    longDescription: "Created for an Italian client under the Sun Tours Virtual Guide initiative, this landing page pairs a clean, responsive layout with evocative imagery of Rome and the Italian coast — designed so the destination itself does the selling."
  },
  {
    id: "walletwise",
    tags: [
      "TypeScript",
      "CSS"
    ],
    image: "",
    title: "WalletWise",
    category: "fullstack",
    featured: false,
    subtitle: "Onyxx Tech — Personal Finance Tracker",
    highlights: [
      "Wallet transaction management with spending-habit breakdowns",
      "Built in TypeScript for a fast, reliable experience"
    ],
    description: "A personal finance tracker for managing wallet transactions, monitoring spending habits, and staying on top of your financial health.",
    categoryLabel: "Web App · Finance",
    longDescription: "WalletWise gives everyday users a straightforward view of where their money goes. It records wallet transactions, breaks down spending habits over time, and surfaces the numbers that matter for financial health — built in TypeScript for a fast, reliable experience."
  },
  {
    id: "carousel-generator",
    tags: [
      "TypeScript",
      "Web App"
    ],
    image: "",
    title: "Carousel Generator",
    category: "fullstack",
    featured: false,
    subtitle: "Onyxx Tech — Social Media Design Tool",
    highlights: [
      "Content-in, slides-out generation for Instagram and LinkedIn carousels",
      "Consistent branding across every slide with zero design effort"
    ],
    description: "A web tool that turns written content into styled, presentation-ready social media carousel slides optimised for Instagram and LinkedIn.",
    categoryLabel: "Marketing Tool · Social Media",
    longDescription: "Carousel Generator removes the design bottleneck from social publishing. Users paste in their content and get back consistently branded, presentation-ready carousel slides sized for Instagram, LinkedIn, and beyond — no design tooling or manual layout required."
  }
];

export const SKILLS: Skill[] = [
  {
    name: "Python",
    level: 90,
    category: "Data Science & AI",
    iconName: "Terminal",
    description: "Primary language for data analysis, machine learning, scripting, and automation.",
    highlighted: true
  },
  {
    name: "Data Analysis & Cleaning",
    level: 88,
    category: "Data Science & AI",
    iconName: "BarChart3",
    description: "Exploratory data analysis, data cleaning, ETL workflows, data mining and warehousing.",
    highlighted: true
  },
  {
    name: "Machine Learning",
    level: 82,
    category: "Data Science & AI",
    iconName: "Brain",
    description: "Supervised and unsupervised learning, neural networks, and predictive modelling.",
    highlighted: true
  },
  {
    name: "Data Visualization",
    level: 87,
    category: "Data Science & AI",
    iconName: "PieChart",
    description: "Power BI, Matplotlib, Seaborn, and Plotly for dashboards and analytical reporting.",
    highlighted: true
  },
  {
    name: "Statistical Analysis & Forecasting",
    level: 84,
    category: "Data Science & AI",
    iconName: "BarChart3",
    description: "Statistical methods, hypothesis testing, and time series forecasting."
  },
  {
    name: "R",
    level: 78,
    category: "Data Science & AI",
    iconName: "Terminal",
    description: "Statistical computing and data analysis for coursework and research projects."
  },
  {
    name: "Natural Language Processing",
    level: 80,
    category: "Data Science & AI",
    iconName: "Sparkles",
    description: "Natural language processing, prompt engineering, and LLM integration with Claude, ChatGPT, and Ollama."
  },
  {
    name: "React.js & Next.js",
    level: 86,
    category: "Full-Stack Engineering",
    iconName: "Code2",
    description: "Component architecture, hooks, routing, and responsive single-page applications.",
    highlighted: true
  },
  {
    name: "JavaScript & TypeScript",
    level: 85,
    category: "Full-Stack Engineering",
    iconName: "FileCode2",
    description: "Modern ES syntax, typed application code, and async patterns.",
    highlighted: true
  },
  {
    name: "Node.js, Express & FastAPI",
    level: 80,
    category: "Full-Stack Engineering",
    iconName: "Server",
    description: "REST API development, server-side logic, and authentication with JWT and OAuth.",
    highlighted: true
  },
  {
    name: "Tailwind CSS & Responsive Design",
    level: 88,
    category: "Full-Stack Engineering",
    iconName: "Palette",
    description: "Utility-first styling, responsive layouts, and accessible interface design.",
    highlighted: true
  },
  {
    name: "SQL & Database Design",
    level: 85,
    category: "Full-Stack Engineering",
    iconName: "Database",
    description: "MySQL, MariaDB, PostgreSQL, ERD modelling, normalization, and query optimization.",
    highlighted: true
  },
  {
    name: "MongoDB, Firebase & Supabase",
    level: 78,
    category: "Full-Stack Engineering",
    iconName: "Database",
    description: "NoSQL data modelling, realtime databases, authentication, and backend-as-a-service."
  },
  {
    name: "Java & C/C++",
    level: 75,
    category: "Full-Stack Engineering",
    iconName: "FileCode2",
    description: "Object-oriented programming, data structures and algorithms from formal coursework."
  },
  {
    name: "Vue.js",
    level: 70,
    category: "Full-Stack Engineering",
    iconName: "Code2",
    description: "Component-based front-end development as an alternative to the React ecosystem."
  },
  {
    name: "Git & GitHub",
    level: 85,
    category: "Cloud & DevOps",
    iconName: "GitBranch",
    description: "Version control, branching workflows, and collaborative development."
  },
  {
    name: "Linux Administration",
    level: 80,
    category: "Cloud & DevOps",
    iconName: "Monitor",
    description: "AlmaLinux, Ubuntu, and WSL2 — shell usage, server configuration, and service management."
  },
  {
    name: "Docker & Containerization",
    level: 72,
    category: "Cloud & DevOps",
    iconName: "Box",
    description: "Containerised application setups and isolated development environments."
  },
  {
    name: "Nginx, Vercel & CI/CD",
    level: 74,
    category: "Cloud & DevOps",
    iconName: "Cloud",
    description: "Web server configuration, deployment pipelines, and hosting fundamentals."
  },
  {
    name: "IT Support & Desktop Engineering",
    level: 90,
    category: "IoT & Tools",
    iconName: "Monitor",
    description: "Hardware and software installation, troubleshooting, POS support, data recovery, and system upgrades.",
    highlighted: true
  },
  {
    name: "ESP32, Arduino & Sensors",
    level: 75,
    category: "IoT & Tools",
    iconName: "Radio",
    description: "Microcontroller programming and sensor integration for embedded projects."
  },
  {
    name: "Networking & Systems",
    level: 82,
    category: "IoT & Tools",
    iconName: "Zap",
    description: "TCP/IP, DNS, cross-platform operating systems, and computer security fundamentals."
  },
  {
    name: "UI/UX Design & Figma",
    level: 80,
    category: "IoT & Tools",
    iconName: "Layers",
    description: "Wireframing, prototyping, and interface design, plus photo, video, and 3D tooling."
  },
  {
    name: "Prompt Engineering",
    level: 70,
    category: "Data Science & AI",
    iconName: "Code2",
    description: "Do the best understand prompt engineering for the AI to get the best output."
  }
];

export const TIMELINE: TimelineItem[] = [
  {
    id: "sjkt-mount-austin-internship",
    type: "experience",
    badge: "💼 Internship Completed",
    title: "Data Analyst & Software Developer (Internship)",
    period: "May 2026 — August 2026",
    skills: [
      "Data Analysis",
      "Software Development",
      "Python",
      "SQL",
      "Reporting"
    ],
    location: "Johor, Malaysia",
    description: "Final-year internship combining data analysis with software development — turning school data into usable insight and building the tools to manage it.",
    achievements: [
      "Analysed institutional data and produced reporting to support decision-making",
      "Developed and maintained software to streamline day-to-day administrative workflows",
      "Applied degree-level data analysis and programming skills in a live operational setting"
    ],
    organization: "SJK(T) Ladang Mount Austin"
  },
  {
    id: "raffles-university",
    type: "education",
    badge: "🎓 Graduated",
    title: "Bachelor Degree in Data Science",
    period: "2024 — 2026",
    skills: [
      "Machine Learning",
      "Statistics",
      "Python",
      "R",
      "SQL",
      "Data Visualization"
    ],
    location: "Johor, Malaysia",
    description: "Undergraduate degree covering machine learning, statistical analysis, data mining and warehousing, database systems, and applied programming for data science.",
    achievements: [
      "CGPA: 3.8",
      "Completed coursework in machine learning, neural networks, and predictive modelling",
      "Studied statistical analysis, time series forecasting, and data visualisation",
      "Applied Python, R, and SQL to practical analytical problems throughout the programme"
    ],
    organization: "Raffles University"
  },
  {
    id: "grand-copthorne",
    type: "experience",
    badge: "💼 F&B Department",
    title: "Room Service Executive — F&B Department",
    period: "April 2023 — August 2024",
    skills: [
      "Operational Management",
      "Guest & Quality Standards",
      "Leadership & Administration"
    ],
    location: "Singapore",
    description: "Efficient Hospitality Professional with expertise in managing in-room dining systems, processing accurate orders, and handling secure payment settlements. Skilled in coordinate-driven kitchen communication, guest relationship management, and resolving service feedback to elevate the hotel dining experience.",
    achievements: [
      "Guest satisfaction by increased room service guest satisfaction scores (GSS) by 18%",
      "Cost efficiency via reduced food and operational wastage by 12%",
      "Speed of service that decreased average order delivery time from 45 minutes to 28 minutes",
      "Team Leadership to trained and mentored a team of 15+ attendants and servers"
    ],
    organization: "Grand Copthorne Waterfront Hotel"
  },
  {
    id: "eyou-technology",
    type: "experience",
    badge: "🎨 Practical Training",
    title: "Technical Artist (Internship)",
    period: "September 2022 — December 2022",
    skills: [
      "UI/UX Design",
      "Figma",
      "Computer Graphics",
      "Photo & Video Editing"
    ],
    location: "Johor, Malaysia",
    description: "Industrial training placement in computer graphics development, producing visual assets and supporting the technical production pipeline.",
    achievements: [
      "Produced and optimised graphical assets for commercial production",
      "Applied UI/UX and multimedia principles to client deliverables",
      "Completed the full practical training requirement of the diploma programme"
    ],
    organization: "eYou Technology Sdn Bhd"
  },
  {
    id: "crescendo-college",
    type: "education",
    badge: "🎓 Completed",
    title: "Diploma in Computer Science",
    period: "2020 — 2022",
    skills: [
      "Java",
      "C/C++",
      "Data Structures",
      "Database Design",
      "System Analysis"
    ],
    location: "Johor, Malaysia",
    description: "Diploma covering programming fundamentals, object-oriented design, data structures and algorithms, database systems, and system analysis and design.",
    achievements: [
      "CGPA: 3.2",
      "Built a foundation in OOP, data structures, algorithms, and the SDLC",
      "Studied database design including ERD modelling and normalization",
      "Completed industrial training as part of the programme requirements"
    ],
    organization: "Crescendo International College"
  },
  {
    id: "six-star-logistics",
    type: "experience",
    badge: "📦 First Role",
    title: "Warehouse Assistant",
    period: "December 2019 — June 2020",
    skills: [
      "Logistics",
      "Inventory Management",
      "Operations",
      "Teamwork"
    ],
    location: "Johor, Malaysia",
    description: "Warehouse and logistics operations role in the transport and trading sector, handling inventory movement and stock accuracy.",
    achievements: [
      "Managed inventory handling and maintained accurate stock records",
      "Coordinated with the team to meet daily dispatch schedules",
      "Left on good terms to continue into higher education"
    ],
    organization: "Six Star Logistics & Trading"
  },
  {
    id: "smk-taman-pelangi-indah",
    type: "education",
    badge: "🎓 SPM",
    title: "Sijil Pelajaran Malaysia (SPM)",
    period: "2015 — 2019",
    skills: [
      "Secondary Education"
    ],
    location: "Johor, Malaysia",
    description: "Completed Malaysian secondary education, qualifying for entry into tertiary computer science studies.",
    achievements: [
      "Grades: 4A, 3B, & 1D",
      "Completed SPM secondary school certification"
    ],
    organization: "SMK Taman Pelangi Indah"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "ref-yuslizan",
    name: "Mr. Yuslizan",
    role: "Manager, F&B Department",
    phone: "+65 9434 5561",
    avatar: "",
    rating: 0,
    company: "Grand Copthorne Waterfront, Singapore",
    content: "Direct manager during my room service executive role."
  },
  {
    id: "ref-daina",
    name: "Miss Daina",
    role: "Admin",
    phone: "+60 16-893 8980",
    avatar: "",
    rating: 0,
    company: "eYou Technology Sdn Bhd",
    content: "Supervised my practical training placement in computer graphics development."
  },
  {
    id: "ref-sam",
    name: "Mr. Sam",
    role: "Director",
    phone: "+60 19-766 7643",
    avatar: "",
    rating: 0,
    company: "Six Star Logistics & Trading",
    content: "Employer during my warehouse and logistics role."
  }
];

export const FREQUENT_QUESTIONS: FaqItem[] = [];
