// Expanded lesson content — Phase 3
// Covers ALL remaining gaps: Python, VS Code, WHMCS deep, more SQL, GitHub deep,
// Waterfall/Agile deep, hosting deep, networking deep, more cyber tools,
// more AI/ML, more web tech, more game dev, more maths, more systems
import type { LessonStep } from "./lessons";

function q(title: string, question: string, options: { label: string; text: string }[], correct: string, explanation: string, difficulty: "easy" | "medium" | "hard" = "medium"): LessonStep {
  return { type: "quiz", title, difficulty, question, options, correctAnswer: correct, explanation };
}

function t(title: string, prompt: string, code: string, explanation: string, difficulty: "easy" | "medium" | "hard" = "easy"): LessonStep {
  return { type: "typing", title, difficulty, prompt, codeToType: code, explanation };
}

// ===================== SYSTEMS ANALYSIS DEEP =====================
export const systemsDeepContent: Record<string, LessonStep[]> = {
  "waterfall-model": [
    q("Waterfall Overview", "What is the Waterfall model?", [{ label: "A", text: "A sequential, phase-based SDLC where each phase completes before the next begins" }, { label: "B", text: "An iterative approach" }, { label: "C", text: "A testing method" }], "A", "Waterfall flows downward: Requirements → Design → Implementation → Testing → Deployment → Maintenance."),
    t("Waterfall Phases", "Type all Waterfall phases!", "1. Requirements Analysis\n2. System Design\n3. Implementation (Coding)\n4. Integration & Testing\n5. Deployment\n6. Maintenance", "Each phase must be completed and signed off before moving to the next. No going back.", "easy"),
    q("Waterfall Strengths", "When is Waterfall appropriate?", [{ label: "A", text: "When requirements are well-understood, stable, and unlikely to change" }, { label: "B", text: "For all projects" }, { label: "C", text: "When requirements are unknown" }], "A", "Waterfall works for: government contracts, safety-critical systems, regulated industries."),
    q("Waterfall Weaknesses", "What is the biggest weakness of Waterfall?", [{ label: "A", text: "Late discovery of issues — testing happens only at the end" }, { label: "B", text: "Too many meetings" }, { label: "C", text: "Too fast" }], "A", "If requirements were wrong, you only find out after coding is done. Changes are very expensive."),
    t("Waterfall vs Agile", "Compare Waterfall and Agile!", "Waterfall: Plan → Build → Test → Deploy (linear)\nAgile: Plan → Build → Test → Deploy (repeated sprints)\n\nWaterfall = predictive, Agile = adaptive", "Waterfall plans everything upfront; Agile adapts as requirements evolve.", "medium"),
  ],
  "agile-intro": [
    q("Agile Manifesto", "What are the four values of the Agile Manifesto?", [{ label: "A", text: "Individuals over processes, Working software over docs, Collaboration over contracts, Responding to change over following a plan" }, { label: "B", text: "Speed, cost, quality, scope" }, { label: "C", text: "Plan, build, test, deploy" }], "A", "The Agile Manifesto (2001) prioritizes people, working software, collaboration, and adaptability."),
    t("Agile Values", "Type the 4 Agile values!", "1. Individuals & interactions > processes & tools\n2. Working software > comprehensive documentation\n3. Customer collaboration > contract negotiation\n4. Responding to change > following a plan", "Values on the right still matter — we just value the left items MORE.", "easy"),
    q("Agile Principles", "How many principles does the Agile Manifesto have?", [{ label: "A", text: "12 principles" }, { label: "B", text: "4 principles" }, { label: "C", text: "8 principles" }], "A", "12 principles including: deliver working software frequently, welcome change, simplicity, self-organizing teams."),
    t("Agile vs Traditional", "Type Agile vs Traditional differences!", "Agile: Iterative, adaptive, customer-driven\nTraditional: Sequential, predictive, plan-driven\n\nAgile: Small releases every 2-4 weeks\nTraditional: One big release at the end", "Agile delivers value incrementally; traditional delivers all at once.", "medium"),
  ],
  "scrum-framework": [
    q("Scrum Events", "What are the 5 Scrum events?", [{ label: "A", text: "Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective" }, { label: "B", text: "Plan, Code, Test, Deploy, Release" }, { label: "C", text: "Meeting, Standup, Review, Demo, Party" }], "A", "Each event is time-boxed. Sprint = 1-4 weeks. Planning = 8hrs max. Daily = 15min."),
    t("Scrum Artifacts", "Type Scrum artifacts!", "Product Backlog: Ordered list of everything needed\nSprint Backlog: Items selected for this sprint\nIncrement: The sum of completed backlog items\n\nDefinition of Done: Shared quality standard", "The Product Owner owns the backlog; the team owns the sprint backlog.", "medium"),
    q("Sprint Length", "How long is a typical sprint?", [{ label: "A", text: "2 weeks (most common), but can be 1-4 weeks" }, { label: "B", text: "6 months" }, { label: "C", text: "1 day" }], "A", "Shorter sprints = faster feedback. 2 weeks is the industry standard."),
    t("Scrum Roles", "Type the 3 Scrum roles!", "Product Owner: Maximizes product value, owns backlog\nScrum Master: Facilitates Scrum, removes impediments\nDevelopers: Self-organizing team that builds the increment", "No project manager in Scrum — the team self-organizes.", "easy"),
  ],
  "v-model": [
    q("V-Model Structure", "How does the V-Model extend Waterfall?", [{ label: "A", text: "Each development phase has a corresponding testing phase on the other side of the V" }, { label: "B", text: "It's identical to Waterfall" }, { label: "C", text: "It has no testing" }], "A", "Left side = development (requirements → design → code). Right side = testing (unit → integration → system → acceptance)."),
    t("V-Model Mapping", "Type V-Model phase pairs!", "Requirements Analysis ←→ Acceptance Testing\nSystem Design ←→ System Testing\nArchitecture Design ←→ Integration Testing\nModule Design ←→ Unit Testing\n\nCoding sits at the bottom of the V", "Each left phase creates tests for its corresponding right phase.", "medium"),
  ],
  "spiral-model": [
    q("Spiral Model", "What makes the Spiral model unique?", [{ label: "A", text: "It's risk-driven — each spiral loop includes risk analysis before proceeding" }, { label: "B", text: "It has no planning" }, { label: "C", text: "It's the fastest model" }], "A", "Each loop: 1) Determine objectives, 2) Identify risks, 3) Develop & test, 4) Plan next iteration."),
    t("Spiral Quadrants", "Type the 4 Spiral quadrants!", "Q1: Determine objectives, alternatives, constraints\nQ2: Evaluate alternatives, identify & resolve risks\nQ3: Develop and verify next-level product\nQ4: Plan next phases and review", "Spiral is ideal for large, complex, high-risk projects.", "medium"),
  ],
  "gantt-charts": [
    q("Gantt Chart", "What does a Gantt chart show?", [{ label: "A", text: "Task timeline bars showing start date, duration, dependencies, and milestones" }, { label: "B", text: "A pie chart of budget" }, { label: "C", text: "Organization hierarchy" }], "A", "Gantt charts are the most common project management visualization tool."),
    t("Gantt Elements", "Type Gantt chart elements!", "Task bars: Horizontal bars showing duration\nDependencies: Arrows linking tasks\nMilestones: Diamond markers for key dates\nCritical Path: Longest chain (highlighted)\nBaseline: Original plan vs actual", "Tools: Microsoft Project, Jira, Monday.com, Smartsheet all support Gantt views.", "medium"),
  ],
  "critical-path": [
    q("Critical Path", "What is the critical path?", [{ label: "A", text: "The longest sequence of dependent tasks — determines minimum project duration" }, { label: "B", text: "The shortest path" }, { label: "C", text: "The most expensive path" }], "A", "Any delay on the critical path delays the entire project. Non-critical tasks have float (slack)."),
    t("CPM Calculation", "Type a critical path example!", "Task A: 3 days (no dependency)\nTask B: 5 days (depends on A)\nTask C: 2 days (depends on A)\nTask D: 4 days (depends on B, C)\n\nPath A→B→D = 3+5+4 = 12 days ← CRITICAL\nPath A→C→D = 3+2+4 = 9 days (3 days float)", "Float = Latest Start - Earliest Start. Critical path tasks have 0 float.", "hard"),
  ],
  "dfd-intro": [
    q("DFD Purpose", "What do Data Flow Diagrams show?", [{ label: "A", text: "How data moves through a system — processes, data stores, external entities, and flows" }, { label: "B", text: "Database tables" }, { label: "C", text: "Network topology" }], "A", "DFDs are technology-independent — they show WHAT happens, not HOW."),
    t("DFD Symbols", "Type DFD notation!", "Circle/Rounded rectangle: Process\nOpen rectangle: Data Store\nSquare/Rectangle: External Entity\nArrow: Data Flow\n\nMnemonic: P.S.E.F\n(Process, Store, Entity, Flow)", "Gane-Sarson uses rounded rectangles; Yourdon-DeMarco uses circles.", "easy"),
  ],
  "erd-intro": [
    q("ERD Components", "What are the three main ERD components?", [{ label: "A", text: "Entities (rectangles), Attributes (ovals), Relationships (diamonds)" }, { label: "B", text: "Tables, columns, rows" }, { label: "C", text: "Inputs, processes, outputs" }], "A", "Chen notation: Rectangle=Entity, Oval=Attribute, Diamond=Relationship."),
    t("ERD Example", "Type an ERD description!", "Entity: STUDENT (StudentID, Name, Email)\nEntity: MODULE (ModuleID, Title, Credits)\nRelationship: ENROLLS (many-to-many)\n\nPrimary Key: Underlined attribute\nForeign Key: References another entity", "ERDs are essential for database design — always create one before building tables.", "medium"),
  ],
  "normalization": [
    q("1NF", "What does First Normal Form (1NF) require?", [{ label: "A", text: "Atomic values only — no repeating groups or multi-valued attributes" }, { label: "B", text: "No primary key" }, { label: "C", text: "All columns must be numbers" }], "A", "1NF: Each cell contains ONE value. No lists, no arrays, no comma-separated values."),
    t("Normalization Steps", "Type normalization forms!", "UNF → 1NF: Remove repeating groups (atomic values)\n1NF → 2NF: Remove partial dependencies\n2NF → 3NF: Remove transitive dependencies\n\nMnemonic: 'The Key, the Whole Key, Nothing But the Key'", "1NF=key, 2NF=whole key, 3NF=nothing but the key (so help me Codd).", "medium"),
    q("2NF", "What does 2NF require?", [{ label: "A", text: "Be in 1NF AND no partial dependencies (non-key attributes depend on the WHOLE primary key)" }, { label: "B", text: "Have two tables" }, { label: "C", text: "No null values" }], "A", "Partial dependency: attribute depends on PART of a composite key. Split into separate tables."),
  ],
  "class-diagrams": [
    q("UML Class Diagram", "What does a UML class diagram show?", [{ label: "A", text: "Classes with their attributes, methods, and relationships between classes" }, { label: "B", text: "Program flow" }, { label: "C", text: "Database tables" }], "A", "Class diagrams are the backbone of object-oriented design documentation."),
    t("Class Notation", "Type UML class notation!", "+------------------+\n|   ClassName      |\n+------------------+\n| - attribute: Type|\n| # protected: Type|\n+------------------+\n| + method(): void |\n| - private(): int |\n+------------------+\n\n+ public, - private, # protected", "Three compartments: name, attributes, methods. Visibility symbols are crucial.", "medium"),
  ],
  "sequence-diagrams": [
    q("Sequence Diagram", "What do sequence diagrams show?", [{ label: "A", text: "Object interactions over time — messages sent between objects in order" }, { label: "B", text: "Class inheritance" }, { label: "C", text: "Data storage" }], "A", "Objects are at the top, time flows downward, arrows show messages."),
    t("Sequence Elements", "Type sequence diagram elements!", "Object: Box at top with dashed lifeline\nMessage: Solid arrow → (synchronous)\nReturn: Dashed arrow ← (response)\nActivation: Rectangle on lifeline (processing)\nAlt: Alternative paths [condition]", "Read top-to-bottom to trace the message flow.", "medium"),
  ],
};

