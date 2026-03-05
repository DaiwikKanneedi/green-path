import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";

export default function NotFound() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-16 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
            className="inline-block mb-6"
          >
            <div className="w-24 h-24 rounded-3xl eco-gradient flex items-center justify-center mx-auto">
              <Leaf className="w-12 h-12 text-primary-foreground" />
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-display font-bold mb-3">
            Oops! Something went wrong.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground mb-8">
            We're sorry for the inconvenience. The page you're looking for doesn't exist or has been moved.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to="/dashboard">
              <Button size="lg" className="eco-gradient border-0 text-primary-foreground">
                <Home className="w-4 h-4 mr-2" /> Return to Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
