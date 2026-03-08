// Expanded Content Phase 4: Python, Kubernetes, Terraform, Cloud Certs,
// Docker deep, AWS/Azure/GCP, CI/CD, Ansible, more game dev
import type { LessonStep } from "./lessons";

function q(title: string, question: string, options: { label: string; text: string }[], correct: string, explanation: string, difficulty: "easy" | "medium" | "hard" = "medium"): LessonStep {
  return { type: "quiz", title, difficulty, question, options, correctAnswer: correct, explanation };
}

function t(title: string, prompt: string, code: string, explanation: string, difficulty: "easy" | "medium" | "hard" = "easy"): LessonStep {
  return { type: "typing", title, difficulty, prompt, codeToType: code, explanation };
}

// ==================== PYTHON DEEP CONTENT ====================
export const pythonDeepContent: Record<string, LessonStep[]> = {
  "python-intro": [
    q("What is Python?", "Python is known for:", [{ label: "A", text: "Readable syntax with indentation" }, { label: "B", text: "Requiring semicolons everywhere" }, { label: "C", text: "Only running on Windows" }], "A", "Python uses indentation instead of braces — clean, readable code from day one!"),
    t("Print Statement", "Type Python's print function:", 'print("Hello, World!")', "print() is Python's output function — parentheses required in Python 3!"),
    t("Variables", "Assign variables — no type keyword needed:", 'name = "Alice"\nage = 25\npi = 3.14', "Python infers types automatically — dynamic typing makes prototyping fast!"),
    q("Variable Types", "What type is x = 42?", [{ label: "A", text: "int" }, { label: "B", text: "float" }, { label: "C", text: "str" }], "A", "Whole numbers are int. Use type(x) to check any variable's type!"),
    t("F-Strings", "Modern string formatting:", 'name = "Bob"\nprint(f"Hello, {name}!")', "F-strings (f'...') embed expressions directly — the Pythonic way!"),
    q("Indentation", "Python uses indentation for:", [{ label: "A", text: "Code blocks (if, for, def)" }, { label: "B", text: "Decoration only" }, { label: "C", text: "Comments" }], "A", "Indentation IS syntax in Python — typically 4 spaces per level!"),
    t("If Statement", "Type a conditional:", 'score = 85\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("C")', "elif (not else if) — Python's unique keyword for chained conditions!"),
  ],
  "python-data-structures": [
    t("List Creation", "Create and use a list:", 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[0])\nfruits.append("date")', "Lists are mutable ordered collections — index from 0, append to add!"),
    q("List vs Tuple", "The difference is:", [{ label: "A", text: "Tuples are immutable, lists are mutable" }, { label: "B", text: "Lists are faster" }, { label: "C", text: "No difference" }], "A", "Tuples use () and can't change — lists use [] and can be modified!"),
    t("Dictionary", "Key-value pairs:", 'student = {"name": "Alice", "grade": "A"}\nprint(student["name"])\nstudent["age"] = 20', "Dicts map keys to values — O(1) average lookup time!"),
    t("List Comprehension", "Pythonic one-liner:", 'squares = [x**2 for x in range(10)]\nevens = [x for x in range(20) if x % 2 == 0]', "List comprehensions replace multi-line loops — concise and fast!"),
    q("Set Property", "A set guarantees:", [{ label: "A", text: "No duplicate elements" }, { label: "B", text: "Ordered elements" }, { label: "C", text: "Key-value pairs" }], "A", "Sets enforce uniqueness — great for removing duplicates: set([1,1,2]) → {1,2}!"),
    t("For Loop", "Iterate with range and enumerate:", 'for i in range(5):\n    print(i)\nfor i, val in enumerate(["a","b","c"]):\n    print(i, val)', "range() generates sequences, enumerate() gives index + value!"),
    t("Functions", "Define reusable functions:", 'def greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\nprint(greet("Alice"))', "Default parameters make functions flexible — keyword args add clarity!"),
  ],
};