// ===================== CYBERSECURITY DEEP =====================
export const cyberDeepContent: Record<string, LessonStep[]> = {
  "cia-triad": [
    q("CIA Triad", "What are the three pillars of information security?", [{ label: "A", text: "Confidentiality, Integrity, Availability" }, { label: "B", text: "Cost, Innovation, Agility" }, { label: "C", text: "Create, Install, Activate" }], "A", "C.I.A. — the foundation of ALL security decisions. Every control maps to one or more."),
    t("CIA Definitions", "Type CIA triad definitions!", "Confidentiality: Only authorized people can access data\nIntegrity: Data is accurate and unaltered\nAvailability: Systems are accessible when needed\n\nMnemonic: C.I.A.A.N\n+Authentication +Non-repudiation", "Extended model adds Authentication (prove identity) and Non-repudiation (can't deny actions).", "easy"),
    q("CIA Example", "A hacker changes database records. Which CIA property is violated?", [{ label: "A", text: "Integrity" }, { label: "B", text: "Confidentiality" }, { label: "C", text: "Availability" }], "A", "Unauthorized modification = integrity violation. Unauthorized viewing = confidentiality. System down = availability."),
  ],
  "firewalls": [
    q("Firewall Types", "What are the main firewall types?", [{ label: "A", text: "Packet filtering, Stateful inspection, Application layer (WAF), Next-gen (NGFW)" }, { label: "B", text: "Only software firewalls" }, { label: "C", text: "Only hardware firewalls" }], "A", "NGFW combines traditional firewall + IPS + application awareness + deep packet inspection."),
    t("Firewall Rules", "Type firewall rule examples!", "ALLOW TCP 192.168.1.0/24 → ANY:443 (HTTPS out)\nALLOW TCP ANY → 10.0.0.5:80 (web server in)\nDENY TCP ANY → ANY:23 (block Telnet)\nDENY ALL (default deny — last rule)", "Rules are processed top-to-bottom. The default should ALWAYS be deny.", "medium"),
  ],
  "cryptography-intro": [
    q("Encryption Types", "What is the difference between symmetric and asymmetric encryption?", [{ label: "A", text: "Symmetric uses one shared key; asymmetric uses a public/private key pair" }, { label: "B", text: "They are identical" }, { label: "C", text: "Symmetric is always better" }], "A", "Symmetric (AES): fast, one key. Asymmetric (RSA): slower, two keys. TLS uses both!"),
    t("Encryption Comparison", "Type encryption types!", "Symmetric: AES-256, DES, 3DES, Blowfish\n  - Same key encrypts and decrypts\n  - Fast, used for bulk data\n\nAsymmetric: RSA, ECC, Diffie-Hellman\n  - Public key encrypts, private key decrypts\n  - Slower, used for key exchange & signatures", "TLS handshake: asymmetric to exchange keys, then symmetric for data.", "medium"),
  ],
  "hashing": [
    q("Hashing Purpose", "What is hashing used for?", [{ label: "A", text: "Creating a fixed-size fingerprint of data for integrity verification" }, { label: "B", text: "Encrypting files" }, { label: "C", text: "Compressing data" }], "A", "Hashing is ONE-WAY — you cannot reverse a hash to get the original data."),
    t("Hash Algorithms", "Type hash algorithms!", "MD5: 128-bit (BROKEN — don't use for security)\nSHA-1: 160-bit (DEPRECATED)\nSHA-256: 256-bit (current standard)\nSHA-3: Latest standard (Keccak)\nbcrypt/scrypt: For password hashing (slow by design)", "SHA-256 is the current standard. bcrypt adds salt + work factor for passwords.", "medium"),
    q("Salting", "What is salting in password hashing?", [{ label: "A", text: "Adding random data before hashing so identical passwords produce different hashes" }, { label: "B", text: "Adding salt to food" }, { label: "C", text: "Encrypting the hash" }], "A", "Without salt: same password = same hash (vulnerable to rainbow tables). Salt fixes this."),
  ],
  "sql-injection": [
    q("SQLi Mechanism", "How does SQL injection work?", [{ label: "A", text: "Attacker inserts SQL code into user input fields that gets executed by the database" }, { label: "B", text: "Attacking the SQL server hardware" }, { label: "C", text: "Deleting SQL files" }], "A", "Input: ' OR 1=1 -- makes WHERE clause always true, bypassing authentication."),
    t("SQLi Prevention", "Type SQL injection prevention!", "1. Parameterized queries (PreparedStatement)\n2. Stored procedures\n3. Input validation (whitelist)\n4. Least privilege DB accounts\n5. WAF (Web Application Firewall)\n6. ORM frameworks (Hibernate, SQLAlchemy)", "NEVER concatenate user input into SQL. Always parameterize.", "hard"),
  ],
  "xss-attacks": [
    q("XSS Types", "What are the three types of XSS?", [{ label: "A", text: "Stored (persistent), Reflected (non-persistent), DOM-based" }, { label: "B", text: "Simple, medium, hard" }, { label: "C", text: "Client, server, hybrid" }], "A", "Stored XSS is most dangerous — malicious script is saved in the database and served to all users."),
    t("XSS Prevention", "Type XSS prevention methods!", "1. Output encoding (HTML entities)\n2. Content Security Policy (CSP) headers\n3. Input validation\n4. HttpOnly cookie flag\n5. Use frameworks with auto-escaping\n6. DOMPurify for user HTML", "CSP header: Content-Security-Policy: script-src 'self'", "hard"),
  ],
  "kali-linux": [
    t("Kali Linux Tools", "Type essential Kali tools!", "Nmap: Network scanning\nBurp Suite: Web app testing\nMetasploit: Exploitation framework\nWireshark: Packet analysis\nJohn the Ripper: Password cracking\nAircrack-ng: WiFi security\nHashcat: GPU password cracking\nSQLMap: Automated SQL injection", "Kali comes with 600+ pre-installed security tools.", "medium"),
    q("Nmap Flags", "What does nmap -sV do?", [{ label: "A", text: "Service version detection — identifies what software is running on open ports" }, { label: "B", text: "Scans all ports" }, { label: "C", text: "Deletes files" }], "A", "-sS: SYN scan, -sV: version detect, -O: OS detect, -A: aggressive (all), -p-: all 65535 ports."),
  ],
};

