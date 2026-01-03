import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGame } from '@/contexts/GameContext';

interface AccessibilitySettings {
  // Visual
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  dyslexiaFont: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  
  // Audio
  screenReaderMode: boolean;
  soundEffects: boolean;
  readAloud: boolean;
  readAloudSpeed: number; // 0.5 - 2.0
  
  // Interaction
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  extendedTimeouts: boolean;
  singleClickMode: boolean;
  
  // Cognitive
  simplifiedMode: boolean;
  breakReminders: boolean;
  breakIntervalMinutes: number;
  progressPersistence: boolean;
  autoSave: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  applyDyslexiaFont: () => void;
  speak: (text: string) => void;
  announceToScreenReader: (message: string) => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  dyslexiaFont: false,
  colorBlindMode: 'none',
  screenReaderMode: false,
  soundEffects: true,
  readAloud: false,
  readAloudSpeed: 1.0,
  keyboardNavigation: true,
  focusIndicators: true,
  extendedTimeouts: false,
  singleClickMode: false,
  simplifiedMode: false,
  breakReminders: false,
  breakIntervalMinutes: 25,
  progressPersistence: true,
  autoSave: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Large text
    if (settings.largeText) {
      root.style.fontSize = '120%';
    } else {
      root.style.fontSize = '';
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Dyslexia font
    if (settings.dyslexiaFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }
    
    // Color blind modes
    root.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (settings.colorBlindMode !== 'none') {
      root.classList.add(settings.colorBlindMode);
    }
    
    // Focus indicators
    if (settings.focusIndicators) {
      root.classList.add('focus-visible-ring');
    } else {
      root.classList.remove('focus-visible-ring');
    }
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Break reminder timer
  useEffect(() => {
    if (!settings.breakReminders) return;
    
    const interval = setInterval(() => {
      if (Notification.permission === 'granted') {
        new Notification('Time for a break! 🧘', {
          body: 'You\'ve been learning for a while. Take a short break to refresh your mind.',
          icon: '/favicon.png',
        });
      }
    }, settings.breakIntervalMinutes * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [settings.breakReminders, settings.breakIntervalMinutes]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('accessibility-settings');
  };

  const applyDyslexiaFont = () => {
    updateSetting('dyslexiaFont', !settings.dyslexiaFont);
  };

  const speak = (text: string) => {
    if (!settings.readAloud) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.readAloudSpeed;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return (
    <AccessibilityContext.Provider value={{
      settings,
      updateSetting,
      resetSettings,
      applyDyslexiaFont,
      speak,
      announceToScreenReader,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

// Accessibility Settings Panel Component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Eye, Volume2, Keyboard, Brain, RotateCcw, 
  Type, Palette, Clock, Hand, Speaker
} from 'lucide-react';

export const AccessibilityPanel: React.FC = () => {
  const { settings, updateSetting, resetSettings } = useAccessibility();
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Accessibility Settings</h1>
        <Button variant="outline" onClick={resetSettings} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset All
        </Button>
      </div>

      {/* Visual Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Visual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>High Contrast</Label>
              <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
            </div>
            <Switch 
              checked={settings.highContrast} 
              onCheckedChange={(v) => updateSetting('highContrast', v)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Large Text</Label>
              <p className="text-sm text-muted-foreground">Increase font size throughout</p>
            </div>
            <Switch 
              checked={settings.largeText} 
              onCheckedChange={(v) => updateSetting('largeText', v)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
            </div>
            <Switch 
              checked={settings.reducedMotion} 
              onCheckedChange={(v) => updateSetting('reducedMotion', v)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Dyslexia-Friendly Font</Label>
              <p className="text-sm text-muted-foreground">Use OpenDyslexic font</p>
            </div>
            <Switch 
              checked={settings.dyslexiaFont} 
              onCheckedChange={(v) => updateSetting('dyslexiaFont', v)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Color Blind Mode</Label>
            <Select 
              value={settings.colorBlindMode} 
              onValueChange={(v: any) => updateSetting('colorBlindMode', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audio Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Audio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Sound Effects</Label>
              <p className="text-sm text-muted-foreground">Play sounds for interactions</p>
            </div>
            <Switch 
              checked={settings.soundEffects} 
              onCheckedChange={(v) => updateSetting('soundEffects', v)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Read Aloud</Label>
              <p className="text-sm text-muted-foreground">Text-to-speech for content</p>
            </div>
            <Switch 
              checked={settings.readAloud} 
              onCheckedChange={(v) => updateSetting('readAloud', v)} 
            />
          </div>
          
          {settings.readAloud && (
            <div className="space-y-2">
              <Label>Reading Speed: {settings.readAloudSpeed.toFixed(1)}x</Label>
              <Slider
                value={[settings.readAloudSpeed]}
                onValueChange={([v]) => updateSetting('readAloudSpeed', v)}
                min={0.5}
                max={2.0}
                step={0.1}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Screen Reader Mode</Label>
              <p className="text-sm text-muted-foreground">Optimize for screen readers</p>
            </div>
            <Switch 
              checked={settings.screenReaderMode} 
              onCheckedChange={(v) => updateSetting('screenReaderMode', v)} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Interaction Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Interaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Keyboard Navigation</Label>
              <p className="text-sm text-muted-foreground">Navigate using keyboard only</p>
            </div>
            <Switch 
              checked={settings.keyboardNavigation} 
              onCheckedChange={(v) => updateSetting('keyboardNavigation', v)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Focus Indicators</Label>
              <p className="text-sm text-muted-foreground">Show clear focus outlines</p>
            </div>
            <Switch 
              checked={settings.focusIndicators} 
              onCheckedChange={(v) => updateSetting('focusIndicators', v)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Extended Timeouts</Label>
              <p className="text-sm text-muted-foreground">More time for timed activities</p>
            </div>
            <Switch 
              checked={settings.extendedTimeouts} 
              onCheckedChange={(v) => updateSetting('extendedTimeouts', v)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Single Click Mode</Label>
              <p className="text-sm text-muted-foreground">Avoid double-clicks</p>
            </div>
            <Switch 
              checked={settings.singleClickMode} 
              onCheckedChange={(v) => updateSetting('singleClickMode', v)} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Cognitive Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Cognitive Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Simplified Mode</Label>
              <p className="text-sm text-muted-foreground">Reduce visual complexity</p>
            </div>
            <Switch 
              checked={settings.simplifiedMode} 
              onCheckedChange={(v) => updateSetting('simplifiedMode', v)} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Break Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded to take breaks</p>
            </div>
            <Switch 
              checked={settings.breakReminders} 
              onCheckedChange={(v) => updateSetting('breakReminders', v)} 
            />
          </div>
          
          {settings.breakReminders && (
            <div className="space-y-2">
              <Label>Break Interval: {settings.breakIntervalMinutes} minutes</Label>
              <Slider
                value={[settings.breakIntervalMinutes]}
                onValueChange={([v]) => updateSetting('breakIntervalMinutes', v)}
                min={10}
                max={60}
                step={5}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-Save Progress</Label>
              <p className="text-sm text-muted-foreground">Automatically save your work</p>
            </div>
            <Switch 
              checked={settings.autoSave} 
              onCheckedChange={(v) => updateSetting('autoSave', v)} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityProvider;
