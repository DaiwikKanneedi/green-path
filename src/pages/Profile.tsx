import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Trophy, Settings, Trash2, LogOut, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTransition from "@/components/PageTransition";
import AnimatedCounter from "@/components/AnimatedCounter";
import { getUser, saveUser, getAllActivities } from "@/lib/storage";
import { calculateImpact, ACHIEVEMENTS } from "@/lib/eco-data";

export default function Profile() {
  const navigate = useNavigate();
  const user = getUser();
  const [form, setForm] = useState(user || { name: "", email: "", country: "", householdSize: 1, units: "metric" as const, joinedDate: "" });

  useEffect(() => {
    if (!user) navigate("/onboarding");
  }, [user, navigate]);

  if (!user) return null;

  const activities = getAllActivities();
  const earned = ACHIEVEMENTS.filter((a) =>
    activities.some((act) => {
      const impact = calculateImpact(act);
      return a.condition(impact, act);
    })
  );

  const avgScore = activities.length > 0
    ? Math.round(activities.reduce((s, a) => s + calculateImpact(a).ecoScore, 0) / activities.length)
    : 0;

  const handleSave = () => {
    saveUser({ ...user, name: form.name, country: form.country, householdSize: form.householdSize, units: form.units });
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="w-20 h-20 rounded-full eco-gradient flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold">{user.name}</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Eco Score: <AnimatedCounter value={avgScore} suffix="/100" /></span>
            </div>
          </motion.div>

          <Tabs defaultValue="achievements">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="achievements"><Trophy className="w-4 h-4 mr-1" /> Achievements</TabsTrigger>
              <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-1" /> Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="achievements">
              <div className="grid gap-3">
                {ACHIEVEMENTS.map((a, i) => {
                  const isEarned = earned.some((e) => e.id === a.id);
                  return (
                    <motion.div key={a.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                      <Card className={`p-4 flex items-center gap-4 ${isEarned ? "" : "opacity-40"}`}>
                        <span className="text-3xl">{a.icon}</span>
                        <div>
                          <h3 className="font-semibold text-sm">{a.name}</h3>
                          <p className="text-xs text-muted-foreground">{a.description}</p>
                        </div>
                        {isEarned && <span className="ml-auto text-xs font-semibold text-primary">Earned ✓</span>}
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="p-6 space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                </div>
                <div>
                  <Label>Household Size</Label>
                  <Input type="number" min={1} value={form.householdSize} onChange={(e) => setForm({ ...form, householdSize: parseInt(e.target.value) || 1 })} />
                </div>
                <div>
                  <Label>Units</Label>
                  <div className="flex gap-3 mt-1">
                    {(["metric", "imperial"] as const).map((u) => (
                      <Button key={u} variant={form.units === u ? "default" : "outline"} size="sm" onClick={() => setForm({ ...form, units: u })}>
                        {u === "metric" ? "Metric (L, km)" : "Imperial (gal, mi)"}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button className="w-full eco-gradient border-0 text-primary-foreground" onClick={handleSave}>Save Changes</Button>
                <div className="border-t pt-4 space-y-3">
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Log Out
                  </Button>
                  <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleLogout}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