// ===================== COMPUTER SYSTEMS DEEP =====================
export const computerSystemsDeepContent: Record<string, LessonStep[]> = {
  "osi-model": [
    q("OSI 7 Layers", "What are the 7 OSI layers from bottom to top?", [{ label: "A", text: "Physical, Data Link, Network, Transport, Session, Presentation, Application" }, { label: "B", text: "Hardware, Software, Network" }, { label: "C", text: "Client, Server, Database" }], "A", "Mnemonic: Please Do Not Throw Sausage Pizza Away (Physical → Application)."),
    t("OSI Layers", "Type all 7 OSI layers!", "7. Application   (HTTP, FTP, SMTP, DNS)\n6. Presentation  (SSL/TLS, JPEG, encryption)\n5. Session       (NetBIOS, RPC, sessions)\n4. Transport     (TCP, UDP, ports)\n3. Network       (IP, ICMP, routing)\n2. Data Link     (MAC, Ethernet, switches)\n1. Physical      (Cables, hubs, signals)", "Each layer serves the one above and is served by the one below.", "medium"),
    q("Transport vs Network", "What's the difference between Layer 3 and Layer 4?", [{ label: "A", text: "Network (L3) handles IP addressing & routing; Transport (L4) handles port numbers & reliable delivery" }, { label: "B", text: "They are the same" }, { label: "C", text: "L3 is faster" }], "A", "L3 = WHERE to send (IP address). L4 = WHICH application (port number) + reliability (TCP vs UDP)."),
    t("OSI Mnemonic Drill", "Type the mnemonic!", "Please Do Not Throw Sausage Pizza Away\n\nP = Physical (Layer 1)\nD = Data Link (Layer 2)\nN = Network (Layer 3)\nT = Transport (Layer 4)\nS = Session (Layer 5)\nP = Presentation (Layer 6)\nA = Application (Layer 7)", "Drill this until you can recite all 7 layers instantly.", "easy"),
  ],
  "tcp-ip-model": [
    q("TCP/IP Layers", "How many layers does TCP/IP have?", [{ label: "A", text: "4 layers: Network Access, Internet, Transport, Application" }, { label: "B", text: "7 layers" }, { label: "C", text: "3 layers" }], "A", "TCP/IP is the practical model used on the internet. OSI is the theoretical reference."),
    t("TCP/IP vs OSI", "Map TCP/IP to OSI!", "Application (TCP/IP)    = Application + Presentation + Session (OSI)\nTransport (TCP/IP)      = Transport (OSI)\nInternet (TCP/IP)       = Network (OSI)\nNetwork Access (TCP/IP) = Data Link + Physical (OSI)", "TCP/IP is simpler — it combines some OSI layers.", "medium"),
  ],
  "ip-addressing": [
    q("IPv4 Format", "How is an IPv4 address structured?", [{ label: "A", text: "4 octets (bytes) separated by dots, e.g., 192.168.1.1 — total 32 bits" }, { label: "B", text: "6 hex pairs" }, { label: "C", text: "A single number" }], "A", "Each octet = 8 bits = 0-255. Total: 2^32 = ~4.3 billion addresses."),
    t("IP Classes", "Type IPv4 address classes!", "Class A: 1.0.0.0 – 126.x.x.x    (large networks)\nClass B: 128.0.0.0 – 191.x.x.x  (medium networks)\nClass C: 192.0.0.0 – 223.x.x.x  (small networks)\nClass D: 224.x.x.x – 239.x.x.x  (multicast)\nClass E: 240.x.x.x – 255.x.x.x  (experimental)", "Class A has 16M hosts, Class C has 254. Private ranges: 10.x, 172.16-31.x, 192.168.x.", "medium"),
    t("Private IP Ranges", "Type private IP ranges!", "10.0.0.0/8      (Class A private)\n172.16.0.0/12   (Class B private)\n192.168.0.0/16  (Class C private)\n127.0.0.0/8     (Loopback)\n169.254.0.0/16  (APIPA/Link-local)", "Private IPs are not routable on the internet. NAT translates them to public IPs.", "medium"),
  ],
  "subnetting-basics": [
    q("Subnet Mask", "What does a subnet mask do?", [{ label: "A", text: "Divides an IP address into network and host portions" }, { label: "B", text: "Encrypts the IP" }, { label: "C", text: "Speeds up the connection" }], "A", "Subnet mask: 255.255.255.0 = first 24 bits are network, last 8 bits are host (/24)."),
    t("CIDR Notation", "Type CIDR examples!", "/24 = 255.255.255.0   (256 IPs, 254 hosts)\n/25 = 255.255.255.128 (128 IPs, 126 hosts)\n/26 = 255.255.255.192 (64 IPs, 62 hosts)\n/27 = 255.255.255.224 (32 IPs, 30 hosts)\n/28 = 255.255.255.240 (16 IPs, 14 hosts)\n/30 = 255.255.255.252 (4 IPs, 2 hosts)", "Subtract 2 from total IPs for usable hosts (network address + broadcast).", "hard"),
    q("Subnetting Purpose", "Why do we subnet?", [{ label: "A", text: "To divide large networks into smaller, more manageable segments for security and efficiency" }, { label: "B", text: "To make the internet faster" }, { label: "C", text: "To encrypt data" }], "A", "Subnetting reduces broadcast domains, improves security isolation, and optimizes IP usage."),
  ],
  "fetch-execute": [
    q("FDE Cycle", "What are the stages of the Fetch-Decode-Execute cycle?", [{ label: "A", text: "Fetch instruction from memory, Decode it, Execute it, Store result" }, { label: "B", text: "Read, Write, Delete" }, { label: "C", text: "Input, Process, Output" }], "A", "The CPU repeats this cycle billions of times per second (measured in GHz)."),
    t("FDE Registers", "Type the key CPU registers!", "PC (Program Counter): Address of next instruction\nMAR (Memory Address Register): Address to read/write\nMDR (Memory Data Register): Data being transferred\nCIR (Current Instruction Register): Current instruction\nAccumulator: Result of calculations", "The PC increments after each fetch. MAR→MDR fetches data from RAM.", "medium"),
  ],
  "cpu-basics": [
    q("CPU Components", "What are the three main parts of a CPU?", [{ label: "A", text: "ALU (Arithmetic Logic Unit), Control Unit (CU), Registers" }, { label: "B", text: "RAM, ROM, Cache" }, { label: "C", text: "Keyboard, Mouse, Screen" }], "A", "ALU does calculations, CU orchestrates operations, Registers store data temporarily."),
    t("CPU Architecture", "Type Von Neumann architecture!", "CPU: ALU + Control Unit + Registers\nMemory: Stores data AND instructions\nBuses: Address bus, Data bus, Control bus\nI/O: Input/Output controllers\n\nKey concept: Data and instructions share memory", "Von Neumann bottleneck: data and instructions compete for the same bus.", "medium"),
  ],
  "linux-basics": [
    t("Linux Commands", "Type essential Linux commands!", "ls -la          (list all files, details)\ncd /path        (change directory)\nmkdir dirname   (create directory)\ncp src dest     (copy file)\nmv src dest     (move/rename)\nrm -rf dir      (remove recursively)\nchmod 755 file  (change permissions)\nsudo command    (run as root)", "Linux is the OS of servers, cloud, and cybersecurity. Master the terminal!", "easy"),
    t("Linux Navigation", "Type file system navigation!", "pwd             (print working directory)\nls -la          (list with details)\ncd ~            (home directory)\ncd ..           (parent directory)\nfind / -name '*.log'  (search files)\ngrep 'error' file.txt (search in files)\ncat file.txt    (display file content)\nnano file.txt   (edit file)", "Tab completion saves time. Up arrow recalls previous commands.", "easy"),
    q("Linux Permissions", "What does chmod 755 mean?", [{ label: "A", text: "Owner: read+write+execute (7), Group: read+execute (5), Others: read+execute (5)" }, { label: "B", text: "Delete all files" }, { label: "C", text: "Create a user" }], "A", "Permission values: read=4, write=2, execute=1. Add them up: 7=rwx, 5=r-x, 4=r--."),
  ],
  "shell-scripting": [
    t("Bash Script", "Write a Bash script!", "#!/bin/bash\necho \"Hello, $USER!\"\nfor i in 1 2 3 4 5; do\n  echo \"Count: $i\"\ndone\nif [ -f \"config.txt\" ]; then\n  echo \"Config found\"\nfi", "#!/bin/bash is the shebang — tells the OS which interpreter to use.", "medium"),
    q("Shell Variables", "How do you assign a variable in Bash?", [{ label: "A", text: "name=\"value\" (no spaces around =)" }, { label: "B", text: "var name = value" }, { label: "C", text: "let name = value" }], "A", "No spaces around =. Access with $name. Enclose in quotes for strings with spaces."),
  ],
  "dns-dhcp": [
    q("DNS Purpose", "What does DNS do?", [{ label: "A", text: "Translates domain names (google.com) to IP addresses (142.250.x.x)" }, { label: "B", text: "Encrypts websites" }, { label: "C", text: "Blocks malware" }], "A", "DNS is the 'phonebook of the internet'. Without it, you'd type IP addresses for every website."),
    t("DNS Resolution", "Type DNS resolution steps!", "1. Browser cache check\n2. OS cache check\n3. Recursive resolver (ISP)\n4. Root nameserver (.)\n5. TLD nameserver (.com)\n6. Authoritative nameserver\n7. IP address returned\n8. Browser connects to IP", "DNS resolution happens in milliseconds. Caching at each level speeds it up.", "medium"),
  ],
  "network-devices": [
    t("Network Devices", "Type network device functions!", "Hub: Broadcasts to all ports (Layer 1)\nSwitch: Forwards to specific port by MAC (Layer 2)\nRouter: Routes between networks by IP (Layer 3)\nAccess Point: Wireless connectivity\nFirewall: Filters traffic by rules\nLoad Balancer: Distributes traffic", "Switches replaced hubs. Routers connect different networks.", "easy"),
    q("Switch vs Router", "What's the difference between a switch and a router?", [{ label: "A", text: "Switch uses MAC addresses (Layer 2), Router uses IP addresses (Layer 3)" }, { label: "B", text: "They are identical" }, { label: "C", text: "Routers are faster" }], "A", "Switches connect devices within a LAN. Routers connect different networks (LANs to WAN/internet)."),
  ],
  "lmc-intro": [
    q("LMC Purpose", "What is the Little Man Computer?", [{ label: "A", text: "A simplified model of a CPU that teaches how computers execute instructions" }, { label: "B", text: "A small laptop" }, { label: "C", text: "A video game" }], "A", "LMC uses mailboxes (memory), a calculator (ALU), and an in/out tray to simulate a CPU."),
    t("LMC Instructions", "Type LMC instruction set!", "INP    (901): Read input to accumulator\nOUT    (902): Output accumulator value\nLDA xx (5xx): Load address xx to accumulator\nSTA xx (3xx): Store accumulator to address xx\nADD xx (1xx): Add address xx to accumulator\nSUB xx (2xx): Subtract address xx\nBRA xx (6xx): Branch always\nBRZ xx (7xx): Branch if zero\nBRP xx (8xx): Branch if positive/zero\nHLT    (000): Halt", "LMC is a simplified assembly language. It teaches how real CPUs process instructions.", "medium"),
    t("LMC Program", "Write an LMC program to add two numbers!", "INP       // Read first number\nSTA FIRST // Store in FIRST\nINP       // Read second number\nADD FIRST // Add FIRST to accumulator\nOUT       // Output the sum\nHLT       // Stop\nFIRST DAT // Data location", "INP reads into the accumulator. STA saves it. ADD adds to the accumulator.", "medium"),
  ],
};

