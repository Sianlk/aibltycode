import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Users, Search, Crown, Shield, Gift, Ban, Loader2, CheckCircle, XCircle
} from "lucide-react";

interface UserProfile {
  id: string;
  display_name: string | null;
  xp: number | null;
  mode: string | null;
  created_at: string | null;
  streak_days: number | null;
}

interface UserSub {
  user_id: string;
  status: string;
  is_grandfathered: boolean | null;
}

export function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [subscriptions, setSubscriptions] = useState<Record<string, UserSub>>({});
  const [roles, setRoles] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const [
      { data: profilesData },
      { data: subsData },
      { data: rolesData }
    ] = await Promise.all([
      supabase.from("profiles").select("id, display_name, xp, mode, created_at, streak_days").order("created_at", { ascending: false }),
      supabase.from("subscriptions").select("user_id, status, is_grandfathered"),
      supabase.from("user_roles").select("user_id, role")
    ]);

    setUsers(profilesData || []);

    const subMap: Record<string, UserSub> = {};
    (subsData || []).forEach(s => { subMap[s.user_id] = s; });
    setSubscriptions(subMap);

    const roleMap: Record<string, string> = {};
    (rolesData || []).forEach(r => { roleMap[r.user_id] = r.role; });
    setRoles(roleMap);

    setLoading(false);
  }

  async function grantFreeAccess(userId: string) {
    setActionLoading(userId);
    try {
      const existing = subscriptions[userId];
      if (existing) {
        await supabase.from("subscriptions").update({ is_grandfathered: true, status: "active" }).eq("user_id", userId);
      } else {
        await supabase.from("subscriptions").insert({ user_id: userId, is_grandfathered: true, status: "active" });
      }
      toast({ title: "Free access granted!" });
      await fetchUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setActionLoading(null);
  }

  async function revokeFreeAccess(userId: string) {
    setActionLoading(userId);
    try {
      await supabase.from("subscriptions").update({ is_grandfathered: false, status: "inactive" }).eq("user_id", userId);
      toast({ title: "Access revoked" });
      await fetchUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setActionLoading(null);
  }

  const filtered = users.filter(u =>
    !search || (u.display_name || "").toLowerCase().includes(search.toLowerCase()) || u.id.includes(search)
  );

  const getAccessStatus = (userId: string) => {
    const role = roles[userId];
    if (role === "admin") return "admin";
    const sub = subscriptions[userId];
    if (sub?.is_grandfathered) return "free-granted";
    if (sub?.status === "active") return "subscribed";
    return "free-tier";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Management ({users.length} users)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-lg border overflow-auto max-h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>XP</TableHead>
                  <TableHead>Streak</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => {
                  const access = getAccessStatus(user.id);
                  const isLoading = actionLoading === user.id;

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.display_name || "Anonymous"}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{user.xp || 0}</TableCell>
                      <TableCell>{user.streak_days || 0}🔥</TableCell>
                      <TableCell>
                        {roles[user.id] === "admin" ? (
                          <Badge className="gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 border-0">
                            <Crown className="h-3 w-3" /> Admin
                          </Badge>
                        ) : (
                          <Badge variant="secondary">{roles[user.id] || "user"}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {access === "admin" && (
                          <Badge className="gap-1" variant="default">
                            <Shield className="h-3 w-3" /> Full Access
                          </Badge>
                        )}
                        {access === "free-granted" && (
                          <Badge className="gap-1 bg-green-600 border-0">
                            <Gift className="h-3 w-3" /> Free Granted
                          </Badge>
                        )}
                        {access === "subscribed" && (
                          <Badge className="gap-1 bg-blue-600 border-0">
                            <CheckCircle className="h-3 w-3" /> Subscribed
                          </Badge>
                        )}
                        {access === "free-tier" && (
                          <Badge variant="outline" className="gap-1">
                            <XCircle className="h-3 w-3" /> Free Tier
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {access !== "admin" && (
                          <div className="flex gap-2">
                            {access !== "free-granted" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => grantFreeAccess(user.id)}
                                disabled={isLoading}
                                className="gap-1"
                              >
                                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Gift className="h-3 w-3" />}
                                Grant Free
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => revokeFreeAccess(user.id)}
                                disabled={isLoading}
                                className="gap-1"
                              >
                                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Ban className="h-3 w-3" />}
                                Revoke
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}