import { Subject, Author, Category } from '../types';

export const author: Author = {
  name: "Alex Dev",
  role: "Lead Instructor",
  bio: "Building the next generation of software engineers. Specialized in distributed systems and frontend architecture.",
  image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  socials: {
    twitter: "#",
    github: "#",
    linkedin: "#"
  }
};

export const defaultCategories: Category[] = [
  {
    id: "web-dev",
    title: "Web Development",
    description: "Discuss React, Node.js, CSS, and modern web frameworks.",
    color: "from-blue-500 to-cyan-400",
    icon: "Globe"
  },
  {
    id: "algorithms",
    title: "Algorithms",
    description: "Data structures, competitive programming, and optimization techniques.",
    color: "from-purple-500 to-pink-500",
    icon: "Cpu"
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Scalability, distributed systems, and architectural patterns.",
    color: "from-emerald-500 to-teal-400",
    icon: "Server"
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    description: "CI/CD, Docker, Kubernetes, and cloud infrastructure.",
    color: "from-orange-500 to-red-500",
    icon: "Cloud"
  }
];

// Added pendingPosts to fix the Admin page crash
export const pendingPosts = [
  {
    id: "1",
    title: "Understanding React Server Components",
    author_name: "Sarah Smith",
    category: "Web Development",
    created_at: new Date().toISOString(),
    status: "pending",
    tags: ["react", "frontend"],
    content: "Content placeholder...",
    likes: 0
  },
  {
    id: "2",
    title: "Graph Algorithms: BFS vs DFS",
    author_name: "Mike Johnson",
    category: "Algorithms",
    created_at: new Date().toISOString(),
    status: "pending",
    tags: ["graphs", "algorithms"],
    content: "Content placeholder...",
    likes: 0
  }
];

export const subjects: Subject[] = [
  {
    id: "cs-fundamentals",
    title: "CS Fundamentals Bootcamp",
    description: "The absolute essentials of Computer Science. From binary to Big O, master the building blocks of software.",
    icon: "Cpu",
    color: "from-blue-500 to-cyan-400",
    level: "Beginner",
    modules: [
      {
        id: "intro-to-algorithms",
        title: "Module 1: Algorithms & Logic",
        description: "Learn how computers think and solve problems.",
        topics: [
          {
            id: "big-o-notation",
            title: "Understanding Big O Notation",
            readTime: "10 min",
            content: [
              { type: "heading", value: "What is Time Complexity?" },
              { type: "text", value: "Time complexity is a concept in computer science that deals with the quantification of the amount of time taken by a set of code or algorithm to process or run as a function of the amount of input." },
              { type: "note", value: "Big O specifically describes the worst-case scenario, which is crucial for scalable systems." },
              { type: "code", language: "javascript", value: "// O(n) - Linear Time\nfunction findElement(arr, element) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === element) return i;\n  }\n  return -1;\n}" }
            ]
          },
          {
            id: "sorting-basics",
            title: "Sorting Algorithms 101",
            readTime: "15 min",
            content: [
              { type: "heading", value: "Why Sort?" },
              { type: "text", value: "Sorting is fundamental to optimizing search algorithms. A sorted dataset allows for O(log n) search times using Binary Search." }
            ]
          }
        ]
      },
      {
        id: "data-structures-1",
        title: "Module 2: Data Structures",
        description: "How to organize data efficiently.",
        topics: [
          {
            id: "arrays-linked-lists",
            title: "Arrays vs Linked Lists",
            readTime: "12 min",
            content: [
              { type: "heading", value: "Memory Allocation" },
              { type: "text", value: "Arrays require contiguous memory blocks, while Linked Lists can be scattered in memory, connected by pointers." }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "full-stack-react",
    title: "Full Stack React",
    description: "Build modern web applications from scratch using React, Node.js, and PostgreSQL.",
    icon: "Globe",
    color: "from-indigo-500 to-purple-500",
    level: "Intermediate",
    modules: [
      {
        id: "react-core",
        title: "Module 1: React Core Concepts",
        topics: [
          {
            id: "hooks-deep-dive",
            title: "Mastering Hooks",
            readTime: "20 min",
            content: [
              { type: "heading", value: "The Rules of Hooks" },
              { type: "text", value: "Hooks allow you to use state and other React features without writing a class. However, they come with strict rules." }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "system-design",
    title: "System Design Architect",
    description: "Prepare for senior engineering interviews. Learn to design scalable, high-availability systems.",
    icon: "Server",
    color: "from-emerald-500 to-teal-400",
    level: "Advanced",
    modules: [
      {
        id: "scalability",
        title: "Module 1: Scalability Patterns",
        topics: [
          {
            id: "load-balancing",
            title: "Load Balancing Strategies",
            readTime: "15 min",
            content: [
              { type: "heading", value: "Round Robin vs Least Connections" },
              { type: "text", value: "Choosing the right load balancing strategy depends heavily on the nature of your requests." }
            ]
          }
        ]
      }
    ]
  }
];