// ===================== WEB TECHNOLOGIES DEEP =====================
export const webDeepContent: Record<string, LessonStep[]> = {
  "html-basics": [
    t("HTML Structure", "Type basic HTML structure!", "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>", "Every HTML page needs DOCTYPE, html, head, and body. meta viewport enables mobile responsiveness.", "easy"),
    q("Semantic HTML", "Why use semantic HTML tags?", [{ label: "A", text: "They describe content meaning — improves accessibility, SEO, and code readability" }, { label: "B", text: "They look different" }, { label: "C", text: "They load faster" }], "A", "Use <header>, <nav>, <main>, <article>, <section>, <footer> instead of <div> for everything."),
  ],
  "css-basics": [
    t("CSS Selectors", "Type CSS selector types!", "element { }     /* All <p> elements */\n.class { }      /* class='class' */\n#id { }         /* id='id' */\nelement.class   /* <p class='x'> */\nparent > child  /* Direct children */\na:hover { }     /* Pseudo-class */\np::first-line   /* Pseudo-element */", "Specificity: inline > #id > .class > element. !important overrides all (avoid it).", "easy"),
    q("Box Model", "What are the four parts of the CSS box model?", [{ label: "A", text: "Content, Padding, Border, Margin (inside out)" }, { label: "B", text: "Width, Height, Color, Position" }, { label: "C", text: "Top, Right, Bottom, Left" }], "A", "box-sizing: border-box makes width include padding and border — always use it!"),
  ],
  "css-flexbox": [
    t("Flexbox Basics", "Type Flexbox properties!", "/* Container */\ndisplay: flex;\nflex-direction: row | column;\njustify-content: center | space-between;\nalign-items: center | stretch;\nflex-wrap: wrap;\ngap: 1rem;\n\n/* Items */\nflex: 1;        /* Grow to fill */\nflex-shrink: 0; /* Don't shrink */\norder: 1;       /* Reorder */", "Flexbox is for 1D layouts (row OR column). Use Grid for 2D.", "medium"),
    q("justify vs align", "What's the difference between justify-content and align-items?", [{ label: "A", text: "justify-content = main axis, align-items = cross axis" }, { label: "B", text: "They are the same" }, { label: "C", text: "justify is for text only" }], "A", "In flex-direction: row → justify = horizontal, align = vertical. Column reverses them."),
  ],
  "css-grid": [
    t("CSS Grid", "Type Grid layout!", ".container {\n  display: grid;\n  grid-template-columns: 1fr 2fr 1fr;\n  grid-template-rows: auto 1fr auto;\n  gap: 1rem;\n}\n.item {\n  grid-column: 1 / 3;  /* Span 2 columns */\n  grid-row: 1 / 2;\n}", "Grid is for 2D layouts (rows AND columns simultaneously).", "medium"),
    q("fr Unit", "What does the 'fr' unit mean in CSS Grid?", [{ label: "A", text: "Fraction of available space — 1fr 2fr means second column is twice as wide" }, { label: "B", text: "Pixels" }, { label: "C", text: "Frames" }], "A", "fr distributes remaining space proportionally. 1fr 1fr 1fr = three equal columns."),
  ],
  "responsive-design": [
    t("Media Queries", "Type responsive breakpoints!", "@media (max-width: 768px) {\n  .container { flex-direction: column; }\n}\n@media (min-width: 1024px) {\n  .container { max-width: 1200px; }\n}\n\n/* Mobile-first approach: */\n/* Default = mobile, add min-width for larger */", "Mobile-first: start with mobile styles, add complexity for larger screens.", "medium"),
    q("Responsive Units", "Which CSS units are responsive?", [{ label: "A", text: "%, vw, vh, rem, em, clamp() — avoid fixed px for layout" }, { label: "B", text: "Only px" }, { label: "C", text: "Only %" }], "A", "rem = relative to root font-size. vw/vh = viewport units. clamp() = responsive with limits."),
  ],
  "js-basics": [
    t("JavaScript Variables", "Type JS variable declarations!", "const name = \"Alice\";   // Can't reassign\nlet score = 0;          // Can reassign\n// var is outdated — avoid it\n\nconst arr = [1, 2, 3];  // Array (const but mutable)\nconst obj = { key: \"value\" }; // Object", "Use const by default, let when you need to reassign. Never use var.", "easy"),
    t("JS Functions", "Type JavaScript functions!", "// Arrow function (modern)\nconst add = (a, b) => a + b;\n\n// Function declaration\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\n// Template literals use backticks\nconsole.log(`Sum: ${add(2, 3)}`);", "Arrow functions are concise. Template literals use backtick for string interpolation.", "easy"),
  ],
  "react-basics": [
    t("React Component", "Type a React component!", "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}", "useState is the most basic React hook. Components re-render when state changes.", "medium"),
    q("React Hooks", "What are React hooks?", [{ label: "A", text: "Functions that let you use state and lifecycle features in functional components" }, { label: "B", text: "CSS styles" }, { label: "C", text: "HTML elements" }], "A", "Key hooks: useState (state), useEffect (side effects), useContext (global state), useMemo (memoize)."),
  ],
  "api-basics": [
    t("Fetch API", "Type a fetch request!", "const response = await fetch('https://api.example.com/data');\nconst data = await response.json();\nconsole.log(data);\n\n// POST request\nawait fetch('/api/users', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Alice' })\n});", "fetch returns a Promise. Use async/await for clean syntax.", "medium"),
    q("REST Methods", "What are the main HTTP methods?", [{ label: "A", text: "GET (read), POST (create), PUT (update), PATCH (partial update), DELETE (remove)" }, { label: "B", text: "Only GET and POST" }, { label: "C", text: "SEND, RECEIVE, UPDATE" }], "A", "REST APIs use HTTP methods to represent CRUD operations on resources."),
  ],
  "git-basics": [
    t("Git Commands", "Type essential Git commands!", "git init              # Initialize repo\ngit add .             # Stage all changes\ngit commit -m \"msg\"   # Commit with message\ngit push origin main  # Push to remote\ngit pull              # Fetch + merge\ngit branch feature    # Create branch\ngit checkout feature  # Switch branch\ngit merge feature     # Merge branch", "Git tracks changes. GitHub/GitLab hosts your repositories remotely.", "easy"),
    t("Git Workflow", "Type the Git workflow!", "1. git pull origin main    (get latest)\n2. git checkout -b feature (new branch)\n3. ... make changes ...\n4. git add .               (stage)\n5. git commit -m \"feat: x\" (commit)\n6. git push origin feature (push)\n7. Create Pull Request on GitHub\n8. Code review → Merge → Delete branch", "Feature branches keep main clean. PRs enable code review.", "medium"),
    q("Git vs GitHub", "What's the difference between Git and GitHub?", [{ label: "A", text: "Git is the version control tool; GitHub is a cloud hosting platform for Git repos" }, { label: "B", text: "They are the same" }, { label: "C", text: "GitHub is newer" }], "A", "Git = local tool (by Linus Torvalds). GitHub = web platform (owned by Microsoft). Alternatives: GitLab, Bitbucket."),
  ],
  "seo-basics": [
    q("SEO Fundamentals", "What is SEO?", [{ label: "A", text: "Search Engine Optimization — improving website visibility in search results" }, { label: "B", text: "Social media marketing" }, { label: "C", text: "Email marketing" }], "A", "SEO drives organic (free) traffic. Google processes 8.5 billion searches per day."),
    t("On-Page SEO", "Type on-page SEO checklist!", "Title tag: <60 chars, keyword at start\nMeta description: <160 chars, compelling CTA\nH1: One per page, includes keyword\nURL: Short, readable, keyword included\nAlt text: Describe images for accessibility\nInternal links: Connect related pages\nPage speed: <3 second load time", "On-page SEO is what you control on your website. Off-page = backlinks, social signals.", "medium"),
    q("Keywords", "What is keyword research?", [{ label: "A", text: "Finding what terms people search for and how competitive they are" }, { label: "B", text: "Making up words" }, { label: "C", text: "Writing code" }], "A", "Tools: Google Keyword Planner, Ahrefs, SEMrush. Target long-tail keywords for easier ranking."),
    t("SEO Technical", "Type technical SEO factors!", "robots.txt: Controls crawler access\nsitemap.xml: Lists all pages for search engines\nCanonical tags: Prevent duplicate content\nSchema markup: Rich snippets in results\nHTTPS: Required for ranking\nMobile-first: Google indexes mobile version first\nCore Web Vitals: LCP, FID, CLS", "Technical SEO ensures search engines can crawl, index, and understand your site.", "hard"),
  ],
  "typescript-basics": [
    t("TypeScript Types", "Type TypeScript basics!", "const name: string = \"Alice\";\nconst age: number = 25;\nconst active: boolean = true;\n\ninterface User {\n  id: number;\n  name: string;\n  email?: string; // optional\n}\n\nfunction greet(user: User): string {\n  return `Hello, ${user.name}`;\n}", "TypeScript adds static types to JavaScript — catches errors at compile time.", "medium"),
    q("TypeScript Benefits", "Why use TypeScript over JavaScript?", [{ label: "A", text: "Compile-time type checking catches bugs before runtime, better IDE support" }, { label: "B", text: "It runs faster" }, { label: "C", text: "It uses less memory" }], "A", "TypeScript compiles to JavaScript. It's used by React, Angular, Vue, Node.js, and most modern projects."),
  ],
  "vscode-mastery": [
    t("VS Code Shortcuts", "Type essential VS Code shortcuts!", "Ctrl+P:       Quick open file\nCtrl+Shift+P: Command palette\nCtrl+D:       Select next occurrence\nCtrl+/:       Toggle comment\nAlt+Up/Down:  Move line up/down\nCtrl+Shift+K: Delete line\nCtrl+`:       Toggle terminal\nCtrl+B:       Toggle sidebar", "Master these shortcuts to code 2-3x faster.", "easy"),
    t("VS Code Extensions", "Type must-have extensions!", "Prettier: Auto-format code\nESLint: JavaScript linting\nGitLens: Git blame + history\nLive Server: Local dev server\nThunder Client: API testing\nauto rename tag: HTML tag pairs\nBracket Pair Colorizer: Nested brackets\nPath Intellisense: File path autocomplete", "Extensions make VS Code a professional IDE. Install these first.", "easy"),
    q("VS Code Features", "What is the Command Palette?", [{ label: "A", text: "Ctrl+Shift+P — access every VS Code command by typing its name" }, { label: "B", text: "A color picker" }, { label: "C", text: "A file manager" }], "A", "The Command Palette is the fastest way to do anything in VS Code."),
  ],
};

