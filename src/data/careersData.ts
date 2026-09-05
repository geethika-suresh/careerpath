import { Career } from '../types.ts';

export const CAREERS_DATA: Career[] = [
  {
    id: 'frontend-developer',
    name: 'Frontend Developer',
    category: 'Web Development',
    description: 'Designs and implements responsive, accessible, and dynamic user interfaces for modern web applications using cutting-edge client technologies.',
    marketOutlook: 'High Demand across startups, product companies, and MNCs',
    averageSalaryIndia: '₹4.5L - ₹10L per annum for freshers/juniors',
    requiredSkills: [
      'HTML',
      'CSS',
      'JavaScript',
      'React',
      'Git & GitHub',
      'REST APIs',
      'UI/UX'
    ],
    coreInterests: [
      'Frontend Development',
      'Web Development',
      'UI/UX Design'
    ],
    roadmap: [
      {
        stepNumber: 1,
        skill: 'HTML',
        shortExplanation: 'Learn semantic HTML5 elements, web accessibility standards (ARIA), forms, and clean document structure.',
        category: 'fundamental'
      },
      {
        stepNumber: 2,
        skill: 'CSS',
        shortExplanation: 'Master CSS Flexbox, CSS Grid, media queries, responsive design principles, and modern utility-first CSS (Tailwind).',
        category: 'fundamental'
      },
      {
        stepNumber: 3,
        skill: 'JavaScript',
        shortExplanation: 'Deep dive into ES6+ features, asynchronous programming (Promises, async/await), DOM manipulation, and event handling.',
        category: 'core'
      },
      {
        stepNumber: 4,
        skill: 'Git & GitHub',
        shortExplanation: 'Version control fundamentals, branching workflows, pull requests, commit best practices, and collaborative open-source workflows.',
        category: 'tool'
      },
      {
        stepNumber: 5,
        skill: 'React',
        shortExplanation: 'Component lifecycle, hooks (useState, useEffect, useMemo), state management, routing, and modern frontend architecture.',
        category: 'framework'
      },
      {
        stepNumber: 6,
        skill: 'REST APIs',
        shortExplanation: 'Connecting client UIs to backend endpoints, handling HTTP methods, JSON data parsing, error boundaries, and loading skeletons.',
        category: 'core'
      },
      {
        stepNumber: 7,
        skill: 'UI/UX',
        shortExplanation: 'Color theory, typography hierarchy, mobile-first design, micro-interactions, and user-centric usability testing.',
        category: 'core'
      },
      {
        stepNumber: 8,
        skill: 'Frontend Project Portfolio',
        shortExplanation: 'Build and deploy full-fledged web applications with responsive design and clean, documented source code.',
        category: 'project'
      },
      {
        stepNumber: 9,
        skill: 'Technical Interview Preparation',
        shortExplanation: 'Frontend coding challenges, JavaScript output questions, React design patterns, and mock behavioral interviews.',
        category: 'interview'
      }
    ],
    recommendedProjects: [
      {
        title: 'Personal Developer Portfolio',
        description: 'Responsive portfolio website showcasing projects, resume download, and interactive contact form.',
        difficulty: 'Beginner',
        techStack: ['HTML', 'CSS', 'JavaScript']
      },
      {
        title: 'E-commerce Storefront',
        description: 'Dynamic product catalog with category filters, shopping cart state management, and simulated checkout flow.',
        difficulty: 'Intermediate',
        techStack: ['React', 'Tailwind CSS', 'REST APIs']
      },
      {
        title: 'Real-time Analytics Dashboard',
        description: 'Interactive analytical dashboard with customizable theme, data visualization widgets, and API polling.',
        difficulty: 'Advanced',
        techStack: ['React', 'Chart.js', 'REST APIs', 'Git & GitHub']
      }
    ]
  },
  {
    id: 'backend-developer',
    name: 'Backend Developer',
    category: 'Software Engineering',
    description: 'Builds robust server-side architectures, RESTful APIs, database schemas, secure authentication, and scalable background services.',
    marketOutlook: 'Crucial for scalable applications, SaaS products, and enterprise cloud solutions',
    averageSalaryIndia: '₹5L - ₹12L per annum for freshers/juniors',
    requiredSkills: [
      'JavaScript',
      'Node.js',
      'Express.js',
      'REST APIs',
      'MongoDB',
      'Git & GitHub',
      'SQL'
    ],
    coreInterests: [
      'Backend Development',
      'Software Development',
      'Web Development'
    ],
    roadmap: [
      {
        stepNumber: 1,
        skill: 'JavaScript',
        shortExplanation: 'Solidify JavaScript runtime concepts, event loop, closures, Node module resolution, and asynchronous flow control.',
        category: 'fundamental'
      },
      {
        stepNumber: 2,
        skill: 'Node.js',
        shortExplanation: 'Understand server runtimes, file system streams, npm package management, and environment configurations.',
        category: 'core'
      },
      {
        stepNumber: 3,
        skill: 'Express.js',
        shortExplanation: 'Routing, middleware architectures, request validation, error handling middleware, and rate limiting.',
        category: 'framework'
      },
      {
        stepNumber: 4,
        skill: 'REST APIs',
        shortExplanation: 'REST conventions, status codes, query filtering, pagination, and API documentation with OpenAPI/Swagger.',
        category: 'core'
      },
      {
        stepNumber: 5,
        skill: 'MongoDB',
        shortExplanation: 'NoSQL document modeling, Mongoose schemas, indexing strategies, aggregation pipelines, and cloud database hosting.',
        category: 'core'
      },
      {
        stepNumber: 6,
        skill: 'SQL',
        shortExplanation: 'Relational data modeling, table normalization, joins, indexes, foreign key constraints, and transactional queries.',
        category: 'core'
      },
      {
        stepNumber: 7,
        skill: 'Git & GitHub',
        shortExplanation: 'Version control, git hooks, CI/CD pipeline triggers, release tagging, and issue management.',
        category: 'tool'
      },
      {
        stepNumber: 8,
        skill: 'Backend Services Project',
        shortExplanation: 'Develop an end-to-end backend system featuring JWT authentication, role-based access control, and database persistence.',
        category: 'project'
      },
      {
        stepNumber: 9,
        skill: 'System Design & Backend Interviews',
        shortExplanation: 'API design questions, database indexing tradeoffs, caching with Redis, and backend architectural problem solving.',
        category: 'interview'
      }
    ],
    recommendedProjects: [
      {
        title: 'RESTful Task Management API',
        description: 'CRUD REST API with schema validation, filtering by priority and dates, and persistent database storage.',
        difficulty: 'Beginner',
        techStack: ['Node.js', 'Express.js', 'MongoDB']
      },
      {
        title: 'Secure JWT Authentication & Role-Based System',
        description: 'User registration, password hashing (bcrypt), token refresh workflows, and role-based route guards.',
        difficulty: 'Intermediate',
        techStack: ['Node.js', 'Express.js', 'REST APIs', 'MongoDB']
      },
      {
        title: 'Job Portal Backend & Application Tracker',
        description: 'Full backend featuring applicant tracking, job postings, resume uploads, and administrative metrics endpoints.',
        difficulty: 'Advanced',
        techStack: ['Node.js', 'Express.js', 'MongoDB', 'SQL', 'Git & GitHub']
      }
    ]
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    category: 'Data & Analytics',
    description: 'Inspects, cleans, transforms, and models data to uncover actionable business insights, identify trends, and power executive decisions.',
    marketOutlook: 'High Demand across consulting, fintech, e-commerce, and healthcare sectors',
    averageSalaryIndia: '₹4.5L - ₹9.5L per annum for freshers/juniors',
    requiredSkills: [
      'Excel',
      'SQL',
      'Python',
      'Data Analytics',
      'Data Structures & Algorithms'
    ],
    coreInterests: [
      'Data Analytics',
      'Artificial Intelligence',
      'Machine Learning'
    ],
    roadmap: [
      {
        stepNumber: 1,
        skill: 'Excel',
        shortExplanation: 'Advanced formulas (XLOOKUP, INDEX/MATCH), pivot tables, conditional formatting, data cleaning, and scenario modeling.',
        category: 'tool'
      },
      {
        stepNumber: 2,
        skill: 'SQL',
        shortExplanation: 'Master complex queries, aggregations, window functions, CTEs (Common Table Expressions), subqueries, and table joins.',
        category: 'core'
      },
      {
        stepNumber: 3,
        skill: 'Python',
        shortExplanation: 'Python fundamentals, data manipulation with Pandas, numerical operations with NumPy, and scripting automation.',
        category: 'core'
      },
      {
        stepNumber: 4,
        skill: 'Data Analytics',
        shortExplanation: 'Exploratory Data Analysis (EDA), identifying correlations, handling missing values, and testing statistical hypotheses.',
        category: 'fundamental'
      },
      {
        stepNumber: 5,
        skill: 'Data Visualization & BI',
        shortExplanation: 'Creating compelling charts, interactive executive dashboards (Power BI / Tableau concepts), and storytelling with metrics.',
        category: 'tool'
      },
      {
        stepNumber: 6,
        skill: 'Data Structures & Algorithms',
        shortExplanation: 'Core data handling paradigms, time complexity tradeoffs, efficient sorting and filtering on large tabular datasets.',
        category: 'fundamental'
      },
      {
        stepNumber: 7,
        skill: 'Comprehensive Analytics Project',
        shortExplanation: 'Extract raw multi-source business data, clean and transform in Python, query with SQL, and present a business insight deck.',
        category: 'project'
      },
      {
        stepNumber: 8,
        skill: 'Data Case Study & Interview Prep',
        shortExplanation: 'SQL live coding tests, product sense questions, business metric definitions (CAC, LTV, Retention, Churn), and presentation skills.',
        category: 'interview'
      }
    ],
    recommendedProjects: [
      {
        title: 'Sales Performance Dashboard',
        description: 'Interactive dashboard analyzing regional revenue, product profit margins, and month-over-month growth trends.',
        difficulty: 'Beginner',
        techStack: ['Excel', 'Data Analytics', 'SQL']
      },
      {
        title: 'Student Performance & Retention Analysis',
        description: 'Exploratory data analysis of academic scores to identify key indicators influencing student graduation outcomes.',
        difficulty: 'Intermediate',
        techStack: ['Python', 'SQL', 'Data Analytics']
      },
      {
        title: 'E-commerce Customer Segmentation & Churn Analysis',
        description: 'RFM (Recency, Frequency, Monetary) analysis and predictive customer churn modeling from transactional logs.',
        difficulty: 'Advanced',
        techStack: ['Python', 'SQL', 'Data Analytics', 'Machine Learning']
      }
    ]
  },
  {
    id: 'ui-ux-designer',
    name: 'UI/UX Designer',
    category: 'Design & Human-Computer Interaction',
    description: 'Crafts intuitive, empathetic user journeys, interactive wireframes, design systems, and beautiful prototypes that solve user pain points.',
    marketOutlook: 'Rapidly growing discipline as companies prioritize exceptional digital product experiences',
    averageSalaryIndia: '₹4.5L - ₹10L per annum for freshers/juniors',
    requiredSkills: [
      'UI/UX',
      'HTML',
      'CSS',
      'Git & GitHub'
    ],
    coreInterests: [
      'UI/UX Design',
      'Frontend Development',
      'Web Development'
    ],
    roadmap: [
      {
        stepNumber: 1,
        skill: 'UI/UX Principles',
        shortExplanation: 'UX laws (Fitts law, Hick law, Jakob law), user empathy mapping, information architecture, and design thinking workflows.',
        category: 'fundamental'
      },
      {
        stepNumber: 2,
        skill: 'Figma & Design Systems',
        shortExplanation: 'Auto-layout, responsive constraints, components, design tokens, color palette systems, and typography scaling.',
        category: 'tool'
      },
      {
        stepNumber: 3,
        skill: 'Wireframing & Prototyping',
        shortExplanation: 'Low-fidelity wireframing to test flows rapidly, followed by high-fidelity interactive clickable prototypes with micro-animations.',
        category: 'core'
      },
      {
        stepNumber: 4,
        skill: 'HTML',
        shortExplanation: 'Understanding the web medium: semantic markup, form controls, layout flow, and accessible web standards.',
        category: 'fundamental'
      },
      {
        stepNumber: 5,
        skill: 'CSS',
        shortExplanation: 'Translating visual designs into code: box model, CSS Grid, Flexbox, responsive breakpoints, and animations.',
        category: 'fundamental'
      },
      {
        stepNumber: 6,
        skill: 'User Testing & Usability Audits',
        shortExplanation: 'Conducting qualitative user interviews, usability testing sessions, accessibility audits (contrast ratios), and iterating on feedback.',
        category: 'core'
      },
      {
        stepNumber: 7,
        skill: 'UI/UX Case Study Portfolio',
        shortExplanation: 'Documenting complete design process from problem statement, persona creation, wireframes, iterations, to final UI.',
        category: 'project'
      },
      {
        stepNumber: 8,
        skill: 'Design Review & Portfolio Defense Prep',
        shortExplanation: 'Presenting design rationale clearly, defending trade-offs, whiteboard design challenge exercises, and critique handling.',
        category: 'interview'
      }
    ],
    recommendedProjects: [
      {
        title: 'Campus Food Delivery Mobile App Design',
        description: 'Complete mobile UX flow with student order tracking, dietary filters, and frictionless checkout prototype.',
        difficulty: 'Beginner',
        techStack: ['UI/UX', 'Figma', 'Wireframing']
      },
      {
        title: 'College Portal Redesign Case Study',
        description: 'Full usability audit and modernized UI redesign of a legacy student portal focusing on registration and fee payment.',
        difficulty: 'Intermediate',
        techStack: ['UI/UX', 'User Research', 'Figma', 'CSS']
      },
      {
        title: 'Career Tech Design System & Component Library',
        description: 'Modular design system featuring dark/light modes, accessible states, typography scale, and responsive guidelines.',
        difficulty: 'Advanced',
        techStack: ['UI/UX', 'Figma', 'HTML', 'CSS']
      }
    ]
  },
  {
    id: 'software-developer',
    name: 'Software Developer',
    category: 'Core Computer Science & Engineering',
    description: 'Engineers reliable, maintainable software systems applying object-oriented design, algorithmic efficiency, and full-cycle software engineering.',
    marketOutlook: 'Core foundation across all tech giants, product firms, IT services, and fintech companies',
    averageSalaryIndia: '₹6L - ₹14L per annum for freshers/juniors',
    requiredSkills: [
      'Data Structures & Algorithms',
      'Java',
      'C++',
      'SQL',
      'Git & GitHub',
      'REST APIs'
    ],
    coreInterests: [
      'Software Development',
      'Backend Development',
      'Cloud Computing'
    ],
    roadmap: [
      {
        stepNumber: 1,
        skill: 'Object-Oriented Programming (Java / C++)',
        shortExplanation: 'Encapsulation, inheritance, polymorphism, abstraction, memory management, and clean code principles.',
        category: 'fundamental'
      },
      {
        stepNumber: 2,
        skill: 'Data Structures & Algorithms',
        shortExplanation: 'Arrays, linked lists, stacks, queues, trees, graphs, hashing, sorting, binary search, dynamic programming, and Big-O notation.',
        category: 'core'
      },
      {
        stepNumber: 3,
        skill: 'SQL',
        shortExplanation: 'Relational database schema design, ACID transactions, complex joins, indexing, and query optimization.',
        category: 'core'
      },
      {
        stepNumber: 4,
        skill: 'Git & GitHub',
        shortExplanation: 'Branching strategies, resolving merge conflicts, collaborative pull requests, code reviews, and project management.',
        category: 'tool'
      },
      {
        stepNumber: 5,
        skill: 'REST APIs',
        shortExplanation: 'Client-server communications, JSON serialization, API contracts, HTTP methods, and status codes.',
        category: 'core'
      },
      {
        stepNumber: 6,
        skill: 'Software Architecture & Design Patterns',
        shortExplanation: 'SOLID principles, Factory, Singleton, Observer, MVC patterns, and modular project organization.',
        category: 'core'
      },
      {
        stepNumber: 7,
        skill: 'Production-Grade Software Project',
        shortExplanation: 'End-to-end software system integrating OOP backend, persistent database, unit testing suite, and CI pipeline.',
        category: 'project'
      },
      {
        stepNumber: 8,
        skill: 'Coding Interview & LeetCode Prep',
        shortExplanation: 'Timed technical problem solving, system design fundamentals, concurrency, and behavioral interview stories.',
        category: 'interview'
      }
    ],
    recommendedProjects: [
      {
        title: 'Student Record Management System',
        description: 'Robust console or GUI application managing student enrollments, grade point calculations, and persistent file/DB storage.',
        difficulty: 'Beginner',
        techStack: ['Java', 'SQL', 'OOP']
      },
      {
        title: 'Task & Workflow Management Engine',
        description: 'Multi-threaded task scheduler application supporting priority queues, recurring cron tasks, and execution logs.',
        difficulty: 'Intermediate',
        techStack: ['Java', 'Data Structures & Algorithms', 'SQL', 'Git & GitHub']
      },
      {
        title: 'Distributed Job & Resource Allocator',
        description: 'Scalable service managing worker pools, job queues, load balancing algorithms, and REST API telemetry.',
        difficulty: 'Advanced',
        techStack: ['Java', 'C++', 'Data Structures & Algorithms', 'REST APIs']
      }
    ]
  },
  {
    id: 'ai-ml-engineer',
    name: 'AI / Machine Learning Engineer',
    category: 'Artificial Intelligence',
    description: 'Builds, trains, and deploys intelligent models, neural networks, and data-driven systems to automate complex problem solving.',
    marketOutlook: 'Explosive growth with generative AI, intelligent automation, and predictive modeling',
    averageSalaryIndia: '₹6L - ₹15L per annum for freshers/juniors',
    requiredSkills: [
      'Python',
      'Machine Learning',
      'Data Structures & Algorithms',
      'SQL',
      'REST APIs'
    ],
    coreInterests: [
      'Artificial Intelligence',
      'Machine Learning',
      'Data Analytics'
    ],
    roadmap: [
      {
        stepNumber: 1,
        skill: 'Python',
        shortExplanation: 'Python proficiency, object-oriented concepts, NumPy for matrix operations, Pandas for dataframe manipulation.',
        category: 'fundamental'
      },
      {
        stepNumber: 2,
        skill: 'Data Structures & Algorithms',
        shortExplanation: 'Algorithmic complexity, tree/graph traversal, and optimization methods needed for data processing pipelines.',
        category: 'fundamental'
      },
      {
        stepNumber: 3,
        skill: 'Machine Learning',
        shortExplanation: 'Supervised & unsupervised learning algorithms (Linear Regression, Decision Trees, Random Forests, K-Means), evaluation metrics.',
        category: 'core'
      },
      {
        stepNumber: 4,
        skill: 'Deep Learning & Neural Networks',
        shortExplanation: 'Backpropagation, CNNs, RNNs/Transformers basics, PyTorch/TensorFlow frameworks, and transfer learning.',
        category: 'core'
      },
      {
        stepNumber: 5,
        skill: 'REST APIs & Model Deployment',
        shortExplanation: 'Wrapping trained machine learning models in FastAPI or Express services for real-time inference serving.',
        category: 'tool'
      },
      {
        stepNumber: 6,
        skill: 'Applied AI Portfolio Project',
        shortExplanation: 'Train and host an end-to-end intelligent prediction or NLP application with a web frontend.',
        category: 'project'
      },
      {
        stepNumber: 7,
        skill: 'AI/ML Technical Interview Prep',
        shortExplanation: 'Mathematical intuition behind cost functions, bias-variance tradeoff, regularization, and live ML system design.',
        category: 'interview'
      }
    ],
    recommendedProjects: [
      {
        title: 'House Price / Salary Predictor',
        description: 'Regression model with exploratory feature engineering and web dashboard interface.',
        difficulty: 'Beginner',
        techStack: ['Python', 'Machine Learning', 'Data Analytics']
      },
      {
        title: 'Customer Sentiment Analysis Tool',
        description: 'NLP classification pipeline analyzing customer feedback and categorizing emotional sentiment in real time.',
        difficulty: 'Intermediate',
        techStack: ['Python', 'Machine Learning', 'REST APIs']
      },
      {
        title: 'Intelligent Career Recommendation Engine',
        description: 'Semantic skill similarity matcher and recommendation system built on vector embeddings and Python APIs.',
        difficulty: 'Advanced',
        techStack: ['Python', 'Machine Learning', 'REST APIs', 'SQL']
      }
    ]
  }
];

export const BRANCH_OPTIONS = [
  'Computer Science Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other'
];

export const YEAR_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  'Final Year',
  'Graduate'
];

export const SKILL_OPTIONS = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C',
  'C++',
  'SQL',
  'MongoDB',
  'Git & GitHub',
  'Excel',
  'Machine Learning',
  'UI/UX',
  'REST APIs',
  'Data Structures & Algorithms',
  'Cloud Computing'
];

export const INTEREST_OPTIONS = [
  'Web Development',
  'Software Development',
  'Frontend Development',
  'Backend Development',
  'Data Analytics',
  'Artificial Intelligence',
  'Machine Learning',
  'UI/UX Design',
  'Cloud Computing'
];
