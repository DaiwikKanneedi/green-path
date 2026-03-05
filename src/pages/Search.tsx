import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search as SearchIcon, Droplets, Zap, Car, Utensils, Trash2, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";

const categories = [
  { name: "Water Usage", icon: Droplets, color: "text-aqua", keywords: ["water", "shower", "liters", "dishwash"] },
  { name: "Carbon Footprint", icon: Car, color: "text-leaf", keywords: ["carbon", "footprint", "co2", "emissions", "transport", "car"] },
  { name: "Electricity", icon: Zap, color: "text-accent", keywords: ["electricity", "energy", "lights", "ac", "device", "charging"] },
  { name: "Transportation", icon: Car, color: "text-primary", keywords: ["transport", "car", "bus", "train", "walk", "bicycle", "cycling"] },
  { name: "Food & Diet", icon: Utensils, color: "text-earth", keywords: ["food", "meat", "vegan", "vegetarian", "diet", "meal"] },
  { name: "Waste Tracking", icon: Trash2, color: "text-muted-foreground", keywords: ["waste", "recycl", "plastic", "compost", "trash"] },
  { name: "Environmental Stats", icon: BarChart3, color: "text-primary", keywords: ["stats", "chart", "trend", "score", "impact", "data"] },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = query.trim()
    ? categories.filter((c) => c.keywords.some((k) => k.includes(query.toLowerCase())) || c.name.toLowerCase().includes(query.toLowerCase()))
    : categories;

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold text-center mb-2">
            Search & Discover
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-center mb-8">
            Find specific tracking features and environmental data.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative mb-8">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              className="pl-12 h-12 text-base rounded-xl"
              placeholder="Search water usage, carbon footprint, electricity..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </motion.div>

          <div className="grid gap-3">
            {filtered.map((cat, i) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                onClick={() => cat.name === "Environmental Stats" ? navigate("/stats") : navigate("/dashboard")}
                className="eco-card flex items-center gap-4 text-left w-full"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <cat.icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">Track and monitor your {cat.name.toLowerCase()}</p>
                </div>
              </motion.button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No results found for "{query}"</p>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