// ===================== BUSINESS SYSTEMS DEEP =====================
export const businessDeepContent: Record<string, LessonStep[]> = {
  "erp-systems": [
    q("ERP Definition", "What is ERP?", [{ label: "A", text: "Enterprise Resource Planning — integrated software managing all business processes" }, { label: "B", text: "Email Routing Protocol" }, { label: "C", text: "Emergency Response Plan" }], "A", "ERP integrates finance, HR, manufacturing, supply chain, and CRM into one system."),
    t("ERP Modules", "Type core ERP modules!", "FI: Financial Accounting (GL, AP, AR)\nCO: Controlling (cost centers, profit)\nSD: Sales & Distribution\nMM: Materials Management\nPP: Production Planning\nHR: Human Resources\nQM: Quality Management\nPM: Plant Maintenance", "SAP, Oracle, Microsoft Dynamics are the top ERP vendors.", "medium"),
    q("ERP Benefits", "What is the main benefit of ERP?", [{ label: "A", text: "Single source of truth — all departments share one database, eliminating data silos" }, { label: "B", text: "It's free" }, { label: "C", text: "It replaces employees" }], "A", "Without ERP, each department uses different systems, causing inconsistent data and inefficiency."),
  ],
  "sap-intro": [
    q("SAP Overview", "What is SAP S/4HANA?", [{ label: "A", text: "SAP's next-gen ERP suite running on HANA in-memory database for real-time analytics" }, { label: "B", text: "A programming language" }, { label: "C", text: "A web browser" }], "A", "S/4HANA replaced SAP ECC. HANA = High-performance ANalytic Appliance (in-memory DB)."),
    t("SAP Navigation", "Type SAP transaction codes!", "SE38: ABAP Editor\nMM01: Create Material\nVA01: Create Sales Order\nFB01: Post Financial Document\nSE11: Data Dictionary\nSPRO: Customizing (IMG)\nSU01: User Maintenance\nSM37: Job Overview", "T-codes are shortcuts. Type them in the command bar to navigate instantly.", "hard"),
    q("SAP ABAP", "What is ABAP?", [{ label: "A", text: "Advanced Business Application Programming — SAP's proprietary programming language" }, { label: "B", text: "A database" }, { label: "C", text: "A network protocol" }], "A", "ABAP is used to customize SAP. Modern SAP also supports ABAP RESTful Application Programming."),
  ],
  "excel-basics": [
    t("Excel Formulas", "Type essential Excel formulas!", "=SUM(A1:A10)           Sum a range\n=AVERAGE(B1:B10)       Average\n=COUNT(C1:C10)         Count numbers\n=COUNTIF(D:D,\">50\")   Conditional count\n=IF(A1>10,\"Yes\",\"No\") If-then-else\n=VLOOKUP(E1,A:C,3,0)  Vertical lookup", "Mnemonic S.C.A.M: SUM, COUNT, AVERAGE, MAX/MIN — the four you'll use most.", "easy"),
    q("Cell References", "What is the difference between $A$1 and A1?", [{ label: "A", text: "A1 is relative (changes when copied), $A$1 is absolute (stays fixed)" }, { label: "B", text: "They are identical" }, { label: "C", text: "$A$1 is faster" }], "A", "F4 toggles between A1, $A$1, $A1, A$1. Use absolute refs when a cell must not change."),
  ],
  "pivot-tables": [
    q("Pivot Table", "What is a Pivot Table?", [{ label: "A", text: "An interactive table that summarizes large datasets by grouping, filtering, and aggregating data" }, { label: "B", text: "A type of chart" }, { label: "C", text: "A database" }], "A", "Pivot Tables turn thousands of rows into meaningful summaries in seconds."),
    t("Pivot Table Steps", "Type Pivot Table creation steps!", "1. Select your data (Ctrl+A)\n2. Insert → PivotTable\n3. Drag fields to areas:\n   - Rows: Categories to group by\n   - Columns: Secondary grouping\n   - Values: Numbers to summarize\n   - Filters: Slice the data\n4. Right-click values → Summarize by", "Mnemonic P.I.V.O.T: Powerful Interactive Views Of Tabular data.", "medium"),
  ],
  "seo-keyword-research": [
    q("Keyword Types", "What are long-tail keywords?", [{ label: "A", text: "Longer, more specific search phrases with lower competition and higher conversion intent" }, { label: "B", text: "Very short keywords" }, { label: "C", text: "Keywords with many letters" }], "A", "'buy red running shoes size 10' converts better than 'shoes'. Long-tail = less traffic but more targeted."),
    t("Keyword Research Process", "Type keyword research steps!", "1. Brainstorm seed keywords\n2. Use tools (Ahrefs, SEMrush, Ubersuggest)\n3. Check search volume and difficulty\n4. Analyze competitor keywords\n5. Group by intent (informational, transactional)\n6. Map keywords to pages\n7. Track rankings over time", "Focus on keywords with high volume + low difficulty + commercial intent.", "medium"),
  ],
  "google-analytics": [
    t("GA4 Metrics", "Type Google Analytics 4 key metrics!", "Users: Unique visitors\nSessions: Visit instances\nPageviews: Pages loaded\nBounce Rate: Single-page visits\nAvg. Session Duration: Time on site\nConversion Rate: Goal completions\nTraffic Sources: Where users come from\nUser Flow: Path through your site", "GA4 uses event-based tracking. Every interaction is an event.", "medium"),
    q("UTM Parameters", "What are UTM parameters?", [{ label: "A", text: "Tags added to URLs to track which campaigns drive traffic: source, medium, campaign" }, { label: "B", text: "Encryption keys" }, { label: "C", text: "SEO keywords" }], "A", "?utm_source=facebook&utm_medium=social&utm_campaign=launch — tracks every click source."),
  ],
};

