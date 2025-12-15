import { PortfolioItem } from '../types';

export const portfolioMockItems: PortfolioItem[] = [
  // --- News & Updates ---
  {
    id: "news-1",
    section: "news",
    title: "Paper Accepted at NeurIPS 2025",
    subtitle: "Conference",
    period: "Dec 2025",
    display_order: 1,
    details: {}
  },
  {
    id: "news-2",
    section: "news",
    title: "Joined Google DeepMind as Research Intern",
    subtitle: "Career",
    period: "Summer 2025",
    display_order: 2,
    details: {}
  },
  {
    id: "news-3",
    section: "news",
    title: "Won 1st Place at MIT Hackathon",
    subtitle: "Award",
    period: "Oct 2024",
    display_order: 3,
    details: {}
  },
  {
    id: "news-4",
    section: "news",
    title: "Released v2.0 of AlgoVisualizer",
    subtitle: "Project",
    period: "Sep 2024",
    display_order: 4,
    details: {}
  },

  // --- Research Experience ---
  {
    id: "res-1",
    section: "research",
    title: "Optimizing Large Language Models for Edge Devices",
    subtitle: "Graduate Researcher",
    organization: "AI Systems Lab, MIT",
    period: "Jan 2024 - Present",
    description: "Investigating quantization techniques to run 7B+ parameter models on consumer hardware with minimal accuracy loss. Developing a novel pruning algorithm that reduces memory footprint by 40%.",
    display_order: 1,
    details: {
      status: "ongoing",
      advisor: "Dr. Alice Chen",
      team: ["John Doe", "Sarah Lee"],
      tags: ["LLMs", "Quantization", "PyTorch"],
      links: { scholar: "#" }
    }
  },
  {
    id: "res-3",
    section: "research",
    title: "Autonomous Drone Navigation in Cluttered Environments",
    subtitle: "Research Assistant",
    organization: "Robotics Institute",
    period: "Sep 2023 - Present",
    description: "Developing reinforcement learning agents for drone navigation in unstructured environments. Focusing on sim-to-real transfer improvements.",
    display_order: 2,
    details: {
      status: "ongoing",
      advisor: "Prof. Robert Wright",
      team: ["Emily Zhang"],
      tags: ["RL", "Robotics", "Python"],
      links: {}
    }
  },
  {
    id: "res-2",
    section: "research",
    title: "Distributed Graph Processing Framework",
    subtitle: "Undergraduate Researcher",
    organization: "Systems Group, Berkeley",
    period: "Jan 2023 - Dec 2023",
    description: "Designed a distributed graph processing engine capable of handling billion-edge graphs. Achieved 2x speedup over existing solutions by optimizing memory access patterns.",
    display_order: 3,
    details: {
      status: "completed",
      advisor: "Prof. David Patterson",
      team: ["Mike Ross"],
      tags: ["C++", "MPI", "Distributed Systems"],
      links: {
        scholar: "https://scholar.google.com",
        github: "https://github.com",
        paper: "#"
      }
    }
  },

  // --- Projects ---
  {
    id: "proj-1",
    section: "project",
    title: "NeuroFlow",
    description: "A real-time brain-computer interface visualization tool. Processes EEG signals to visualize cognitive load in real-time using WebGL.",
    display_order: 1,
    details: {
      type: "Industry",
      imageGradient: "from-pink-500 to-rose-500",
      tags: ["React", "WebGL", "Python", "WebSockets"],
      links: {
        github: "https://github.com",
        demo: "#"
      }
    }
  },
  {
    id: "proj-2",
    section: "project",
    title: "AlgoVisualizer",
    description: "Interactive platform for visualizing complex sorting and graph algorithms. Used by over 10,000 students worldwide.",
    display_order: 2,
    details: {
      type: "Industry",
      imageGradient: "from-blue-500 to-cyan-500",
      tags: ["TypeScript", "D3.js", "Next.js"],
      links: {
        github: "https://github.com"
      }
    }
  },
  {
    id: "proj-3",
    section: "project",
    title: "Mini-C Compiler",
    description: "Built a fully functional compiler for a subset of C language. Implemented lexical analysis, parsing, semantic analysis, and code generation.",
    display_order: 3,
    details: {
      type: "Course",
      imageGradient: "from-emerald-500 to-teal-500",
      tags: ["C++", "LLVM", "Bison"],
      links: {
        github: "https://github.com"
      }
    }
  },
  {
    id: "proj-4",
    section: "project",
    title: "Distributed Key-Value Store",
    description: "Implemented a fault-tolerant, sharded key-value store based on the Raft consensus algorithm.",
    display_order: 4,
    details: {
      type: "Course",
      imageGradient: "from-orange-500 to-red-500",
      tags: ["Go", "Distributed Systems", "Raft"],
      links: {
        github: "https://github.com"
      }
    }
  },

  // --- Work Experience ---
  {
    id: "exp-1",
    section: "experience",
    title: "Software Engineer Intern",
    organization: "Meta",
    period: "Summer 2024",
    description: "Optimized the React reconciliation algorithm for the main news feed, reducing TTI by 15%. Collaborated with the design system team to implement new accessibility primitives.",
    display_order: 1,
    details: {}
  },
  {
    id: "exp-2",
    section: "experience",
    title: "Full Stack Developer",
    organization: "TechStart Inc.",
    period: "2022 - 2023",
    description: "Led the migration of a legacy monolithic application to a microservices architecture using Node.js and Kubernetes.",
    display_order: 2,
    details: {}
  },

  // --- Education ---
  {
    id: "edu-1",
    section: "education",
    title: "M.S. in Computer Science",
    subtitle: "Specialization in AI Systems",
    organization: "Stanford University",
    period: "2024 - 2026",
    description: "GPA: 4.0/4.0. Relevant Coursework: Advanced Distributed Systems, Deep Learning, Computer Vision.",
    display_order: 1,
    details: {}
  },
  {
    id: "edu-2",
    section: "education",
    title: "B.S. in Computer Science",
    subtitle: "Minor in Mathematics",
    organization: "University of Waterloo",
    period: "2020 - 2024",
    description: "Dean's List all semesters. President of the Computer Science Club.",
    display_order: 2,
    details: {}
  },

  // --- Honors ---
  {
    id: "hon-1",
    section: "honor",
    title: "ACM ICPC World Finalist",
    organization: "International Collegiate Programming Contest",
    period: "2023",
    display_order: 1,
    details: {
      icon: "Trophy"
    }
  },
  {
    id: "hon-2",
    section: "honor",
    title: "Best Paper Award",
    organization: "IEEE CVPR 2024",
    period: "2024",
    display_order: 2,
    details: {
      icon: "Award"
    }
  },

  // --- Leadership ---
  {
    id: "lead-1",
    section: "leadership",
    title: "President",
    organization: "University CS Club",
    description: "Organized 5 hackathons with over 500 participants. Mentored 50+ junior students in career development.",
    display_order: 1,
    details: {}
  },
  {
    id: "lead-2",
    section: "leadership",
    title: "Technical Lead",
    organization: "Open Source Initiative",
    description: "Led a team of 10 developers to contribute to major open source projects including React and TensorFlow.",
    display_order: 2,
    details: {}
  }
];
