// components/common/GlobalLoader.jsx
import { Loader2 } from "lucide-react";

function GlobalLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );
}

export default GlobalLoader;
