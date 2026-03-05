import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import PageTransition from "@/components/PageTransition";
import AnimatedCounter from "@/components/AnimatedCounter";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Droplets, Zap, Wind, TrendingDown, Leaf } from "lucide-react";
import { getAllActivities } from "@/lib/storage";
import { getRealStatsData, calculateImpact, SUSTAINABLE_LIMITS } from "@/lib/eco-data";

export default function Stats() {
  const [period, setPeriod] = useState("weekly");
  const allActivities = getAllActivities();
  const data = getRealStatsData(allActivities, period);
  
  const hasData = data.length > 0 && data.some(d => d.carbon > 0 || d.water > 0 || d.energy > 0);
  
  const avgCarbon = hasData ? +(data.reduce((s, d) => s + d.carbon, 0) / data.filter(d => d.carbon > 0 || d.water > 0 || d.energy > 0).length).toFixed(1) : 0;
  const avgWater = hasData ? Math.round(data.reduce((s, d) => s + d.water, 0) / data.filter(d => d.carbon > 0 || d.water > 0 || d.energy > 0).length) : 0;
  const avgEnergy = hasData ? +(data.reduce((s, d) => s + d.energy, 0) / data.filter(d => d.carbon > 0 || d.water > 0 || d.energy > 0).length).toFixed(1) : 0;

  // Real comparisons based on actual data vs sustainable limits
  const waterComparison = hasData ? Math.round(Math.max(0, (1 - avgWater / SUSTAINABLE_LIMITS.water) * 100)) : 0;
  const carbonComparison = hasData ? Math.round(Math.max(0, (1 - avgCarbon / SUSTAINABLE_LIMITS.carbon) * 100)) : 0;

  const chartStyle = { borderRadius: 12, border: "1px solid hsl(40,20%,90%)", fontSize: 12 };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold text-center mb-2">
            Environmental Stats
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-center mb-8">
            Deep dive into your environmental impact over time.
          </motion.p>

          <Tabs value={period} onValueChange={setPeriod} className="mb-8">
            <TabsList className="grid grid-cols-4 max-w-md mx-auto">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>

          {!hasData ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-12 text-center">
                <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">No Data Yet</h3>
                <p className="text-muted-foreground text-sm">Start logging your daily activities on the Dashboard to see your environmental stats here.</p>
              </Card>
            </motion.div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Avg Carbon", value: avgCarbon, suffix: " kg", icon: Wind, color: "text-leaf" },
                  { label: "Avg Water", value: avgWater, suffix: " L", icon: Droplets, color: "text-aqua" },
                  { label: "Avg Energy", value: avgEnergy, suffix: " kWh", icon: Zap, color: "text-accent" },
                ].map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="p-5 text-center hover-lift">
                      <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                      <div className="text-2xl font-bold"><AnimatedCounter value={item.value} suffix={item.suffix} /></div>
                      <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Wind className="w-4 h-4 text-leaf" /> Carbon Emissions</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(135,50%,45%)" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="hsl(135,50%,45%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(40,20%,92%)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={chartStyle} />
                        <Area type="monotone" dataKey="carbon" stroke="hsl(135,50%,45%)" fill="url(#cGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Card className="p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Droplets className="w-4 h-4 text-aqua" /> Water Usage</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(40,20%,92%)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={chartStyle} />
                        <Bar dataKey="water" fill="hsl(185,60%,50%)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </motion.div>
              </div>

              {/* Comparison */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card className="p-6 bg-primary/5 border-primary/20">
                  <h3 className="font-bold mb-3 flex items-center gap-2"><TrendingDown className="w-5 h-5 text-primary" /> Comparison with Sustainable Limits</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Water usage vs sustainable limit ({SUSTAINABLE_LIMITS.water}L/day)</span>
                      <span className="text-sm font-semibold text-primary">
                        {waterComparison > 0 ? `${waterComparison}% below limit 🎉` : `${Math.abs(waterComparison)}% above limit ⚠️`}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, 100 - waterComparison)}%` }} transition={{ duration: 1, delay: 0.6 }} className="h-2 rounded-full eco-gradient" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Carbon emissions vs sustainable limit ({SUSTAINABLE_LIMITS.carbon}kg/day)</span>
                      <span className="text-sm font-semibold text-primary">
                        {carbonComparison > 0 ? `${carbonComparison}% below limit 🌿` : `${Math.abs(carbonComparison)}% above limit ⚠️`}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, 100 - carbonComparison)}%` }} transition={{ duration: 1, delay: 0.7 }} className="h-2 rounded-full eco-gradient" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
