import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Zap, Car, Utensils, Trash2, Leaf, TrendingUp, Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTransition from "@/components/PageTransition";
import AnimatedCounter from "@/components/AnimatedCounter";
import { DailyActivity, calculateImpact, getSuggestions, ECO_TIPS, getRealWeeklyData } from "@/lib/eco-data";
import { getTodayActivity, saveActivity, getUser, getAllActivities } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [showModal, setShowModal] = useState(true);
  const [activity, setActivity] = useState<DailyActivity>(getTodayActivity());
  const [tip] = useState(ECO_TIPS[Math.floor(Math.random() * ECO_TIPS.length)]);
  const allActivities = getAllActivities();
  const weeklyData = getRealWeeklyData(allActivities);

  useEffect(() => {
    if (!user) navigate("/onboarding");
  }, [user, navigate]);

  const impact = calculateImpact(activity);
  const suggestions = getSuggestions(impact, activity);

  const updateField = (category: keyof DailyActivity, field: string, value: number) => {
    const updated = { ...activity, [category]: { ...(activity[category] as Record<string, number>), [field]: value } };
    setActivity(updated);
    saveActivity(updated);
  };

  const InputRow = ({ label, category, field, icon: Icon }: { label: string; category: keyof DailyActivity; field: string; icon?: React.ElementType }) => (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 min-w-0">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground shrink-0" />}
        <span className="text-sm truncate">{label}</span>
      </div>
      <Input
        type="number"
        min={0}
        className="w-24 text-right"
        value={(activity[category] as Record<string, number>)[field] || 0}
        onChange={(e) => updateField(category, field, parseFloat(e.target.value) || 0)}
      />
    </div>
  );

  if (!user) return null;

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Modal */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="eco-card max-w-sm w-full mx-4 text-center relative"
                >
                  <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-display font-bold mb-2">Welcome back, {user.name}! 🌱</h2>
                  <p className="text-muted-foreground mb-6 text-sm">What would you like to do today?</p>
                  <div className="flex flex-col gap-3">
                    <Button className="eco-gradient border-0 text-primary-foreground" onClick={() => setShowModal(false)}>
                      Enter Today's Activities
                    </Button>
                    <Button variant="outline" onClick={() => { setShowModal(false); navigate("/stats"); }}>
                      View My Environmental Stats
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Daily Tip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="eco-card mb-6 flex items-start gap-3 bg-primary/5 border-primary/20">
            <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">Daily Eco Tip</span>
              <p className="text-sm text-foreground/80 mt-1">{tip}</p>
            </div>
          </motion.div>

          {/* Impact Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Eco Score", value: impact.ecoScore, suffix: "/100", icon: Leaf, color: "text-primary" },
              { label: "Carbon", value: impact.carbon, suffix: "kg", icon: TrendingUp, color: "text-leaf" },
              { label: "Water", value: impact.water, suffix: "L", icon: Droplets, color: "text-aqua" },
              { label: "Energy", value: impact.energy, suffix: "kWh", icon: Zap, color: "text-accent" },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="p-4 hover-lift">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                  </div>
                  <div className="text-2xl font-bold">
                    <AnimatedCounter value={item.value} suffix={item.suffix} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Weekly Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 mb-6">
              <h3 className="font-bold mb-4">Weekly Eco Score Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(152, 45%, 32%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(152, 45%, 32%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs" />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(40,20%,90%)", fontSize: 13 }} />
                  <Area type="monotone" dataKey="score" stroke="hsl(152, 45%, 32%)" fill="url(#scoreGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Activity Input */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 mb-6">
              <h3 className="font-bold mb-4">Log Today's Activities</h3>
              <Tabs defaultValue="water">
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="water"><Droplets className="w-4 h-4" /></TabsTrigger>
                  <TabsTrigger value="electricity"><Zap className="w-4 h-4" /></TabsTrigger>
                  <TabsTrigger value="transport"><Car className="w-4 h-4" /></TabsTrigger>
                  <TabsTrigger value="food"><Utensils className="w-4 h-4" /></TabsTrigger>
                  <TabsTrigger value="waste"><Trash2 className="w-4 h-4" /></TabsTrigger>
                </TabsList>
                <TabsContent value="water" className="space-y-3">
                  <InputRow label="Liters used" category="water" field="liters" />
                  <InputRow label="Showers taken" category="water" field="showers" />
                  <InputRow label="Dishwashing cycles" category="water" field="dishwashing" />
                </TabsContent>
                <TabsContent value="electricity" className="space-y-3">
                  <InputRow label="AC hours" category="electricity" field="acHours" />
                  <InputRow label="Lights hours" category="electricity" field="lightsHours" />
                  <InputRow label="Device charging hrs" category="electricity" field="deviceCharging" />
                </TabsContent>
                <TabsContent value="transport" className="space-y-3">
                  <InputRow label="Car (km)" category="transport" field="carKm" />
                  <InputRow label="Bus (km)" category="transport" field="busKm" />
                  <InputRow label="Walking (km)" category="transport" field="walkKm" />
                  <InputRow label="Bicycle (km)" category="transport" field="bicycleKm" />
                  <InputRow label="Train (km)" category="transport" field="trainKm" />
                </TabsContent>
                <TabsContent value="food" className="space-y-3">
                  <InputRow label="Vegetarian meals" category="food" field="vegetarian" />
                  <InputRow label="Vegan meals" category="food" field="vegan" />
                  <InputRow label="Meat meals" category="food" field="meat" />
                </TabsContent>
                <TabsContent value="waste" className="space-y-3">
                  <InputRow label="Recycled (kg)" category="waste" field="recycledKg" />
                  <InputRow label="Plastic items" category="waste" field="plasticItems" />
                  <InputRow label="Composted (kg)" category="waste" field="compostKg" />
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Suggestions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" /> Smart Suggestions
              </h3>
              <div className="space-y-3">
                {suggestions.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    <Leaf className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm">{s}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
