import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface VoiceChatProps {
  roomId: string;
  isEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export function VoiceChat({ roomId, isEnabled = false, onToggle }: VoiceChatProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [showSettings, setShowSettings] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Simulate audio level visualization
  const updateAudioLevel = useCallback(() => {
    if (analyserRef.current && !isMuted && isConnected) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255);
    } else {
      setAudioLevel(0);
    }
    animationRef.current = requestAnimationFrame(updateAudioLevel);
  }, [isMuted, isConnected]);

  const connectVoice = async () => {
    setIsConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Setup audio analysis
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      setIsConnected(true);
      onToggle?.(true);
      updateAudioLevel();
    } catch (error) {
      console.error('Failed to access microphone:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectVoice = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsConnected(false);
    setAudioLevel(0);
    onToggle?.(false);
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  useEffect(() => {
    return () => {
      disconnectVoice();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="flex items-center gap-2 p-3 rounded-xl glass border border-primary/20">
        {/* Connection Button */}
        <Button
          variant={isConnected ? "destructive" : "default"}
          size="sm"
          onClick={isConnected ? disconnectVoice : connectVoice}
          disabled={isConnecting}
          className={cn(
            "gap-2 transition-all duration-300",
            isConnected && "bg-destructive hover:bg-destructive/90",
            isConnecting && "opacity-50"
          )}
        >
          {isConnecting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            />
          ) : isConnected ? (
            <PhoneOff className="w-4 h-4" />
          ) : (
            <Phone className="w-4 h-4" />
          )}
          {isConnecting ? 'Connecting...' : isConnected ? 'Leave' : 'Join Voice'}
        </Button>

        {isConnected && (
          <AnimatePresence>
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              {/* Mute Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className={cn(
                  "relative h-9 w-9 rounded-lg transition-all",
                  isMuted ? "bg-destructive/20 text-destructive" : "hover:bg-primary/20"
                )}
              >
                {/* Audio level indicator */}
                {!isMuted && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-primary/30"
                    style={{ transform: `scale(${1 + audioLevel * 0.3})` }}
                    animate={{ opacity: audioLevel > 0.1 ? 1 : 0 }}
                  />
                )}
                {isMuted ? (
                  <MicOff className="w-4 h-4 relative z-10" />
                ) : (
                  <Mic className={cn("w-4 h-4 relative z-10", audioLevel > 0.1 && "voice-active")} />
                )}
              </Button>

              {/* Deafen Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDeafened(!isDeafened)}
                className={cn(
                  "h-9 w-9 rounded-lg transition-all",
                  isDeafened ? "bg-destructive/20 text-destructive" : "hover:bg-primary/20"
                )}
              >
                {isDeafened ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>

              {/* Settings Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className="h-9 w-9 rounded-lg hover:bg-primary/20"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 px-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-success"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs text-muted-foreground">Connected</span>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl glass border border-primary/20 z-50"
          >
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Volume</label>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Room: {roomId.slice(0, 8)}...</span>
                <span className="text-success">Latency: 24ms</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default VoiceChat;
