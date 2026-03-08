import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { 
  Network, CheckCircle, XCircle, Lightbulb, Layers, 
  Globe, Server, Shield, Wifi, Cable, ArrowRight
} from "lucide-react";

interface ProtocolChallenge {
  id: number;
  question: string;
  context?: string;
  correctAnswer: string;
  options: string[];
  hint: string;
  explanation: string;
  category: "osi" | "tcp-ip" | "protocols" | "ethernet" | "addressing";
  layer?: number;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const challenges: ProtocolChallenge[] = [
  // === OSI Model ===
  { id: 1, question: "How many layers are in the OSI model?", correctAnswer: "7 layers", options: ["7 layers", "4 layers", "5 layers", "6 layers"], hint: "Think: Please Do Not Throw Sausage Pizza Away", explanation: "OSI has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. Mnemonic: P.D.N.T.S.P.A!", category: "osi" },
  { id: 2, question: "Which OSI layer handles IP addressing and routing?", correctAnswer: "Layer 3 - Network", options: ["Layer 3 - Network", "Layer 2 - Data Link", "Layer 4 - Transport", "Layer 1 - Physical"], hint: "Routers work at this layer, handling logical addresses", explanation: "Network Layer (L3) handles IP addressing and routing. Routers are L3 devices!", category: "osi", layer: 3 },
  { id: 3, question: "MAC addresses operate at which layer?", correctAnswer: "Layer 2 - Data Link", options: ["Layer 2 - Data Link", "Layer 3 - Network", "Layer 1 - Physical", "Layer 4 - Transport"], hint: "Switches use MAC addresses to forward frames", explanation: "Data Link (L2) uses MAC addresses. Switches are L2 devices, hubs are L1!", category: "osi", layer: 2 },
  { id: 4, question: "Which layer is responsible for end-to-end communication and port numbers?", correctAnswer: "Layer 4 - Transport", options: ["Layer 4 - Transport", "Layer 3 - Network", "Layer 5 - Session", "Layer 7 - Application"], hint: "TCP and UDP operate here", explanation: "Transport Layer (L4) provides end-to-end communication. TCP/UDP use port numbers to identify applications!", category: "osi", layer: 4 },
  { id: 5, question: "What does the Presentation layer (L6) handle?", correctAnswer: "Data encryption, compression, and format translation", options: ["Data encryption, compression, and format translation", "Routing packets", "Physical connections", "Session management"], hint: "It 'presents' data in a readable format", explanation: "L6 handles data translation (JPEG, ASCII), encryption (SSL/TLS), and compression. It makes data understandable!", category: "osi", layer: 6 },
  { id: 6, question: "The Session layer (L5) is responsible for?", correctAnswer: "Establishing, managing, and terminating sessions", options: ["Establishing, managing, and terminating sessions", "Encrypting data", "Routing packets", "Error detection"], hint: "It manages the dialog between two applications", explanation: "L5 manages sessions: opening, maintaining, and closing connections. NetBIOS and RPC operate here!", category: "osi", layer: 5 },
  { id: 7, question: "What is encapsulation in networking?", correctAnswer: "Adding headers/trailers as data moves down the OSI layers", options: ["Adding headers/trailers as data moves down the OSI layers", "Removing data from packets", "Encrypting all traffic", "Compressing data"], hint: "Each layer wraps the data with its own information", explanation: "Encapsulation: Data → Segment (L4) → Packet (L3) → Frame (L2) → Bits (L1). Each layer adds its header!", category: "osi" },
  // === TCP/IP Model ===
  { id: 8, question: "How many layers in the TCP/IP model?", correctAnswer: "4 layers", options: ["4 layers", "7 layers", "5 layers", "3 layers"], hint: "More practical than OSI, used in real networks", explanation: "TCP/IP: Network Access, Internet, Transport, Application. Maps to OSI but simpler!", category: "tcp-ip" },
  { id: 9, question: "The TCP/IP 'Internet' layer corresponds to which OSI layer?", correctAnswer: "Network (Layer 3)", options: ["Network (Layer 3)", "Data Link (Layer 2)", "Transport (Layer 4)", "Application (Layer 7)"], hint: "IP protocol operates at this layer", explanation: "TCP/IP Internet layer = OSI Network layer. Handles IP addressing and routing!", category: "tcp-ip" },
  { id: 10, question: "What is the TCP three-way handshake?", correctAnswer: "SYN → SYN-ACK → ACK", options: ["SYN → SYN-ACK → ACK", "ACK → SYN → FIN", "HELLO → OK → START", "CONNECT → ACCEPT → DATA"], hint: "Three messages to establish a connection", explanation: "1) Client sends SYN. 2) Server replies SYN-ACK. 3) Client sends ACK. Connection established! Mnemonic: 'Sync, Sync-Ack, Ack'.", category: "tcp-ip" },
  // === Protocols ===
  { id: 11, question: "Which protocol guarantees delivery with acknowledgments?", correctAnswer: "TCP", options: ["TCP", "UDP", "IP", "ICMP"], hint: "It's 'connection-oriented' and reliable", explanation: "TCP = Transmission Control Protocol. Uses 3-way handshake, ACKs, retransmission. Reliable but slower!", category: "protocols" },
  { id: 12, question: "Which protocol is faster but doesn't guarantee delivery?", correctAnswer: "UDP", options: ["UDP", "TCP", "HTTP", "FTP"], hint: "Used for streaming, gaming, DNS - where speed > reliability", explanation: "UDP = User Datagram Protocol. No connection setup, no ACKs. Fast but 'best effort' only!", category: "protocols" },
  { id: 13, question: "HTTP uses which default port number?", correctAnswer: "80", options: ["80", "443", "21", "25"], hint: "The most common web traffic port", explanation: "HTTP = 80, HTTPS = 443, FTP = 21, SSH = 22, DNS = 53, SMTP = 25. Memorize common ports!", category: "protocols" },
  { id: 14, question: "Which protocol translates domain names to IP addresses?", correctAnswer: "DNS", options: ["DNS", "DHCP", "ARP", "NAT"], hint: "Like a phone book for the internet", explanation: "DNS = Domain Name System. Translates www.example.com → IP address. Uses port 53!", category: "protocols" },
  { id: 15, question: "Which protocol automatically assigns IP addresses to devices?", correctAnswer: "DHCP", options: ["DHCP", "DNS", "ARP", "RARP"], hint: "When you connect to WiFi, this gives you an IP", explanation: "DHCP = Dynamic Host Configuration Protocol. Assigns IP, subnet mask, gateway, DNS automatically!", category: "protocols" },
  { id: 16, question: "What protocol does email sending use?", correctAnswer: "SMTP (port 25/587)", options: ["SMTP (port 25/587)", "POP3 (port 110)", "IMAP (port 143)", "HTTP (port 80)"], hint: "Simple Mail Transfer Protocol", explanation: "SMTP sends email. POP3/IMAP receive email. SMTP uses port 25 (unencrypted) or 587 (TLS).", category: "protocols" },
  { id: 17, question: "Which protocol securely transfers files over SSH?", correctAnswer: "SFTP (port 22)", options: ["SFTP (port 22)", "FTP (port 21)", "TFTP (port 69)", "HTTP (port 80)"], hint: "It combines SSH security with file transfer", explanation: "SFTP = SSH File Transfer Protocol. Encrypted file transfer on port 22. FTP (port 21) is unencrypted!", category: "protocols" },
  { id: 18, question: "ICMP is used for what purpose?", correctAnswer: "Network diagnostics (ping, traceroute)", options: ["Network diagnostics (ping, traceroute)", "File transfer", "Email delivery", "Web browsing"], hint: "When you 'ping' a server, you use this protocol", explanation: "ICMP = Internet Control Message Protocol. Ping sends Echo Request/Reply. Traceroute maps network paths!", category: "protocols" },
  // === Ethernet & Physical ===
  { id: 19, question: "What does CSMA/CD stand for in Ethernet?", correctAnswer: "Carrier Sense Multiple Access with Collision Detection", options: ["Carrier Sense Multiple Access with Collision Detection", "Computer System Multiple Access with Collision Detection", "Carrier Signal Multiple Access with Collision Domain", "Central Sense Media Access with Collision Detection"], hint: "Listen before sending, detect if two devices send simultaneously", explanation: "CSMA/CD: Listen (carrier sense), share medium (multiple access), detect collisions and retransmit!", category: "ethernet" },
  { id: 20, question: "What is the maximum length of a standard Cat5e Ethernet cable run?", correctAnswer: "100 meters", options: ["100 meters", "50 meters", "200 meters", "500 meters"], hint: "Same limit for Cat5, Cat5e, and Cat6", explanation: "100m max for twisted pair Ethernet. Beyond that, use switches/repeaters or fiber optic!", category: "ethernet" },
  { id: 21, question: "What is the difference between a hub and a switch?", correctAnswer: "Hub broadcasts to all ports; switch sends to specific destination", options: ["Hub broadcasts to all ports; switch sends to specific destination", "They are identical", "Hub is faster than switch", "Switch is wireless, hub is wired"], hint: "One is intelligent, the other floods", explanation: "Hubs (L1) broadcast to all ports. Switches (L2) learn MAC addresses and forward only to the correct port!", category: "ethernet" },
  { id: 22, question: "What speed does Gigabit Ethernet (1000BASE-T) provide?", correctAnswer: "1 Gbps (1000 Mbps)", options: ["1 Gbps (1000 Mbps)", "100 Mbps", "10 Gbps", "500 Mbps"], hint: "The name 'Gigabit' gives it away", explanation: "10BASE-T=10Mbps, 100BASE-TX=100Mbps, 1000BASE-T=1Gbps, 10GBASE-T=10Gbps. Each is 10x faster!", category: "ethernet" },
  // === Addressing ===
  { id: 23, question: "How long is a MAC address?", correctAnswer: "48 bits (6 bytes)", options: ["48 bits (6 bytes)", "32 bits (4 bytes)", "64 bits (8 bytes)", "128 bits (16 bytes)"], hint: "Format: AA:BB:CC:DD:EE:FF - count the hex digits", explanation: "MAC = 48 bits = 6 bytes = 12 hex digits. First 24 bits = OUI (manufacturer), last 24 = device ID!", category: "addressing" },
  { id: 24, question: "Which protocol resolves IP addresses to MAC addresses?", correctAnswer: "ARP", options: ["ARP", "RARP", "DNS", "ICMP"], hint: "Used on local network to find physical addresses", explanation: "ARP = Address Resolution Protocol. Broadcasts 'Who has this IP?' and gets MAC response!", category: "addressing" },
  { id: 25, question: "How long is an IPv4 address?", correctAnswer: "32 bits (4 octets)", options: ["32 bits (4 octets)", "64 bits", "128 bits", "48 bits"], hint: "Written as four numbers separated by dots (e.g., 192.168.1.1)", explanation: "IPv4 = 32 bits = 4 octets. Each octet ranges 0-255. Total possible addresses: 2^32 ≈ 4.3 billion!", category: "addressing" },
  { id: 26, question: "How long is an IPv6 address?", correctAnswer: "128 bits", options: ["128 bits", "32 bits", "64 bits", "256 bits"], hint: "Written as eight groups of four hex digits", explanation: "IPv6 = 128 bits = 8 groups of 4 hex digits. Provides 2^128 addresses — virtually unlimited!", category: "addressing" },
  { id: 27, question: "What does NAT (Network Address Translation) do?", correctAnswer: "Translates private IPs to public IPs for internet access", options: ["Translates private IPs to public IPs for internet access", "Assigns MAC addresses", "Encrypts traffic", "Routes between VLANs"], hint: "Your home router uses this so multiple devices share one public IP", explanation: "NAT maps private addresses (192.168.x.x) to a single public IP. PAT (Port Address Translation) adds port numbers!", category: "addressing" },
  { id: 28, question: "Which private IP range is most common for home networks?", correctAnswer: "192.168.0.0/16", options: ["192.168.0.0/16", "10.0.0.0/8", "172.16.0.0/12", "224.0.0.0/4"], hint: "Most home routers use 192.168.x.x", explanation: "RFC 1918 private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. 224.0.0.0/4 is multicast!", category: "addressing" },
  // === Wireless & Security Protocols ===
  { id: 29, question: "What is the current strongest WiFi security protocol?", correctAnswer: "WPA3", options: ["WPA3", "WPA2", "WEP", "WPA"], hint: "The newest and most secure wireless standard", explanation: "WPA3 uses SAE (Simultaneous Authentication of Equals). WEP is broken. WPA2 uses AES but has KRACK vulnerability!", category: "protocols" },
  { id: 30, question: "What does a VLAN (Virtual LAN) do?", correctAnswer: "Logically segments a network without physical separation", options: ["Logically segments a network without physical separation", "Encrypts all traffic", "Speeds up the network", "Replaces switches"], hint: "It creates separate broadcast domains on the same switch", explanation: "VLANs segment networks logically. Devices in different VLANs need a router to communicate. Reduces broadcast storms!", category: "ethernet" },
];

const NetworkProtocolGame: React.FC = () => {
  const { playSound, addXp } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const challenge = challenges[currentIndex];
  const isCorrect = selectedAnswer === challenge?.correctAnswer;
  const progress = ((currentIndex + 1) / challenges.length) * 100;

  const shuffledOptions = useMemo(() => {
    return shuffleArray(challenge.options);
  }, [currentIndex]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === challenge.correctAnswer) {
      playSound("success");
      setScore(s => s + (showHint ? 15 : 25));
      addXp(10);
    } else {
      playSound("error");
    }
  };

