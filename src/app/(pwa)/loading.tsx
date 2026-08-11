import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50 text-slate-500">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
      <p className="text-sm font-medium animate-pulse">Memuat Pustaka Pangkalan...</p>
    </div>
  );
}