// ===================== AI & DATA SCIENCE DEEP =====================
export const aiDeepContent: Record<string, LessonStep[]> = {
  "ml-intro": [
    q("Machine Learning", "What is machine learning?", [{ label: "A", text: "Algorithms that learn patterns from data without being explicitly programmed" }, { label: "B", text: "Robots walking" }, { label: "C", text: "Internet search" }], "A", "ML finds patterns in data. Traditional programming: rules → answers. ML: data + answers → rules."),
    t("ML Workflow", "Type the ML workflow!", "1. Define the problem\n2. Collect & clean data\n3. Explore data (EDA)\n4. Select features\n5. Choose & train model\n6. Evaluate performance\n7. Tune hyperparameters\n8. Deploy to production\n9. Monitor & retrain", "The ML pipeline is iterative — you'll cycle through steps multiple times.", "medium"),
  ],
  "neural-networks": [
    q("Neural Network", "What is an artificial neural network?", [{ label: "A", text: "Layers of interconnected nodes (neurons) that learn to recognize patterns through weighted connections" }, { label: "B", text: "A brain scan" }, { label: "C", text: "A network cable" }], "A", "Input layer → Hidden layers → Output layer. Each connection has a weight that's learned during training."),
    t("Neural Network Structure", "Type neural network components!", "Input Layer: Receives raw data (features)\nHidden Layers: Learn patterns (neurons)\nOutput Layer: Produces predictions\n\nActivation Functions:\n  ReLU: max(0, x) — most common\n  Sigmoid: 0-1 (binary classification)\n  Softmax: Probabilities (multi-class)", "Deep learning = neural networks with many hidden layers.", "hard"),
  ],
  "nlp-basics": [
    q("NLP Definition", "What is Natural Language Processing?", [{ label: "A", text: "AI techniques for understanding, generating, and manipulating human language" }, { label: "B", text: "A programming language" }, { label: "C", text: "A network protocol" }], "A", "NLP powers: chatbots, translation, sentiment analysis, summarization, search engines."),
    t("NLP Tasks", "Type common NLP tasks!", "Tokenization: Split text into words/tokens\nStemming: Reduce to root (running → run)\nNER: Named Entity Recognition (find names, dates)\nSentiment Analysis: Positive/negative/neutral\nText Classification: Categorize documents\nMachine Translation: Language translation\nSummarization: Condense long text", "Modern NLP uses transformer models (BERT, GPT) instead of traditional methods.", "medium"),
  ],
  "transformers": [
    q("Transformer Architecture", "What makes transformers revolutionary?", [{ label: "A", text: "Self-attention mechanism — processes all tokens simultaneously, capturing long-range dependencies" }, { label: "B", text: "They are faster than CPUs" }, { label: "C", text: "They use less memory" }], "A", "Self-attention lets each token attend to every other token. This replaced RNNs for most NLP tasks."),
    t("Transformer Models", "Type key transformer models!", "BERT: Bidirectional encoding (Google, 2018)\nGPT: Generative pre-training (OpenAI)\nT5: Text-to-text (Google)\nLLaMA: Open-source (Meta)\nClaude: Constitutional AI (Anthropic)\nGemini: Multimodal (Google)\n\nAll based on 'Attention Is All You Need' (2017)", "Transformers replaced RNNs/LSTMs. They parallelize better and capture longer dependencies.", "hard"),
  ],
  "rag-systems": [
    q("RAG Definition", "What is RAG?", [{ label: "A", text: "Retrieval-Augmented Generation — combines search with LLM to answer questions using external knowledge" }, { label: "B", text: "Random Algorithm Generator" }, { label: "C", text: "A file format" }], "A", "RAG retrieves relevant documents, then feeds them to an LLM as context. Reduces hallucinations."),
    t("RAG Pipeline", "Type a RAG pipeline!", "1. User asks a question\n2. Embed question → vector\n3. Search vector database\n4. Retrieve top-K relevant chunks\n5. Construct prompt with context\n6. Send to LLM for generation\n7. Return grounded answer\n\nTools: LangChain, LlamaIndex, Pinecone", "RAG = search engine + LLM. It grounds answers in real documents.", "hard"),
  ],
  "python-basics": [
    t("Python Syntax", "Type basic Python!", "name = \"Alice\"        # No type declaration needed\nage = 25              # Dynamic typing\nscores = [90, 85, 92] # List\n\nfor score in scores:\n    print(f\"Score: {score}\")\n\ndef greet(name):\n    return f\"Hello, {name}!\"", "Python uses indentation instead of braces. Whitespace matters!", "easy"),
    t("Python Data Structures", "Type Python collections!", "# List (mutable, ordered)\nnums = [1, 2, 3]\nnums.append(4)\n\n# Dictionary (key-value)\nuser = {\"name\": \"Alice\", \"age\": 25}\n\n# Tuple (immutable)\npoint = (10, 20)\n\n# Set (unique values)\nunique = {1, 2, 3}", "Lists and dicts are the most used. List comprehension: [x*2 for x in nums].", "easy"),
    q("Python vs Java", "How does Python differ from Java?", [{ label: "A", text: "Dynamic typing, indentation-based, interpreted, simpler syntax, no semicolons" }, { label: "B", text: "Python is faster" }, { label: "C", text: "They are identical" }], "A", "Python: quick to write, slower to run. Java: more verbose, faster execution, type-safe."),
    t("Python Functions", "Type Python functions!", "def calculate_bmi(weight, height):\n    \"\"\"Calculate Body Mass Index.\"\"\"\n    bmi = weight / (height ** 2)\n    if bmi < 18.5:\n        return \"Underweight\"\n    elif bmi < 25:\n        return \"Normal\"\n    else:\n        return \"Overweight\"", "Python is the #1 language for AI/ML, data science, and automation.", "medium"),
  ],
};