// ==================== KUBERNETES DEEP CONTENT ====================
export const kubernetesDeepContent: Record<string, LessonStep[]> = {
  "kubernetes-intro": [
    q("What is Kubernetes?", "Kubernetes (K8s) is:", [{ label: "A", text: "Container orchestration platform" }, { label: "B", text: "A programming language" }, { label: "C", text: "A database system" }], "A", "K8s automates deployment, scaling, and management of containerized applications!"),
    t("Pod Definition", "The smallest K8s unit — type a pod YAML:", 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: my-app\nspec:\n  containers:\n  - name: app\n    image: nginx:latest\n    ports:\n    - containerPort: 80', "A Pod wraps one or more containers — it's the atomic unit in K8s!"),
    q("Pod vs Container", "A Pod can contain:", [{ label: "A", text: "One or more containers sharing network/storage" }, { label: "B", text: "Only one container ever" }, { label: "C", text: "Only images" }], "A", "Pods share localhost network and volumes — sidecar pattern uses multi-container pods!"),
    t("Kubectl Basics", "Essential kubectl commands:", 'kubectl get pods\nkubectl get services\nkubectl describe pod my-app\nkubectl logs my-app\nkubectl apply -f deployment.yaml', "kubectl is your K8s CLI — get, describe, logs, apply are the core verbs!"),
    q("Deployment Purpose", "A Deployment manages:", [{ label: "A", text: "Desired state of Pod replicas with rolling updates" }, { label: "B", text: "Database schemas" }, { label: "C", text: "DNS records" }], "A", "Deployments ensure N replicas run, handle rolling updates and rollbacks!"),
    t("Deployment YAML", "Type a Deployment manifest:", 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-app\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n      - name: web\n        image: nginx:1.25', "replicas: 3 means K8s maintains exactly 3 pods — self-healing!"),
    q("Service Types", "ClusterIP, NodePort, LoadBalancer differ in:", [{ label: "A", text: "How they expose pods to network traffic" }, { label: "B", text: "Programming language" }, { label: "C", text: "Storage capacity" }], "A", "ClusterIP=internal, NodePort=host port, LoadBalancer=cloud LB — each widens access!"),
  ],
};

// ==================== TERRAFORM / IaC CONTENT ====================
export const terraformDeepContent: Record<string, LessonStep[]> = {
  "terraform-intro": [
    q("What is Terraform?", "Terraform is:", [{ label: "A", text: "Infrastructure as Code (IaC) tool by HashiCorp" }, { label: "B", text: "A container runtime" }, { label: "C", text: "A CI/CD pipeline" }], "A", "Terraform lets you define cloud infrastructure in code — version-controlled, repeatable, auditable!"),
    t("HCL Basics", "HashiCorp Configuration Language:", 'provider "aws" {\n  region = "eu-west-2"\n}\n\nresource "aws_instance" "web" {\n  ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = "t2.micro"\n  tags = {\n    Name = "WebServer"\n  }\n}', "provider = cloud, resource = what to create — HCL is declarative!"),
    q("Terraform Workflow", "The standard workflow is:", [{ label: "A", text: "init → plan → apply" }, { label: "B", text: "build → test → deploy" }, { label: "C", text: "code → commit → push" }], "A", "init downloads providers, plan shows changes, apply executes — always plan before apply!"),
    t("Terraform Commands", "Core CLI commands:", 'terraform init\nterraform plan\nterraform apply\nterraform destroy\nterraform state list', "init=setup, plan=preview, apply=execute, destroy=teardown, state=inspect!"),
    q("State File", "terraform.tfstate stores:", [{ label: "A", text: "Current infrastructure state for drift detection" }, { label: "B", text: "Source code backups" }, { label: "C", text: "User credentials" }], "A", "State tracks what exists — Terraform compares desired vs actual to compute changes!"),
    t("Variables", "Parameterize your infra:", 'variable "instance_type" {\n  default     = "t2.micro"\n  description = "EC2 instance size"\n}\n\nresource "aws_instance" "web" {\n  instance_type = var.instance_type\n}', "Variables make configs reusable — override with -var or .tfvars files!"),
    q("Modules", "Terraform modules are:", [{ label: "A", text: "Reusable infrastructure packages" }, { label: "B", text: "Programming functions" }, { label: "C", text: "Container images" }], "A", "Modules encapsulate resources — like functions for infrastructure. DRY principle!"),
  ],
};

// ==================== AWS CLOUD CONTENT ====================
export const awsDeepContent: Record<string, LessonStep[]> = {
  "aws-core-services": [
    q("AWS Regions", "An AWS Region is:", [{ label: "A", text: "A geographic area with multiple data centers (AZs)" }, { label: "B", text: "A single server" }, { label: "C", text: "A programming framework" }], "A", "Each Region has 2+ Availability Zones — choose nearest to users for low latency!"),
    t("AWS CLI", "Essential AWS CLI commands:", 'aws configure\naws s3 ls\naws s3 cp file.txt s3://my-bucket/\naws ec2 describe-instances\naws lambda invoke --function-name myFunc out.json', "AWS CLI gives programmatic access — configure with access key + secret key!"),
    q("EC2 vs Lambda", "The key difference:", [{ label: "A", text: "EC2 = persistent VMs, Lambda = event-driven serverless" }, { label: "B", text: "They're the same service" }, { label: "C", text: "Lambda is only for databases" }], "A", "EC2 = you manage servers 24/7. Lambda = runs code on-demand, pay per invocation!"),
    t("S3 Bucket Policy", "Type an S3 access policy:", '{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": "*",\n    "Action": "s3:GetObject",\n    "Resource": "arn:aws:s3:::my-bucket/*"\n  }]\n}', "S3 policies use JSON — Principal=who, Action=what, Resource=where!"),
    q("IAM Best Practice", "For AWS IAM security:", [{ label: "A", text: "Use least privilege — grant minimum required permissions" }, { label: "B", text: "Give everyone admin access" }, { label: "C", text: "Share root credentials" }], "A", "Least privilege = only permissions needed for the task. Never use root for daily work!"),
    t("CloudFormation", "AWS native IaC:", 'AWSTemplateFormatVersion: "2010-09-09"\nResources:\n  WebServer:\n    Type: AWS::EC2::Instance\n    Properties:\n      ImageId: ami-0c55b159cbfafe1f0\n      InstanceType: t2.micro', "CloudFormation is AWS's own IaC — YAML/JSON templates define your stack!"),
    q("VPC Purpose", "A VPC provides:", [{ label: "A", text: "Isolated virtual network for your AWS resources" }, { label: "B", text: "A programming IDE" }, { label: "C", text: "Email service" }], "A", "VPC = your private cloud network with subnets, route tables, security groups!"),
  ],
  "cloud-certifications": [
    q("AWS CCP", "AWS Cloud Practitioner covers:", [{ label: "A", text: "Cloud concepts, security, billing, core services" }, { label: "B", text: "Advanced networking only" }, { label: "C", text: "Programming certification" }], "A", "CCP is the entry-level cert — understand cloud value proposition and core services!"),
    q("Cert Path", "After Cloud Practitioner, the next step:", [{ label: "A", text: "Solutions Architect Associate" }, { label: "B", text: "PhD in Computer Science" }, { label: "C", text: "No more certs needed" }], "A", "SAA is the most popular AWS cert — design resilient, scalable architectures!"),
    t("Well-Architected", "AWS 6 pillars mnemonic S.P.O.R.C.S:", 'Security\nPerformance Efficiency\nOperational Excellence\nReliability\nCost Optimization\nSustainability', "S.P.O.R.C.S — the 6 pillars guide every architecture decision!"),
    q("Shared Responsibility", "In AWS shared responsibility:", [{ label: "A", text: "AWS secures cloud infrastructure, you secure what's IN the cloud" }, { label: "B", text: "AWS handles everything" }, { label: "C", text: "Customer handles everything" }], "A", "AWS = security OF the cloud (hardware, network). You = security IN the cloud (data, IAM)!"),
    q("Azure Equivalent", "Azure's equivalent to AWS EC2:", [{ label: "A", text: "Azure Virtual Machines" }, { label: "B", text: "Azure Functions" }, { label: "C", text: "Azure DevOps" }], "A", "VM ↔ EC2, Blob Storage ↔ S3, Azure AD ↔ IAM — learn one cloud, map to others!"),
    t("GCP Services", "Google Cloud Platform core:", 'Compute Engine = VMs (like EC2)\nCloud Storage = Object store (like S3)\nBigQuery = Data warehouse\nCloud Functions = Serverless\nGKE = Managed Kubernetes', "GCP strengths: BigQuery (analytics), GKE (best managed K8s), AI/ML tools!"),
    q("Multi-Cloud", "Multi-cloud strategy means:", [{ label: "A", text: "Using services from multiple cloud providers" }, { label: "B", text: "Using one cloud in multiple regions" }, { label: "C", text: "Running everything on-premises" }], "A", "Multi-cloud avoids vendor lock-in — Terraform excels at managing multi-cloud!"),
  ],
};

// ==================== DOCKER DEEP CONTENT ====================
export const dockerDeepContent: Record<string, LessonStep[]> = {
  "containers-intro": [
    q("Container vs VM", "Containers differ from VMs because:", [{ label: "A", text: "They share the host OS kernel — lighter and faster" }, { label: "B", text: "They're exactly the same" }, { label: "C", text: "They need more resources" }], "A", "Containers share the kernel = seconds to start vs minutes for VMs!"),
    t("Dockerfile", "Build a container image:", 'FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]', "FROM=base image, COPY=files in, RUN=build commands, CMD=startup command!"),
    t("Docker Commands", "Essential Docker CLI:", 'docker build -t my-app .\ndocker run -p 3000:3000 my-app\ndocker ps\ndocker stop <id>\ndocker images\ndocker-compose up -d', "build=create image, run=start container, ps=list running, compose=multi-container!"),
    q("Docker Compose", "docker-compose.yml is for:", [{ label: "A", text: "Defining multi-container applications" }, { label: "B", text: "Writing code" }, { label: "C", text: "Database queries" }], "A", "Compose defines services, networks, volumes — one command spins up your entire stack!"),
    t("Docker Compose File", "Multi-service definition:", 'version: "3.8"\nservices:\n  web:\n    build: .\n    ports:\n      - "3000:3000"\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_PASSWORD: secret\n    volumes:\n      - pgdata:/var/lib/postgresql/data\nvolumes:\n  pgdata:', "Services define containers, volumes persist data, networks connect them!"),
    q("Image Layers", "Docker images use layers because:", [{ label: "A", text: "Each instruction creates a cached layer — faster rebuilds" }, { label: "B", text: "It looks nicer" }, { label: "C", text: "Required by law" }], "A", "Layer caching means unchanged steps skip — order Dockerfile for maximum cache hits!"),
    t("Multi-Stage Build", "Optimize image size:", 'FROM node:18 AS builder\nWORKDIR /app\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html', "Multi-stage: build in fat image, copy artifacts to slim image — tiny production images!"),
  ],
};

// ==================== CI/CD & DEVOPS CONTENT ====================
export const cicdDeepContent: Record<string, LessonStep[]> = {
  "github-workflow": [
    t("GitHub Actions", "Type a CI workflow:", 'name: CI\non: [push, pull_request]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 18\n      - run: npm ci\n      - run: npm test\n      - run: npm run build', "on=trigger, jobs=what to do, steps=sequential commands — runs on every push!"),
    q("CI vs CD", "Continuous Integration vs Continuous Deployment:", [{ label: "A", text: "CI=auto build/test, CD=auto deploy to production" }, { label: "B", text: "They're the same thing" }, { label: "C", text: "CI is for databases only" }], "A", "CI catches bugs early via automated tests. CD pushes verified code to production automatically!"),
    t("Git Branching", "Professional git workflow:", 'git checkout -b feature/login\ngit add .\ngit commit -m "feat: add login form"\ngit push origin feature/login\n# Create Pull Request on GitHub\ngit checkout main\ngit pull origin main', "Feature branches isolate work — PRs enable code review before merging!"),
    q("PR Reviews", "Pull Request reviews ensure:", [{ label: "A", text: "Code quality, knowledge sharing, bug prevention" }, { label: "B", text: "Slower development only" }, { label: "C", text: "More git conflicts" }], "A", "PRs are a quality gate — at least 1 approval before merge is best practice!"),
    t("Git Rebase", "Clean commit history:", 'git fetch origin\ngit rebase origin/main\n# Resolve conflicts if any\ngit add .\ngit rebase --continue\ngit push --force-with-lease', "Rebase replays your commits on top of main — cleaner than merge commits!"),
    q("Semantic Versioning", "SemVer format MAJOR.MINOR.PATCH means:", [{ label: "A", text: "Breaking.Feature.Fix (e.g., 2.1.3)" }, { label: "B", text: "Year.Month.Day" }, { label: "C", text: "Random numbers" }], "A", "MAJOR=breaking changes, MINOR=new features, PATCH=bug fixes — npm uses SemVer!"),
    t("Conventional Commits", "Structured commit messages:", 'feat: add user authentication\nfix: resolve login redirect bug\ndocs: update API documentation\nchore: upgrade dependencies\nrefactor: extract validation logic\ntest: add unit tests for auth', "feat/fix/docs/chore — conventional commits enable automatic changelogs!"),
  ],
};

// ==================== ANSIBLE & CONFIG MANAGEMENT ====================
export const ansibleContent: Record<string, LessonStep[]> = {
  "ansible-intro": [
    q("What is Ansible?", "Ansible is:", [{ label: "A", text: "Agentless configuration management and automation tool" }, { label: "B", text: "A container runtime" }, { label: "C", text: "A cloud provider" }], "A", "Ansible uses SSH — no agent needed on managed nodes. Push-based automation!"),
    t("Playbook", "Type an Ansible playbook:", '---\n- name: Configure web server\n  hosts: webservers\n  become: yes\n  tasks:\n    - name: Install nginx\n      apt:\n        name: nginx\n        state: present\n    - name: Start nginx\n      service:\n        name: nginx\n        state: started\n        enabled: yes', "Playbooks are YAML — hosts=targets, tasks=actions, become=sudo!"),
    q("Idempotent", "Ansible is idempotent meaning:", [{ label: "A", text: "Running it multiple times produces the same result" }, { label: "B", text: "It only runs once" }, { label: "C", text: "It deletes everything" }], "A", "state: present means 'ensure installed' — won't reinstall if already there!"),
  ],
};

// ==================== EXPANDED GAME DEV CONTENT ====================
export const gameDevDeepContent2: Record<string, LessonStep[]> = {
  "shader-programming": [
    q("What are Shaders?", "Shaders are:", [{ label: "A", text: "GPU programs that control pixel/vertex rendering" }, { label: "B", text: "Audio effects" }, { label: "C", text: "Network protocols" }], "A", "Shaders run on the GPU — vertex shaders position geometry, fragment shaders color pixels!"),
    t("Fragment Shader", "Type a basic GLSL shader:", 'void main() {\n  vec2 uv = gl_FragCoord.xy / resolution.xy;\n  vec3 color = vec3(uv.x, uv.y, 0.5);\n  gl_FragColor = vec4(color, 1.0);\n}', "gl_FragCoord gives pixel position — normalize to 0-1 for gradient effects!"),
    q("Vertex vs Fragment", "Vertex shader runs:", [{ label: "A", text: "Once per vertex, fragment runs once per pixel" }, { label: "B", text: "Once per frame" }, { label: "C", text: "Never" }], "A", "Vertex=geometry transform, Fragment=color each pixel. Pipeline: Vertex→Rasterize→Fragment!"),
    t("Uniform Variables", "Pass data to shaders:", 'uniform float time;\nuniform vec2 resolution;\n\nvoid main() {\n  float wave = sin(gl_FragCoord.x * 0.05 + time);\n  gl_FragColor = vec4(wave, 0.5, 1.0, 1.0);\n}', "Uniforms are constants per draw call — send time, mouse position, textures to GPU!"),
  ],
  "procedural-generation": [
    q("Perlin Noise", "Perlin noise is used for:", [{ label: "A", text: "Natural-looking random terrain and textures" }, { label: "B", text: "Sorting arrays" }, { label: "C", text: "Network encryption" }], "A", "Perlin noise creates smooth randomness — mountains, clouds, caves all use it!"),
    t("Noise Seed", "Reproducible randomness:", 'Random rng = new Random(12345);\nfloat height = perlinNoise(x * 0.01, z * 0.01);\nint biome = (int)(height * 5);', "Seeds make generation repeatable — same seed = same world every time!"),
    q("Wave Function Collapse", "WFC generates:", [{ label: "A", text: "Tile-based content respecting adjacency constraints" }, { label: "B", text: "Sound effects" }, { label: "C", text: "Network packets" }], "A", "WFC looks at sample patterns and generates new valid arrangements — great for levels!"),
  ],
  "vr-game-dev": [
    q("VR Rendering", "VR requires:", [{ label: "A", text: "Stereoscopic rendering at 90+ FPS for each eye" }, { label: "B", text: "30 FPS is fine" }, { label: "C", text: "No special rendering" }], "A", "Below 90 FPS causes motion sickness — VR demands aggressive optimization!"),
    t("VR Input", "Handle VR controllers:", 'if (leftController.triggerPressed) {\n  grabObject(nearestObject);\n}\nvec3 handPos = rightController.position;\nquat handRot = rightController.rotation;', "VR controllers provide 6DOF — position + rotation for natural interaction!"),
  ],
};

// ==================== ADDITIONAL COMPUTER SYSTEMS CONTENT ====================
export const computerSystemsDeepContent2: Record<string, LessonStep[]> = {
  "visual-studio-code": [
    t("VS Code Shortcuts", "Essential keyboard shortcuts:", 'Ctrl+P          // Quick open file\nCtrl+Shift+P    // Command palette\nCtrl+D          // Select next occurrence\nAlt+Up/Down     // Move line up/down\nCtrl+/          // Toggle comment\nCtrl+`          // Toggle terminal', "Command Palette (Ctrl+Shift+P) is your VS Code superpower — access any feature!"),
    q("Extensions", "Must-have VS Code extensions:", [{ label: "A", text: "Prettier, ESLint, GitLens, Live Server" }, { label: "B", text: "Only themes matter" }, { label: "C", text: "No extensions needed" }], "A", "Prettier=auto-format, ESLint=catch errors, GitLens=git blame, Live Server=hot reload!"),
    t("Settings JSON", "Customize your editor:", '{\n  "editor.fontSize": 14,\n  "editor.tabSize": 2,\n  "editor.formatOnSave": true,\n  "editor.minimap.enabled": false,\n  "files.autoSave": "afterDelay"\n}', "settings.json gives you full control — formatOnSave is a game-changer!"),
    q("Multi-Cursor", "Ctrl+D in VS Code:", [{ label: "A", text: "Selects next matching occurrence for multi-cursor editing" }, { label: "B", text: "Deletes the line" }, { label: "C", text: "Opens a file" }], "A", "Multi-cursor editing lets you change multiple occurrences simultaneously — massive time saver!"),
  ],
  "ide-comparison": [
    q("IDE vs Editor", "An IDE differs from a code editor:", [{ label: "A", text: "IDEs include debugger, compiler, and project tools built-in" }, { label: "B", text: "They're identical" }, { label: "C", text: "Editors are always better" }], "A", "IntelliJ=full Java IDE, VS Code=lightweight editor+extensions. Choose by project needs!"),
    q("Best for Java", "The best IDE for Java development:", [{ label: "A", text: "IntelliJ IDEA — deep Java integration and refactoring" }, { label: "B", text: "Notepad" }, { label: "C", text: "Microsoft Word" }], "A", "IntelliJ's Java support is unmatched — smart completion, refactoring, debugging, Maven/Gradle!"),
  ],
  "sql-fundamentals": [
    t("SQL CRUD", "The four fundamental operations:", 'SELECT * FROM users WHERE age > 18;\nINSERT INTO users (name, age) VALUES (\'Alice\', 25);\nUPDATE users SET age = 26 WHERE name = \'Alice\';\nDELETE FROM users WHERE name = \'Bob\';', "CRUD = Create(INSERT), Read(SELECT), Update(UPDATE), Delete(DELETE)!"),
    t("JOIN Operations", "Combine tables:", 'SELECT u.name, o.total\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id\nWHERE o.total > 100\nORDER BY o.total DESC;', "INNER JOIN returns rows matching in BOTH tables — the most common join type!"),
    q("LEFT vs INNER", "LEFT JOIN differs:", [{ label: "A", text: "Returns ALL rows from left table, NULLs for no match" }, { label: "B", text: "They're identical" }, { label: "C", text: "LEFT JOIN is slower" }], "A", "LEFT JOIN keeps all left table rows — unmatched right side becomes NULL!"),
    t("Aggregation", "Group and summarize:", 'SELECT department, COUNT(*) as total,\n       AVG(salary) as avg_salary\nFROM employees\nGROUP BY department\nHAVING COUNT(*) > 5\nORDER BY avg_salary DESC;', "GROUP BY creates buckets, HAVING filters groups (WHERE filters rows)!"),
  ],
};

// ==================== MORE WEB TECH CONTENT ====================
export const webDeepContent2: Record<string, LessonStep[]> = {
  "nodejs-intro": [
    t("Node.js Server", "Create a basic HTTP server:", 'const http = require("http");\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, {"Content-Type": "text/plain"});\n  res.end("Hello World!");\n});\nserver.listen(3000);', "Node.js runs JavaScript on the server — event-driven, non-blocking I/O!"),
    q("Event Loop", "Node.js event loop:", [{ label: "A", text: "Single-threaded loop handling async operations" }, { label: "B", text: "Multi-threaded like Java" }, { label: "C", text: "Only runs synchronously" }], "A", "Single thread + event loop = handles thousands of concurrent connections efficiently!"),
    t("NPM Basics", "Package management:", 'npm init -y\nnpm install express\nnpm install -D nodemon\nnpm run dev\nnpx create-react-app my-app', "npm install adds packages, -D=devDependency, npx runs without installing globally!"),
  ],
  "express-api": [
    t("Express Routes", "RESTful API with Express:", 'const express = require("express");\nconst app = express();\napp.use(express.json());\n\napp.get("/api/users", (req, res) => {\n  res.json([{id: 1, name: "Alice"}]);\n});\napp.post("/api/users", (req, res) => {\n  const user = req.body;\n  res.status(201).json(user);\n});\napp.listen(3000);', "GET=read, POST=create, PUT=update, DELETE=remove — REST maps HTTP verbs to CRUD!"),
    q("Middleware", "Express middleware:", [{ label: "A", text: "Functions that run between request and response" }, { label: "B", text: "Database connections" }, { label: "C", text: "HTML templates" }], "A", "Middleware chain: logging → auth → validation → route handler → response!"),
  ],
  "python-web": [
    t("Flask App", "Minimal Python web server:", 'from flask import Flask, jsonify\napp = Flask(__name__)\n\n@app.route("/api/hello")\ndef hello():\n    return jsonify({"message": "Hello!"})\n\nif __name__ == "__main__":\n    app.run(debug=True)', "@app.route decorates functions as endpoints — Flask is micro, Django is batteries-included!"),
    q("Django vs Flask", "The key difference:", [{ label: "A", text: "Django=full framework with ORM/admin, Flask=micro framework" }, { label: "B", text: "They're identical" }, { label: "C", text: "Flask is always better" }], "A", "Django: ORM, admin panel, auth built-in. Flask: minimal, add what you need. Choose by project size!"),
  ],
};

// ==================== ADDITIONAL BUSINESS CONTENT ====================
export const businessDeepContent2: Record<string, LessonStep[]> = {
  "whmcs-hosting": [
    q("WHMCS Purpose", "WHMCS automates:", [{ label: "A", text: "Web hosting billing, provisioning, and support" }, { label: "B", text: "Video editing" }, { label: "C", text: "Social media posting" }], "A", "WHMCS = Web Host Manager Complete Solution — billing, client portal, server provisioning!"),
    t("WHMCS Modules", "Key WHMCS components:", 'Billing Module    → Invoices, payments, Stripe/PayPal\nServer Module     → Auto-provision cPanel/Plesk\nDomain Module     → Register/transfer domains\nSupport Module    → Ticket system\nProvisioning      → API hooks for VPS/shared', "WHMCS connects billing to provisioning — client pays, server auto-creates!"),
    q("Hosting Types", "Shared vs VPS vs Dedicated:", [{ label: "A", text: "Shared=multi-tenant, VPS=virtual private, Dedicated=full server" }, { label: "B", text: "All the same" }, { label: "C", text: "VPS is always cheapest" }], "A", "Shared<VPS<Dedicated in cost and control. Cloud hosting adds elasticity!"),
  ],
  "erp-systems": [
    q("ERP Modules", "Common ERP modules include:", [{ label: "A", text: "Finance, HR, Supply Chain, Manufacturing, CRM" }, { label: "B", text: "Only email" }, { label: "C", text: "Only databases" }], "A", "ERP integrates ALL business processes — single source of truth across departments!"),
    t("SAP T-Codes", "Essential SAP transaction codes:", 'MM01  → Create Material\nVA01  → Create Sales Order\nFB01  → Post Document\nME21N → Create Purchase Order\nSE38  → ABAP Editor\nSPRO  → Customizing', "T-codes are SAP shortcuts — thousands exist, these are the most critical!"),
    q("SAP S/4HANA", "S/4HANA runs on:", [{ label: "A", text: "In-memory HANA database for real-time processing" }, { label: "B", text: "Microsoft Excel" }, { label: "C", text: "Paper records" }], "A", "HANA = High-performance ANalytic Appliance — in-memory means instant analytics!"),
  ],
};
