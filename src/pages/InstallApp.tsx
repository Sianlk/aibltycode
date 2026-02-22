import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Monitor, Check, Apple, Tablet } from "lucide-react";
import { motion } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-3">📱 Get the AIblty App</h1>
          <p className="text-muted-foreground">Install AIblty on your device for the best learning experience — works offline!</p>
        </motion.div>

        {isInstalled ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-success/10 border border-success/30 rounded-2xl p-8 text-center">
            <Check className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-success mb-2">Already Installed!</h2>
            <p className="text-muted-foreground">AIblty is installed on your device. Open it from your home screen.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {deferredPrompt && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-primary/10 border border-primary/30 rounded-2xl p-8 text-center">
                <Download className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-3">Install Now</h2>
                <Button size="lg" onClick={handleInstall} className="gap-2">
                  <Download className="w-5 h-5" /> Install AIblty
                </Button>
              </motion.div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-card border border-border rounded-xl p-6">
                <Smartphone className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-bold mb-2">Android</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Open AIblty in Chrome</li>
                  <li>Tap the menu (⋮) button</li>
                  <li>Select "Install app" or "Add to Home screen"</li>
                  <li>Confirm the installation</li>
                </ol>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <Apple className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-bold mb-2">iPhone / iPad</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Open AIblty in Safari</li>
                  <li>Tap the Share button (↑)</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" to confirm</li>
                </ol>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <Monitor className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-bold mb-2">Desktop (Chrome/Edge)</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Look for the install icon (⊕) in the address bar</li>
                  <li>Or open menu → "Install AIblty"</li>
                  <li>Click "Install" to confirm</li>
                </ol>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <Tablet className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-bold mb-2">Native App (Coming Soon)</h3>
                <p className="text-sm text-muted-foreground">
                  Native iOS and Android apps will be available on the App Store and Google Play soon.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold mb-3">✨ Why Install?</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Works offline</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Faster loading</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Full-screen mode</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Home screen icon</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Push notifications</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Auto-updates</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
