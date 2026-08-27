import { Project, Skill, TimelineItem, Testimonial, PersonalInfo, AboutData, FaqItem } from '../types';

// ---------------------------------------------------------------------------
// All content below is drawn from Rooben's own CV.
// Deliberately NOT published here (private / third-party data):
//   - NRIC number, date of birth, exact street address
//   - Salary history from previous roles
//   - Referees' personal phone numbers
// ---------------------------------------------------------------------------

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  headerName: 'Mr. Rooben',
  name: 'Rooben Prakaash',
  formalName: 'Rooben Prakaash A/L Soomu',
  role: 'Data Scientist',
  tagline: 'Data Analytics, Machine Learning & Full-Stack Development',
  email: 'r.prakaash@yahoo.com',
  phone: '+60 19-468 8052',
  location: 'Ulu Tiram, Johor, Malaysia',
  timezone: 'Asia/Kuala_Lumpur (GMT+8)',
  status: 'Graduated & Actively Seeking Data Scientist Opportunities',
  bio: 'Data Science graduate from Raffles University, holding a Bachelor Degree in Data Science alongside a Diploma in Computer Science. I have completed my internship as a Data Analyst and Software Developer, and have delivered production applications across AI platforms, web systems, mobile apps, and business automation for real clients. I am now actively seeking a Data Scientist role where I can build on that foundation, gain deeper industry experience, and turn data into decisions that matter.',
  // Empty until an image is uploaded through the editor (stored in Supabase Storage)
  avatarUrl: '',
  portraitUrl: '',
  socials: {
    facebook: 'https://facebook.com/roobenprakaash',
    whatsapp: 'https://wa.me/60194688052',
    instagram: 'https://instagram.com/roobenprakaash',
    linkedin: 'https://linkedin.com/in/roobenprakaash',
    jobstreet: 'https://www.jobstreet.com.my/en/profile/rooben-prakaash',
    indeed: 'https://profile.indeed.com/p/roobenprakaash',
    email: 'mailto:r.prakaash@yahoo.com',
    github: 'https://github.com/roobenprakaash',
    website: '',
  },
  stats: [
    { label: 'Projects Delivered', value: '12+' },
    { label: 'Years Industry Experience', value: '3+' },
    { label: 'Professional Roles Held', value: '4' },
    { label: 'Degree Completed', value: 'BSc Data Science' },
  ],
};

export const DEFAULT_ABOUT_DATA: AboutData = {
  sectionTitle: '01 / PROFILE & BACKGROUND',
  sectionSubtitle: 'Data Science',
  headlineMain: 'BUILDING WITH',
  headlineHighlight: 'DATA & CODE',
  description:
    'Data analysis and machine learning, backed by real industry experience in IT infrastructure and software development.',
  formalTitle: 'Data Scientist • BSc Data Science, Raffles University',
  badgeText: 'Graduated • Open to Opportunities',
  paragraph1:
    'I have completed my Bachelor Degree in Data Science at Raffles University, building on a Diploma in Computer Science from Crescendo International College. My studies covered machine learning, statistical analysis, data mining, and database design, which I pair with practical programming across Python, R, SQL, and JavaScript.',
  paragraph2:
    'I recently finished my internship as a Data Analyst and Software Developer at SJK(T) Ladang Mount Austin, and alongside my studies I have shipped production software for real clients — AI platforms, cross-platform apps, business automation, and commercial websites. I am now looking for a Data Scientist role where I can deepen that experience and contribute to work that has real impact.',
  quote:
    'Graduated, hands-on, and ready to grow — actively seeking my next role in data science.',
  pillars: [
    {
      iconName: 'Brain',
      title: 'Data Science & Analytics',
      desc: 'Data cleaning, exploratory analysis, statistical modelling, time series forecasting, and visualisation with Power BI, Matplotlib, Seaborn, and Plotly.',
    },
    {
      iconName: 'Layers',
      title: 'Full-Stack Development',
      desc: 'React, Next.js, and Vue on the front end; Node, Express, and FastAPI on the back end, with SQL and NoSQL databases and REST API design.',
    },
    {
      iconName: 'Cpu',
      title: 'AI Integration & Automation',
      desc: 'Gemini and OpenAI-powered platforms, chatbots, and workflow automation that put AI assistance directly into everyday business operations.',
    },
  ],
};

