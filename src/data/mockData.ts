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
  }
];

export const subjects: Subject[] = [
  {
    id: "system-design-mastery",
    title: "System Design Mastery",
    description: "Learn to design scalable systems like Uber, Netflix, and WhatsApp. From load balancing to database sharding.",
    icon: "Server",
    color: "from-emerald-500 to-teal-400",
    level: "Advanced",
    modules: [
      {
        id: "distributed-caching",
        title: "Module 1: Distributed Caching",
        description: "Speeding up applications with Redis and Memcached.",
        topics: [
          {
            id: "caching-strategies",
            title: "Caching Strategies & Eviction Policies",
            readTime: "12 min",
            content: [
              { type: "text", value: "In the world of large-scale distributed systems, latency is the enemy. Every millisecond counts when you are serving millions of users. This is where caching comes into play—it is the art of storing frequently accessed data in a location that is faster to access than the primary source." },
              { type: "note", value: "A cache hit occurs when the requested data is found in the cache. A cache miss occurs when it is not, requiring a fetch from the primary database." },
              { type: "heading", value: "Why do we need Caching?" },
              { type: "text", value: "Caching is one of the most effective ways to improve system performance. It involves storing copies of frequently accessed data in a temporary storage location (cache) so that future requests for that data can be served faster. By reducing the load on your primary database, you can scale your application to handle significantly more traffic without upgrading your database infrastructure." },
              { type: "image", value: "https://images.unsplash.com/photo-1558494949-efc02570fbc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", caption: "Visual representation of data flow in a distributed system." },
              { type: "divider", value: "" },
              { type: "heading", value: "Cache-Aside Pattern" },
              { type: "text", value: "This is the most common caching strategy. The application code is responsible for loading data into the cache. When the application needs data, it first checks the cache. If the data is found (hit), it is returned. If not (miss), the application queries the database, returns the data to the user, and stores it in the cache for next time." },
              { 
                type: "code", 
                language: "python", 
                value: "def get_user(user_id):\n    # 1. Check Cache\n    user = cache.get(user_id)\n    if user:\n        return user\n\n    # 2. Fetch from DB\n    user = db.query(\"SELECT * FROM users WHERE id = ?\", user_id)\n\n    # 3. Update Cache\n    cache.set(user_id, user, ttl=3600)\n    return user",
                explanation: "In this Python example, we first attempt to retrieve the user from the cache using a unique ID. If that fails (returns None), we fall back to the slower database query. Crucially, we then populate the cache with the result so subsequent requests are fast."
              },
              { type: "heading", value: "Eviction Policies" },
              { type: "text", value: "Caches have limited memory. When the cache is full, we need to remove items to make space for new ones. This process is called eviction. Choosing the right eviction policy is critical for maintaining a high cache hit ratio." },
              { type: "text", value: "Common policies include:\n\n1. **LRU (Least Recently Used):** Discards the least recently used items first. This is generally the best default policy.\n2. **LFU (Least Frequently Used):** Counts how often an item is needed. Good for stable access patterns.\n3. **FIFO (First In First Out):** Evicts items in the order they were added, regardless of usage." },
              { type: "note", value: "LRU is generally the best default policy for most web applications because it adapts well to changing popularity patterns." }
            ]
          },
          {
            id: "consistent-hashing",
            title: "Consistent Hashing",
            readTime: "15 min",
            content: [
              { type: "text", value: "When we distribute a cache across multiple servers, we need a way to determine which server holds a specific key. A simple approach is `hash(key) % N`, where N is the number of servers. However, this breaks down when servers are added or removed." },
              { type: "heading", value: "The Rebalancing Problem" },
              { type: "text", value: "In a distributed cache with N nodes, using modular hashing works fine until you add or remove a node. When N changes, the result of the modulo operation changes for almost every key. This causes a massive cache miss storm, as nearly all keys are remapped to different servers." },
              { type: "heading", value: "How Consistent Hashing Works" },
              { type: "text", value: "Consistent hashing maps both keys and nodes to a circular ring (0 to 2^32-1). A key is assigned to the first node encountered moving clockwise on the ring. When a node is added or removed, only the keys in its immediate vicinity are affected." },
              { 
                type: "code", 
                language: "javascript", 
                value: "// Simplified Concept\nclass ConsistentHash {\n  constructor(nodes, replicas = 3) {\n    this.ring = new SortedMap();\n    nodes.forEach(node => this.addNode(node));\n  }\n\n  addNode(node) {\n    for (let i = 0; i < this.replicas; i++) {\n      const hash = this.hash(node.id + i);\n      this.ring.set(hash, node);\n    }\n  }\n\n  getNode(key) {\n    const hash = this.hash(key);\n    // Find first node > hash in the ring\n    return this.ring.findNext(hash);\n  }\n}",
                explanation: "This snippet demonstrates the core concept. We map nodes to multiple points on a ring (using 'replicas' or virtual nodes) to ensure even distribution. When looking up a key, we find the next available node on the ring."
              }
            ]
          }
        ]
      }
    ]
  },
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
          }
        ]
      }
    ]
  }
];
