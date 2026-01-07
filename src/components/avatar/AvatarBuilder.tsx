import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Check, Sparkles, Crown, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarItem {
  id: string;
  category: string;
  name: string;
  icon: string | null;
  rarity: string;
  unlock_requirement: string | null;
  xp_cost: number;
}

interface AvatarConfig {
  head?: string;
  body?: string;
  accessory?: string;
  background?: string;
  effect?: string;
}

const rarityColors: Record<string, string> = {
  common: 'bg-muted text-muted-foreground',
  rare: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  epic: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  legendary: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
};

const rarityGlow: Record<string, string> = {
  common: '',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/30',
  legendary: 'shadow-amber-500/50 animate-pulse',
};

export const AvatarBuilder: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<AvatarItem[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [config, setConfig] = useState<AvatarConfig>({});
  const [userXp, setUserXp] = useState(0);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const [itemsRes, unlockedRes, profileRes] = await Promise.all([
      supabase.from('avatar_items').select('*').order('xp_cost'),
      supabase.from('user_avatar_items').select('item_id').eq('user_id', user.id),
      supabase.from('profiles').select('xp, avatar_config').eq('id', user.id).single()
    ]);

    setItems(itemsRes.data || []);
    setUnlockedIds(new Set((unlockedRes.data || []).map(u => u.item_id)));
    setUserXp(profileRes.data?.xp || 0);
    
    const savedConfig = profileRes.data?.avatar_config;
    if (savedConfig && typeof savedConfig === 'object') {
      setConfig(savedConfig as AvatarConfig);
    }
    
    setLoading(false);
  };

  const unlockItem = async (item: AvatarItem) => {
    if (!user || unlocking) return;
    
    if (userXp < item.xp_cost) {
      toast.error(`Need ${item.xp_cost - userXp} more XP to unlock!`);
      return;
    }

    setUnlocking(item.id);
    
    try {
      // Insert unlock record
      const { error: unlockError } = await supabase
        .from('user_avatar_items')
        .insert({ user_id: user.id, item_id: item.id });

      if (unlockError) throw unlockError;

      // Deduct XP
      const { error: xpError } = await supabase
        .from('profiles')
        .update({ xp: userXp - item.xp_cost })
        .eq('id', user.id);

      if (xpError) throw xpError;

      setUnlockedIds(prev => new Set([...prev, item.id]));
      setUserXp(prev => prev - item.xp_cost);
      toast.success(`Unlocked ${item.name}!`, { icon: '🎉' });
    } catch (error) {
      toast.error('Failed to unlock item');
    } finally {
      setUnlocking(null);
    }
  };

  const equipItem = async (item: AvatarItem) => {
    if (!user) return;
    
    const newConfig = { ...config, [item.category]: item.id };
    setConfig(newConfig);

    await supabase
      .from('profiles')
      .update({ avatar_config: newConfig })
      .eq('id', user.id);

    toast.success(`Equipped ${item.name}!`);
  };

  const getItemsByCategory = (category: string) => 
    items.filter(i => i.category === category);

  const isEquipped = (item: AvatarItem) => config[item.category as keyof AvatarConfig] === item.id;

  const categories = ['head', 'body', 'accessory', 'background', 'effect'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Avatar Builder
          </CardTitle>
          <Badge className="bg-primary/20 text-primary">
            <Zap className="w-3 h-3 mr-1" />
            {userXp} XP
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Preview */}
        <div className="flex justify-center mb-6">
          <motion.div 
            className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden"
            animate={{ boxShadow: ['0 0 20px hsla(187,92%,50%,0.3)', '0 0 40px hsla(270,70%,60%,0.3)', '0 0 20px hsla(187,92%,50%,0.3)'] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            {/* Background */}
            {config.background && (
              <div className="absolute inset-0 text-6xl flex items-center justify-center opacity-30">
                {items.find(i => i.id === config.background)?.icon}
              </div>
            )}
            
            {/* Body */}
            <div className="text-5xl z-10">
              {items.find(i => i.id === config.body)?.icon || '🧑‍💻'}
            </div>
            
            {/* Head */}
            {config.head && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-3xl">
                {items.find(i => i.id === config.head)?.icon}
              </div>
            )}
            
            {/* Accessory */}
            {config.accessory && (
              <div className="absolute bottom-2 right-2 text-2xl">
                {items.find(i => i.id === config.accessory)?.icon}
              </div>
            )}
            
            {/* Effect */}
            {config.effect && (
              <motion.div 
                className="absolute inset-0 text-4xl flex items-center justify-center pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {items.find(i => i.id === config.effect)?.icon}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Item Categories */}
        <Tabs defaultValue="head" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="text-xs capitalize">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <AnimatePresence>
                  {getItemsByCategory(category).map((item, index) => {
                    const isUnlocked = unlockedIds.has(item.id) || !item.unlock_requirement;
                    const equipped = isEquipped(item);

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          equipped 
                            ? 'border-primary bg-primary/20 shadow-lg ' + rarityGlow[item.rarity]
                            : isUnlocked
                            ? 'border-border hover:border-primary/50 bg-card'
                            : 'border-border/50 bg-muted/30 opacity-60'
                        }`}
                        onClick={() => isUnlocked ? equipItem(item) : unlockItem(item)}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{item.icon}</div>
                          <p className="text-xs font-medium truncate">{item.name}</p>
                          <Badge className={`text-[10px] mt-1 ${rarityColors[item.rarity]}`}>
                            {item.rarity}
                          </Badge>
                        </div>

                        {equipped && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}

                        {!isUnlocked && (
                          <div className="absolute inset-0 rounded-xl bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center">
                            <Lock className="w-5 h-5 text-muted-foreground mb-1" />
                            <span className="text-xs font-medium text-primary">{item.xp_cost} XP</span>
                          </div>
                        )}

                        {unlocking === item.id && (
                          <div className="absolute inset-0 rounded-xl bg-background/80 flex items-center justify-center">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                          </div>
                        )}

                        {item.rarity === 'legendary' && isUnlocked && (
                          <motion.div
                            className="absolute -top-1 -right-1"
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <Crown className="w-4 h-4 text-amber-400" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
