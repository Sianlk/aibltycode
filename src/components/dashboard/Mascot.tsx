import { motion } from "framer-motion";

interface MascotProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function Mascot({ message = "Hey there, coder! 👋", size = "lg" }: MascotProps) {
  const sizeClasses = {
    sm: "w-16 h-16 text-3xl",
    md: "w-24 h-24 text-5xl",
    lg: "w-32 h-32 text-6xl",
  };

  return (
    <div className="flex flex-col items-center text-center">
      {/* Modern Robot Mascot */}
      <motion.div
        className={`relative ${sizeClasses[size]} mb-4`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
        
        {/* Main mascot container */}
        <motion.div
          className="relative w-full h-full rounded-2xl bg-gradient-to-br from-primary/90 to-accent/90 flex items-center justify-center shadow-lg border-2 border-primary/30"
          animate={{ 
            y: [0, -6, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          {/* Face */}
          <div className="relative flex flex-col items-center">
            {/* Eyes */}
            <div className="flex gap-3 mb-1">
              <motion.div
                className="w-4 h-4 bg-white rounded-full relative overflow-hidden"
                animate={{ scaleY: [1, 0.3, 1] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rounded-full" />
              </motion.div>
              <motion.div
                className="w-4 h-4 bg-white rounded-full relative overflow-hidden"
                animate={{ scaleY: [1, 0.3, 1] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rounded-full" />
              </motion.div>
            </div>
            {/* Smile */}
            <motion.div 
              className="w-6 h-3 border-b-2 border-white rounded-b-full"
              animate={{ scaleX: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Antenna */}
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-1 h-4 bg-primary-foreground/60 rounded-full" />
            <div className="w-3 h-3 bg-warning rounded-full -mt-1 -ml-1" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {message}
        </h1>
        <p className="text-muted-foreground">
          Let's master Java together through fun games and challenges!
        </p>
      </motion.div>
    </div>
  );
}