// ===================== MATHS DEEP =====================
export const mathDeepContent: Record<string, LessonStep[]> = {
  "big-o-intro": [
    q("Big-O Purpose", "What does Big-O notation describe?", [{ label: "A", text: "How an algorithm's time/space grows as input size increases" }, { label: "B", text: "The exact runtime in seconds" }, { label: "C", text: "Memory usage in bytes" }], "A", "Big-O describes the WORST case growth rate. O(n) means time grows linearly with input."),
    t("Big-O Hierarchy", "Type Big-O from fastest to slowest!", "O(1)      Constant    (array access)\nO(log n)  Logarithmic (binary search)\nO(n)      Linear      (loop through array)\nO(n log n) Linearithmic (merge sort)\nO(n²)     Quadratic   (nested loops)\nO(2ⁿ)     Exponential (recursive fibonacci)\nO(n!)     Factorial   (permutations)", "O(1) is instant. O(n!) is impossible for large inputs.", "medium"),
    q("Identify Complexity", "What is the Big-O of a single for loop iterating n items?", [{ label: "A", text: "O(n)" }, { label: "B", text: "O(1)" }, { label: "C", text: "O(n²)" }], "A", "One loop = O(n). Two nested loops = O(n²). Three nested = O(n³)."),
  ],
  "logic-gates": [
    q("Gate Types", "What are the three basic logic gates?", [{ label: "A", text: "AND, OR, NOT — all other gates can be built from combinations of these" }, { label: "B", text: "NAND, NOR, XOR" }, { label: "C", text: "ADD, SUB, MUL" }], "A", "AND: both inputs 1 → output 1. OR: any input 1 → output 1. NOT: inverts input."),
    t("Truth Tables", "Type AND, OR, NOT truth tables!", "AND: 0&0=0, 0&1=0, 1&0=0, 1&1=1\nOR:  0|0=0, 0|1=1, 1|0=1, 1|1=1\nNOT: !0=1, !1=0\nXOR: 0^0=0, 0^1=1, 1^0=1, 1^1=0\nNAND: NOT(AND) — universal gate\nNOR:  NOT(OR) — universal gate", "NAND and NOR are 'universal' — you can build ANY gate from just NAND gates.", "medium"),
  ],
  "boolean-algebra": [
    t("Boolean Laws", "Type Boolean algebra laws!", "Identity:    A AND 1 = A,  A OR 0 = A\nNull:        A AND 0 = 0,  A OR 1 = 1\nIdempotent:  A AND A = A,  A OR A = A\nComplement:  A AND NOT A = 0, A OR NOT A = 1\nDe Morgan's: NOT(A AND B) = NOT A OR NOT B\n             NOT(A OR B) = NOT A AND NOT B", "De Morgan's Laws are the most important for simplification!", "medium"),
  ],
  "graphs-intro": [
    q("Graph Definition", "What is a graph in mathematics?", [{ label: "A", text: "A set of vertices (nodes) connected by edges (links)" }, { label: "B", text: "A bar chart" }, { label: "C", text: "A spreadsheet" }], "A", "Graphs model relationships: social networks, road maps, web links, dependencies."),
    t("Graph Types", "Type graph classifications!", "Directed: Edges have direction (A→B)\nUndirected: Edges go both ways (A—B)\nWeighted: Edges have costs/distances\nUnweighted: All edges equal\nCyclic: Contains cycles (loops)\nAcyclic: No cycles (trees, DAGs)\nConnected: Path between all vertices", "Trees are connected acyclic graphs. DAGs (Directed Acyclic Graphs) are used in scheduling.", "medium"),
  ],
  "sets-basics": [
    q("Set Notation", "What is a set?", [{ label: "A", text: "An unordered collection of unique elements, denoted with curly braces { }" }, { label: "B", text: "An ordered list" }, { label: "C", text: "A number" }], "A", "A = {1, 2, 3}. Order doesn't matter: {1,2,3} = {3,1,2}. No duplicates: {1,1,2} = {1,2}."),
    t("Set Operations", "Type set operations!", "Union: A ∪ B (all elements in A or B)\nIntersection: A ∩ B (elements in both)\nDifference: A - B (in A but not B)\nComplement: A' (everything not in A)\nSubset: A ⊆ B (all of A is in B)\nCardinality: |A| (number of elements)", "Venn diagrams visualize these operations perfectly.", "easy"),
  ],
  "stats-intro": [
    t("Statistics Basics", "Type measures of central tendency!", "Mean: Sum / Count (average)\n  = (2+4+6+8) / 4 = 5\n\nMedian: Middle value (sorted)\n  = {2,4,6,8} → (4+6)/2 = 5\n\nMode: Most frequent value\n  = {1,2,2,3} → mode = 2", "Mean is affected by outliers. Median is more robust for skewed data.", "easy"),
    q("When to Use", "When is the median more useful than the mean?", [{ label: "A", text: "When data is skewed or has outliers (e.g., income data)" }, { label: "B", text: "Never" }, { label: "C", text: "For all data" }], "A", "Salaries: mean is pulled up by CEO salary. Median gives a better 'typical' value."),
  ],
};