export const PERSONAL_INFO = DEFAULT_PERSONAL_INFO;

// Real client and product work, most significant first.
export const PROJECTS: Project[] = [
  {
    id: 'mpt-omniportal',
    title: 'MPT OmniPortal',
    subtitle: 'Million Precision Time — AI Business Platform',
    description:
      'An AI-powered business portal built on Google’s Gemini API that centralises company operations and brings AI-assisted workflows into day-to-day business management.',
    longDescription:
      'MPT OmniPortal replaces scattered manual processes with a single operational hub for Million Precision Time. Built on Next.js with a Python service layer and Google’s Gemini API, it brings AI assistance directly into everyday tasks — surfacing information, drafting content, and guiding staff through workflows that previously depended on institutional knowledge.',
    category: 'ai_ml',
    categoryLabel: 'AI Platform · Enterprise',
    image: '',
    tags: ['Python', 'Next.js', 'Gemini API', 'TypeScript'],
    featured: false,
    highlights: [
      'Centralised fragmented business operations into a single portal',
      'Integrated Google Gemini for AI-assisted day-to-day workflows',
      'Built with Next.js and TypeScript on a Python service layer',
    ],
  },
  {
    id: 'logiclens-ai',
    title: 'LogicLens.AI',
    subtitle: 'Government School — Immersive Maths Learning',
    description:
      'An immersive mathematics learning application for schools, using an AI-powered virtual guide and interactive 360° tours to help students explore algebra and geometry.',
    longDescription:
      'LogicLens.AI was built for a government school to make abstract mathematics tangible. Students move through interactive 360° environments accompanied by an AI virtual guide that explains algebraic and geometric concepts conversationally, letting them explore and visualise ideas at their own pace, anywhere they are.',
    category: 'ai_ml',
    categoryLabel: 'AI Application · Education',
    image: '',
    tags: ['Flutter', 'Dart', 'Supabase', 'OpenAI', 'Gemini'],
    featured: false,
    highlights: [
      'AI virtual guide that explains maths concepts conversationally',
      'Interactive 360° tours for exploring algebra and geometry visually',
      'Cross-platform Flutter build backed by Supabase',
    ],
  },
  {
    id: 'rstar-pos-system',
    title: 'R-Star POS System',
    subtitle: 'RStar Mini Mart — Windows Point of Sale',
    description:
      'A complete point-of-sale and inventory system handling the full shop workflow: sales, batch inventory, stock ledgers, cycle counts, and daily cash settlement.',
    longDescription:
      'R-Star POS runs the entire operation of a mini mart. Beyond selling items, it tracks inventory by batch with stock levels and product conversions, and maintains an immutable stock-movement ledger so every change is auditable. Daily cycle counts capture variance reasons and flag theft or shrinkage, while the reporting layer covers business-day sales, profit and COGS, discounts, payment breakdown, and end-of-day cash settlement.',
    category: 'mobile_ui',
    categoryLabel: 'Windows Application · Retail',
    image: '',
    tags: ['Flutter', 'Dart', 'JavaScript', 'SQLite'],
    featured: false,
    highlights: [
      'Immutable stock-movement ledger making every inventory change auditable',
      'Batch inventory with stock levels and product conversions',
      'Daily cycle counts with variance reasons and theft/shrinkage tracking',
      'Reporting for sales, profit/COGS, discounts, payments, and cash settlement',
    ],
  },
  {
    id: 'xcraft-cloud',
    title: 'Xcraft Cloud',
    subtitle: 'Onyxx Tech — Forex Trading Journal',
    description:
      'A cross-platform forex trading journal for tracking and analysing trades on web and mobile, with performance metrics, visual charts, and pattern identification.',
    longDescription:
      'Xcraft Cloud gives traders a single place to record and study their trading. It captures detailed performance metrics, renders visual charts over trading history, and highlights recurring patterns so users can see what is actually working. Built with Vue and wrapped via Capacitor for mobile, with everything synced live through Supabase.',
    category: 'mobile_ui',
    categoryLabel: 'Web + Mobile App · Finance',
    image: '',
    tags: ['Vue.js', 'Supabase', 'Capacitor', 'Tailwind CSS', 'TypeScript'],
    featured: false,
    highlights: [
      'Detailed performance metrics and visual charting over trade history',
      'Pattern identification to surface recurring trading behaviour',
      'Single codebase shipped to both web and mobile via Capacitor',
      'Live cross-device sync through Supabase',
    ],
  },
  {
    id: 'policy-snap',
    title: 'Policy Snap',
    subtitle: 'Great Eastern — Insurance Summary Generator',
    description:
      'Paste a NotebookLM JSON response and instantly generate a clean A4 insurance policy summary poster — downloadable as PDF, shareable on WhatsApp, or ready to print.',
    longDescription:
      'Policy Snap turns raw AI output into a client-ready document in one step. An agent pastes a NotebookLM JSON response and immediately gets a formatted A4 policy summary poster, ready to download as PDF, send over WhatsApp, or print. It ships as a web app, an Android app, and a Windows desktop application from a shared codebase.',
    category: 'ai_ml',
    categoryLabel: 'AI Tool · Multi-Platform',
    image: '',
    tags: ['Next.js', 'Capacitor', 'Electron', 'Android'],
    featured: false,
    highlights: [
      'One-step conversion from NotebookLM JSON to a print-ready A4 summary',
      'PDF download, WhatsApp sharing, and direct printing',
      'Shipped as web, Android, and Windows desktop from one codebase',
    ],
  },
  {
    id: 'mpt-watch-sales-bot',
    title: 'MPT Watch Sales Bot',
    subtitle: 'Million Precision Time — Retail Assistant',
    description:
      'A sales assistant bot that lets retail staff instantly calculate watch sales, commissions, and discounts, removing manual maths from the shop floor.',
    longDescription:
      'Built for Million Precision Time’s retail team, this bot removes error-prone manual calculation at the point of sale. Staff query it directly and get immediate figures for sale totals, commission, and discounting — speeding up transactions and cutting mistakes during busy periods.',
    category: 'iot_data',
    categoryLabel: 'Chatbot · Retail',
    image: '',
    tags: ['Bot Automation', 'Node.js'],
    featured: false,
    highlights: [
      'Instant sale, commission, and discount calculation for shop-floor staff',
      'Eliminated manual arithmetic and reduced point-of-sale errors',
    ],
  },
  {
    id: 'biometric-attendance',
    title: 'Biometric Attendance System',
    subtitle: 'Fingerprint Recognition & Tamper-Proof Logging',
    description:
      'A high-security attendance tracking system using fingerprint recognition, built with Python and OpenCV for accurate, tamper-proof logging.',
    longDescription:
      'This system replaces sign-in sheets and access cards with biometric verification. Python and OpenCV handle the image processing behind fingerprint recognition, and records are written so they cannot be retroactively altered — giving an attendance log that can actually be trusted.',
    category: 'iot_data',
    categoryLabel: 'Computer Vision · Security',
    image: '',
    tags: ['Python', 'OpenCV', 'Biometrics', 'Image Processing'],
    featured: false,
    highlights: [
      'Fingerprint recognition powered by Python and OpenCV image processing',
      'Tamper-proof logging for a trustworthy attendance record',
    ],
  },
  {
    id: 'ai-retail-manager',
    title: 'AI Retail Manager',
    subtitle: 'Machine Learning Retail Operations',
    description:
      'A retail management solution powered by AI, featuring automated stock tracking, machine-learning demand forecasting, and real-time sales analytics.',
    longDescription:
      'AI Retail Manager applies machine learning to the operational side of retail. It tracks stock automatically, forecasts demand so ordering can be planned rather than reacted to, and surfaces sales analytics in real time — turning day-to-day transaction data into decisions about what to stock and when.',
    category: 'ai_ml',
    categoryLabel: 'AI Platform · Retail',
    image: '',
    tags: ['Python', 'Machine Learning', 'Demand Forecasting', 'Analytics'],
    featured: false,
    highlights: [
      'Automated stock tracking across the retail catalogue',
      'Machine-learning demand forecasting to guide purchasing',
      'Real-time sales analytics dashboard',
    ],
  },
  {
    id: 'conglomerate-website',
    title: 'Conglomerate Website',
    subtitle: 'Conglomerate Consultant Company — Corporate Site',
    description:
      'A modern, professional website for a multinational corporation, presenting its energy, technology, manufacturing, and finance divisions in a clean corporate layout.',
    longDescription:
      'Built for a multinational consultancy, this site presents a complex organisation clearly. A clean layout and corporate palette carry the brand across key operational areas — energy, technology, manufacturing, and finance — with a featured projects section highlighting sustainable energy initiatives and global infrastructure work.',
    category: 'fullstack',
    categoryLabel: 'Website · Corporate',
    image: '',
    tags: ['HTML', 'CSS', 'TSX', 'Supabase', 'GoDaddy'],
    featured: false,
    highlights: [
      'Clear presentation of four distinct corporate divisions',
      'Featured projects section for sustainable energy and infrastructure work',
      'Deployed on a client-managed GoDaddy domain',
    ],
  },
  {
    id: 'sun-tours-roma',
    title: 'Sun Tours Roma',
    subtitle: 'Sun Tours — Italian Tourism Landing Page',
    description:
      'A landing page for Italian tourism built for an Italian client as part of the Sun Tours Virtual Guide initiative.',
    longDescription:
      'Created for an Italian client under the Sun Tours Virtual Guide initiative, this landing page pairs a clean, responsive layout with evocative imagery of Rome and the Italian coast — designed so the destination itself does the selling.',
    category: 'fullstack',
    categoryLabel: 'Website · Travel',
    image: '',
    tags: ['TSX', 'JavaScript', 'CSS', 'Supabase', 'GoDaddy'],
    featured: false,
    highlights: [
      'Delivered for an international client within the Sun Tours Virtual Guide initiative',
      'Responsive landing page pairing design with destination photography',
    ],
  },
  {
    id: 'walletwise',
    title: 'WalletWise',
    subtitle: 'Onyxx Tech — Personal Finance Tracker',
    description:
      'A personal finance tracker for managing wallet transactions, monitoring spending habits, and staying on top of your financial health.',
    longDescription:
      'WalletWise gives everyday users a straightforward view of where their money goes. It records wallet transactions, breaks down spending habits over time, and surfaces the numbers that matter for financial health — built in TypeScript for a fast, reliable experience.',
    category: 'fullstack',
    categoryLabel: 'Web App · Finance',
    image: '',
    tags: ['TypeScript', 'CSS'],
    featured: false,
    highlights: [
      'Wallet transaction management with spending-habit breakdowns',
      'Built in TypeScript for a fast, reliable experience',
    ],
  },
  {
    id: 'carousel-generator',
    title: 'Carousel Generator',
    subtitle: 'Onyxx Tech — Social Media Design Tool',
    description:
      'A web tool that turns written content into styled, presentation-ready social media carousel slides optimised for Instagram and LinkedIn.',
    longDescription:
      'Carousel Generator removes the design bottleneck from social publishing. Users paste in their content and get back consistently branded, presentation-ready carousel slides sized for Instagram, LinkedIn, and beyond — no design tooling or manual layout required.',
    category: 'fullstack',
    categoryLabel: 'Marketing Tool · Social Media',
    image: '',
    tags: ['TypeScript', 'Web App'],
    featured: false,
    highlights: [
      'Content-in, slides-out generation for Instagram and LinkedIn carousels',
      'Consistent branding across every slide with zero design effort',
    ],
  },
];

