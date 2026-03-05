import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, BarChart3, Lightbulb, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveUser } from "@/lib/storage";
import PageTransition from "@/components/PageTransition";

const slides = [
  { icon: Leaf, title: "Track Your Habits", desc: "Log daily water, energy, transport, and food activities effortlessly." },
  { icon: BarChart3, title: "Understand Your Footprint", desc: "See exactly how your lifestyle affects the environment with real-time data." },
  { icon: Lightbulb, title: "Improve Sustainably", desc: "Get personalized suggestions to reduce your ecological impact over time." },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0-2 = slides, 3 = signup
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "", householdSize: 1 });
  const [error, setError] = useState("");

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!validateEmail(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    saveUser({
      name: form.name,
      email: form.email,
      country: form.country || "Unknown",
      householdSize: form.householdSize,
      units: "metric",
      joinedDate: new Date().toISOString(),
    });
    navigate("/dashboard");
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-16 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Progress */}
          <div className="flex gap-2 mb-8 justify-center">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? "w-10 bg-primary" : "w-6 bg-border"}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step < 3 ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="eco-card text-center"
              >
                <motion.div
                  className="w-20 h-20 rounded-2xl eco-gradient flex items-center justify-center mx-auto mb-6"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {(() => { const Icon = slides[step].icon; return <Icon className="w-10 h-10 text-primary-foreground" />; })()}
                </motion.div>
                <h2 className="text-2xl font-display font-bold mb-3">{slides[step].title}</h2>
                <p className="text-muted-foreground mb-8">{slides[step].desc}</p>
                <div className="flex gap-3 justify-center">
                  {step > 0 && (
                    <Button variant="outline" onClick={() => setStep(step - 1)}>
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                  )}
                  <Button onClick={() => setStep(step + 1)} className="eco-gradient border-0 text-primary-foreground">
                    {step === 2 ? "Create Account" : "Next"} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="eco-card"
              >
                <h2 className="text-2xl font-display font-bold mb-6 text-center">Create Your Account</h2>
                {error && <p className="text-destructive text-sm mb-4 text-center">{error}</p>}
                <div className="space-y-4">
                  <div>
                    <Label>Name *</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                  </div>
                  <div>
                    <Label>Password *</Label>
                    <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Your country" />
                  </div>
                  <div>
                    <Label>Household Size</Label>
                    <Input type="number" min={1} value={form.householdSize} onChange={(e) => setForm({ ...form, householdSize: parseInt(e.target.value) || 1 })} />
                  </div>
                  <Button className="w-full eco-gradient border-0 text-primary-foreground" onClick={handleSubmit}>
                    Start Tracking <Leaf className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