  const nextChallenge = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      setGameComplete(true);
      playSound("levelUp");
    }
  };

  const categoryIcons = {
    "osi": <Layers className="w-4 h-4" />,
    "tcp-ip": <Globe className="w-4 h-4" />,
    "protocols": <Server className="w-4 h-4" />,
    "ethernet": <Cable className="w-4 h-4" />,
    "addressing": <Wifi className="w-4 h-4" />
  };

  const categoryColors = {
    "osi": "bg-purple-500/10 text-purple-500",
    "tcp-ip": "bg-blue-500/10 text-blue-500",
    "protocols": "bg-green-500/10 text-green-500",
    "ethernet": "bg-orange-500/10 text-orange-500",
    "addressing": "bg-pink-500/10 text-pink-500"
  };

  if (gameComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-7xl mb-6">🌐</div>
        <h2 className="text-3xl font-bold mb-4">Network Protocol Expert!</h2>
        <p className="text-xl text-muted-foreground mb-6">Score: {score} points</p>

        {/* OSI Quick Reference */}
        <div className="bg-muted/30 rounded-lg p-6 max-w-md mx-auto mb-6">
          <h4 className="font-bold mb-4 flex items-center gap-2 justify-center">
            <Layers className="w-5 h-5 text-primary" />
            OSI Model Quick Reference
          </h4>
          <div className="space-y-1 text-sm text-left">
            {[
              { layer: 7, name: "Application", examples: "HTTP, FTP, DNS" },
              { layer: 6, name: "Presentation", examples: "SSL/TLS, JPEG" },
              { layer: 5, name: "Session", examples: "NetBIOS, RPC" },
              { layer: 4, name: "Transport", examples: "TCP, UDP" },
              { layer: 3, name: "Network", examples: "IP, ICMP, Routers" },
              { layer: 2, name: "Data Link", examples: "Ethernet, Switches" },
              { layer: 1, name: "Physical", examples: "Cables, Hubs" },
            ].map((l) => (
              <div key={l.layer} className="flex items-center gap-2 p-1 bg-muted/30 rounded">
                <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                  {l.layer}
                </Badge>
                <span className="font-medium w-24">{l.name}</span>
                <span className="text-muted-foreground text-xs">{l.examples}</span>
              </div>
            ))}
          </div>
        </div>

        <Button size="lg" onClick={() => window.location.reload()} className="gap-2">
          <Network className="w-5 h-5" />
          Practice Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            {currentIndex + 1}/{challenges.length}
          </Badge>
          <Badge className={categoryColors[challenge.category]}>
            <span className="flex items-center gap-1">
              {categoryIcons[challenge.category]}
              {challenge.category.toUpperCase()}
            </span>
          </Badge>
          {challenge.layer && (
            <Badge variant="outline">Layer {challenge.layer}</Badge>
          )}
        </div>
        <Badge variant="secondary" className="text-lg px-4">
          {score} pts
        </Badge>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Network Protocols & OSI Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-foreground font-medium">{challenge.question}</p>
            {challenge.context && (
              <p className="text-sm text-muted-foreground mt-2">{challenge.context}</p>
            )}
          </div>

          {!showHint && !showResult && (
            <Button variant="outline" size="sm" onClick={() => setShowHint(true)} className="gap-2">
              <Lightbulb className="w-4 h-4" />
              Need a hint? (-10 points)
            </Button>
          )}

          {showHint && !showResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-sm"
            >
              💡 {challenge.hint}
            </motion.div>
          )}

          <div className="grid gap-3">
            {shuffledOptions.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === challenge.correctAnswer;

              return (
                <motion.button
                  key={option}
                  whileHover={{ scale: showResult ? 1 : 1.02 }}
                  whileTap={{ scale: showResult ? 1 : 0.98 }}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    showResult
                      ? isCorrectOption
                        ? "bg-success/20 border-success"
                        : isSelected
                        ? "bg-destructive/20 border-destructive"
                        : "bg-muted/50 border-muted"
                      : "bg-card hover:bg-muted/50 border-muted hover:border-primary cursor-pointer"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrectOption && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                    {showResult && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  isCorrect
                    ? "bg-success/10 border border-success/30"
                    : "bg-destructive/10 border border-destructive/30"
                }`}
              >
                <p className="font-bold mb-2">
                  {isCorrect ? "🎯 Correct!" : "❌ Not quite!"}
                </p>
                <p className="text-sm text-muted-foreground">{challenge.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {showResult && (
            <Button onClick={nextChallenge} className="w-full">
              {currentIndex < challenges.length - 1 ? "Next Challenge" : "See Results"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkProtocolGame;