export const SKILLS: Skill[] = [
  // Data Science & AI
  { name: 'Python', category: 'Data Science & AI', level: 90, iconName: 'Terminal', description: 'Primary language for data analysis, machine learning, scripting, and automation.', highlighted: true },
  { name: 'Data Analysis & Cleaning', category: 'Data Science & AI', level: 88, iconName: 'BarChart3', description: 'Exploratory data analysis, data cleaning, ETL workflows, data mining and warehousing.', highlighted: true },
  { name: 'Machine Learning & Neural Networks', category: 'Data Science & AI', level: 82, iconName: 'Brain', description: 'Supervised and unsupervised learning, neural networks, and predictive modelling.', highlighted: true },
  { name: 'Data Visualization', category: 'Data Science & AI', level: 87, iconName: 'PieChart', description: 'Power BI, Matplotlib, Seaborn, and Plotly for dashboards and analytical reporting.', highlighted: true },
  { name: 'Statistical Analysis & Forecasting', category: 'Data Science & AI', level: 84, iconName: 'BarChart3', description: 'Statistical methods, hypothesis testing, and time series forecasting.' },
  { name: 'R', category: 'Data Science & AI', level: 78, iconName: 'Terminal', description: 'Statistical computing and data analysis for coursework and research projects.' },
  { name: 'NLP & Prompt Engineering', category: 'Data Science & AI', level: 80, iconName: 'Sparkles', description: 'Natural language processing, prompt engineering, and LLM integration with Claude, ChatGPT, and Ollama.' },

  // Full-Stack Engineering
  { name: 'React.js & Next.js', category: 'Full-Stack Engineering', level: 86, iconName: 'Code2', description: 'Component architecture, hooks, routing, and responsive single-page applications.', highlighted: true },
  { name: 'JavaScript & TypeScript', category: 'Full-Stack Engineering', level: 85, iconName: 'FileCode2', description: 'Modern ES syntax, typed application code, and async patterns.', highlighted: true },
  { name: 'Node.js, Express & FastAPI', category: 'Full-Stack Engineering', level: 80, iconName: 'Server', description: 'REST API development, server-side logic, and authentication with JWT and OAuth.', highlighted: true },
  { name: 'Tailwind CSS & Responsive Design', category: 'Full-Stack Engineering', level: 88, iconName: 'Palette', description: 'Utility-first styling, responsive layouts, and accessible interface design.', highlighted: true },
  { name: 'SQL & Database Design', category: 'Full-Stack Engineering', level: 85, iconName: 'Database', description: 'MySQL, MariaDB, PostgreSQL, ERD modelling, normalization, and query optimization.', highlighted: true },
  { name: 'MongoDB, Firebase & Supabase', category: 'Full-Stack Engineering', level: 78, iconName: 'Database', description: 'NoSQL data modelling, realtime databases, authentication, and backend-as-a-service.' },
  { name: 'Java & C/C++', category: 'Full-Stack Engineering', level: 75, iconName: 'FileCode2', description: 'Object-oriented programming, data structures and algorithms from formal coursework.' },
  { name: 'Vue.js', category: 'Full-Stack Engineering', level: 70, iconName: 'Code2', description: 'Component-based front-end development as an alternative to the React ecosystem.' },

  // Cloud & DevOps
  { name: 'Git & GitHub', category: 'Cloud & DevOps', level: 85, iconName: 'GitBranch', description: 'Version control, branching workflows, and collaborative development.' },
  { name: 'Linux Administration', category: 'Cloud & DevOps', level: 80, iconName: 'Monitor', description: 'AlmaLinux, Ubuntu, and WSL2 — shell usage, server configuration, and service management.' },
  { name: 'Docker & Containerization', category: 'Cloud & DevOps', level: 72, iconName: 'Box', description: 'Containerised application setups and isolated development environments.' },
  { name: 'Nginx, Vercel & CI/CD', category: 'Cloud & DevOps', level: 74, iconName: 'Cloud', description: 'Web server configuration, deployment pipelines, and hosting fundamentals.' },

  // IoT & Tools
  { name: 'IT Support & Desktop Engineering', category: 'IoT & Tools', level: 90, iconName: 'Monitor', description: 'Hardware and software installation, troubleshooting, POS support, data recovery, and system upgrades.', highlighted: true },
  { name: 'ESP32, Arduino & Sensors', category: 'IoT & Tools', level: 75, iconName: 'Radio', description: 'Microcontroller programming and sensor integration for embedded projects.' },
  { name: 'Networking & Systems', category: 'IoT & Tools', level: 82, iconName: 'Zap', description: 'TCP/IP, DNS, cross-platform operating systems, and computer security fundamentals.' },
  { name: 'UI/UX Design & Figma', category: 'IoT & Tools', level: 80, iconName: 'Layers', description: 'Wireframing, prototyping, and interface design, plus photo, video, and 3D tooling.' },
];

