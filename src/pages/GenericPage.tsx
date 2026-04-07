import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const GenericPage = () => {
  const { pathname } = useLocation();
  const title = pathname.slice(1).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <FileText className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="text-muted-foreground">This feature is coming soon.</p>
    </motion.div>
  );
};

export default GenericPage;
