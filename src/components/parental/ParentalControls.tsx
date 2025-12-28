import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Lock, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function ParentalControls() {
  const { parentalControls, setParentalControls, isParentalLocked, unlockParental, lockParental, gameMode } = useGame();
  const [pinInput, setPinInput] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showSetup, setShowSetup] = useState(false);

  // Only show for Kids mode
  if (gameMode !== "kid") {
    return null;
  }

  const handleUnlock = () => {
    if (unlockParental(pinInput)) {
      toast.success("Parental controls unlocked");
      setPinInput("");
    } else {
      toast.error("Incorrect PIN");
    }
  };

  const handleSetupPin = () => {
    if (newPin.length < 4) {
      toast.error("PIN must be at least 4 digits");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("PINs don't match");
      return;
    }
    setParentalControls({
      ...parentalControls,
      enabled: true,
      pin: newPin
    });
    setShowSetup(false);
    setNewPin("");
    setConfirmPin("");
    toast.success("Parental controls enabled");
  };

  const handleToggle = (enabled: boolean) => {
    if (enabled && !parentalControls.pin) {
      setShowSetup(true);
    } else {
      setParentalControls({ ...parentalControls, enabled });
    }
  };

  const handleTimeLimitChange = (value: string) => {
    const minutes = parseInt(value, 10);
    if (!isNaN(minutes) && minutes >= 0) {
      setParentalControls({ ...parentalControls, dailyTimeLimit: minutes });
    }
  };

  if (parentalControls.enabled && isParentalLocked) {
    return (
      <Card className="border-warning/50 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <Lock className="h-5 w-5" />
            Parental Controls Locked
          </CardTitle>
          <CardDescription>Enter your PIN to access settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              maxLength={6}
              className="flex-1"
            />
            <Button onClick={handleUnlock}>Unlock</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Parental Controls
        </CardTitle>
        <CardDescription>
          Manage settings for your child's learning experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Parental Controls</Label>
            <p className="text-sm text-muted-foreground">
              Require PIN to access settings
            </p>
          </div>
          <Switch
            checked={parentalControls.enabled}
            onCheckedChange={handleToggle}
          />
        </div>

        {/* PIN Setup Dialog */}
        <Dialog open={showSetup} onOpenChange={setShowSetup}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Up Parental PIN</DialogTitle>
              <DialogDescription>
                Create a 4-6 digit PIN to protect parental controls
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>New PIN</Label>
                <Input
                  type="password"
                  placeholder="Enter 4-6 digit PIN"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm PIN</Label>
                <Input
                  type="password"
                  placeholder="Confirm PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                />
              </div>
              <Button onClick={handleSetupPin} className="w-full">
                Set PIN
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {parentalControls.enabled && (
          <>
            {/* Daily Time Limit */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label>Daily Time Limit (minutes)</Label>
              </div>
              <Input
                type="number"
                value={parentalControls.dailyTimeLimit}
                onChange={(e) => handleTimeLimitChange(e.target.value)}
                min={0}
                max={480}
              />
              <p className="text-xs text-muted-foreground">
                Set to 0 for unlimited time
              </p>
            </div>

            {/* Allowed Hours */}
            <div className="space-y-2">
              <Label>Allowed Playing Hours</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={parentalControls.allowedHours.start}
                  onChange={(e) => setParentalControls({
                    ...parentalControls,
                    allowedHours: { ...parentalControls.allowedHours, start: parseInt(e.target.value, 10) || 0 }
                  })}
                  min={0}
                  max={23}
                  className="w-20"
                />
                <span>to</span>
                <Input
                  type="number"
                  value={parentalControls.allowedHours.end}
                  onChange={(e) => setParentalControls({
                    ...parentalControls,
                    allowedHours: { ...parentalControls.allowedHours, end: parseInt(e.target.value, 10) || 23 }
                  })}
                  min={0}
                  max={23}
                  className="w-20"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                24-hour format (e.g., 9 to 21 = 9 AM to 9 PM)
              </p>
            </div>

            {/* Change PIN */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Change PIN
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Parental PIN</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>New PIN</Label>
                    <Input
                      type="password"
                      placeholder="Enter new PIN"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm PIN</Label>
                    <Input
                      type="password"
                      placeholder="Confirm PIN"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                    />
                  </div>
                  <Button onClick={handleSetupPin} className="w-full">
                    Update PIN
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Lock Button */}
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={lockParental}
            >
              <Lock className="h-4 w-4 mr-2" />
              Lock Controls
            </Button>
          </>
        )}

        {!parentalControls.enabled && (
          <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
            <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Enable parental controls to set time limits and manage your child's learning experience.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