// ===================== GAME DEV DEEP =====================
export const gameDevDeepContent: Record<string, LessonStep[]> = {
  "game-engines": [
    q("Engine Comparison", "What are the three main game engines?", [{ label: "A", text: "Unity (C#, versatile), Unreal (C++, AAA graphics), Godot (GDScript, open-source)" }, { label: "B", text: "Only Unity" }, { label: "C", text: "Only Unreal" }], "A", "Unity: most popular for indie/mobile. Unreal: best graphics (Nanite, Lumen). Godot: free, lightweight."),
    t("Engine Features", "Type engine comparison!", "Unity:\n  Language: C#\n  Strengths: Cross-platform, huge asset store\n  Best for: Mobile, indie, VR\n\nUnreal:\n  Language: C++, Blueprints\n  Strengths: Best graphics, AAA tools\n  Best for: AAA, FPS, open world\n\nGodot:\n  Language: GDScript, C#\n  Strengths: Free, lightweight, node system\n  Best for: 2D, indie, learning", "Start with Unity or Godot for learning. Unreal for AAA ambitions.", "medium"),
  ],
  "pathfinding": [
    q("A* Algorithm", "How does A* pathfinding work?", [{ label: "A", text: "Combines actual distance traveled (g) with estimated distance to goal (h) to find shortest path" }, { label: "B", text: "Random walking" }, { label: "C", text: "Straight lines only" }], "A", "f(n) = g(n) + h(n). A* always finds the optimal path if the heuristic is admissible."),
    t("A* Components", "Type A* algorithm components!", "Open List: Nodes to evaluate\nClosed List: Already evaluated nodes\ng(n): Cost from start to current node\nh(n): Estimated cost to goal (heuristic)\nf(n) = g(n) + h(n): Total estimated cost\n\nHeuristics:\n  Manhattan: |dx| + |dy| (grid movement)\n  Euclidean: sqrt(dx² + dy²) (any angle)", "Manhattan distance for 4-directional movement. Euclidean for free movement.", "hard"),
  ],
  "behavior-trees": [
    q("Behavior Tree", "What is a behavior tree?", [{ label: "A", text: "A hierarchical AI decision structure with selectors, sequences, and leaf nodes" }, { label: "B", text: "A file system" }, { label: "C", text: "A network diagram" }], "A", "BTs replaced FSMs for complex AI. They're modular, reusable, and easy to debug."),
    t("BT Node Types", "Type behavior tree nodes!", "Composite: Selector (try until one succeeds)\n           Sequence (run all in order)\nDecorator: Inverter (flip success/fail)\n           Repeater (loop N times)\nLeaf:      Action (do something)\n           Condition (check something)", "Sequence = AND (all must succeed). Selector = OR (first success wins).", "hard"),
  ],
};