export const TIMELINE: TimelineItem[] = [
  {
    id: 'sjkt-mount-austin-internship',
    type: 'experience',
    title: 'Data Analyst & Software Developer (Internship)',
    organization: 'SJK(T) Ladang Mount Austin',
    location: 'Johor, Malaysia',
    period: 'May 2026 — August 2026',
    description:
      'Final-year internship combining data analysis with software development — turning school data into usable insight and building the tools to manage it.',
    achievements: [
      'Analysed institutional data and produced reporting to support decision-making',
      'Developed and maintained software to streamline day-to-day administrative workflows',
      'Applied degree-level data analysis and programming skills in a live operational setting',
    ],
    badge: '💼 Internship Completed',
    skills: ['Data Analysis', 'Software Development', 'Python', 'SQL', 'Reporting'],
  },
  {
    id: 'raffles-university',
    type: 'education',
    title: 'Bachelor Degree in Data Science',
    organization: 'Raffles University',
    location: 'Johor, Malaysia',
    period: '2024 — 2026',
    description:
      'Undergraduate degree covering machine learning, statistical analysis, data mining and warehousing, database systems, and applied programming for data science.',
    achievements: [
      'Completed coursework in machine learning, neural networks, and predictive modelling',
      'Studied statistical analysis, time series forecasting, and data visualisation',
      'Applied Python, R, and SQL to practical analytical problems throughout the programme',
    ],
    badge: '🎓 Graduated',
    skills: ['Machine Learning', 'Statistics', 'Python', 'R', 'SQL', 'Data Visualization'],
  },
  {
    id: 'grand-copthorne',
    type: 'experience',
    title: 'Desktop Engineering — IT Department',
    organization: 'Grand Copthorne Waterfront',
    location: 'Singapore',
    period: 'April 2023 — August 2024',
    description:
      'Desktop engineering and IT support for a large hospitality operation, covering workstations, point-of-sale systems, networking, and end-user support.',
    achievements: [
      'Installed, configured, and maintained hardware and software across departments',
      'Troubleshot networking, driver, and system faults in a live 24-hour environment',
      'Managed user accounts, access provisioning, and POS system support',
      'Carried out data recovery and planned system upgrades with minimal disruption',
    ],
    badge: '💼 IT Department',
    skills: ['Desktop Engineering', 'Networking', 'POS Support', 'Windows', 'Hardware', 'User Support'],
  },
  {
    id: 'eyou-technology',
    type: 'experience',
    title: 'Technical Artist',
    organization: 'eYou Technology Sdn Bhd',
    location: 'Johor, Malaysia',
    period: 'September 2022 — December 2022',
    description:
      'Industrial training placement in computer graphics development, producing visual assets and supporting the technical production pipeline.',
    achievements: [
      'Produced and optimised graphical assets for commercial production',
      'Applied UI/UX and multimedia principles to client deliverables',
      'Completed the full practical training requirement of the diploma programme',
    ],
    badge: '🎨 Practical Training',
    skills: ['UI/UX Design', 'Figma', 'Computer Graphics', 'Photo & Video Editing'],
  },
  {
    id: 'crescendo-college',
    type: 'education',
    title: 'Diploma in Computer Science',
    organization: 'Crescendo International College',
    location: 'Johor, Malaysia',
    period: '2020 — 2022',
    description:
      'Diploma covering programming fundamentals, object-oriented design, data structures and algorithms, database systems, and system analysis and design.',
    achievements: [
      'Built a foundation in OOP, data structures, algorithms, and the SDLC',
      'Studied database design including ERD modelling and normalization',
      'Completed industrial training as part of the programme requirements',
    ],
    badge: '🎓 Completed',
    skills: ['Java', 'C/C++', 'Data Structures', 'Database Design', 'System Analysis'],
  },
  {
    id: 'six-star-logistics',
    type: 'experience',
    title: 'Warehouse Assistant',
    organization: 'Six Star Logistics & Trading',
    location: 'Johor, Malaysia',
    period: 'December 2019 — June 2020',
    description:
      'Warehouse and logistics operations role in the transport and trading sector, handling inventory movement and stock accuracy.',
    achievements: [
      'Managed inventory handling and maintained accurate stock records',
      'Coordinated with the team to meet daily dispatch schedules',
      'Left on good terms to continue into higher education',
    ],
    badge: '📦 First Role',
    skills: ['Logistics', 'Inventory Management', 'Operations', 'Teamwork'],
  },
  {
    id: 'smk-taman-pelangi-indah',
    type: 'education',
    title: 'Sijil Pelajaran Malaysia (SPM)',
    organization: 'SMK Taman Pelangi Indah',
    location: 'Johor, Malaysia',
    period: '2015 — 2019',
    description: 'Completed Malaysian secondary education, qualifying for entry into tertiary computer science studies.',
    achievements: ['Completed SPM secondary school certification'],
    badge: '🎓 SPM',
    skills: ['Secondary Education'],
  },
];

// Professional referees from the CV, published with their contact numbers at
// the portfolio owner's request. These numbers belong to other people — make
// sure each referee is happy to be listed publicly before this goes live.
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'ref-yuslizan',
    name: 'Mr. Yuslizan',
    role: 'Manager, IT Department',
    company: 'Grand Copthorne Waterfront, Singapore',
    avatar: '',
    content: 'Direct manager during my desktop engineering role.',
    phone: '+65 9434 5561',
    rating: 0,
  },
  {
    id: 'ref-daina',
    name: 'Miss Daina',
    role: 'Admin',
    company: 'eYou Technology Sdn Bhd',
    avatar: '',
    content: 'Supervised my practical training placement in computer graphics development.',
    phone: '+60 16-893 8980',
    rating: 0,
  },
  {
    id: 'ref-sam',
    name: 'Mr. Sam',
    role: 'Director',
    company: 'Six Star Logistics & Trading',
    avatar: '',
    content: 'Employer during my warehouse and logistics role.',
    phone: '+60 19-766 7643',
    rating: 0,
  },
];

// The FAQ section was removed from the site; kept as an empty export so any
// previously stored content still deserialises cleanly.
export const FREQUENT_QUESTIONS: FaqItem[] = [];
