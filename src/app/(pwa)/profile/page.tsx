import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { User, Phone, LogOut, Settings, HelpCircle, ChevronRight, BookOpen } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* Profile Header */}
      <div className="bg-white px-4 py-8 rounded-b-3xl shadow-sm border-b border-slate-100 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-3xl uppercase mb-4 border-4 border-white shadow-md">
          {(session.name || "U")[0]}
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-1">{session.name || session.phone}</h1>
        <div className="flex items-center gap-1 text-slate-500 text-sm bg-slate-100 px-3 py-1 rounded-full">
          <Phone size={14} />
          {session.phone}
        </div>
        
        <div className="flex gap-8 mt-6 text-center">
          <div>
            <div className="font-bold text-slate-900 text-lg">12</div>
            <div className="text-xs text-slate-500">Buku Dibaca</div>
          </div>
          <div className="w-px bg-slate-200"></div>
          <div>
            <div className="font-bold text-slate-900 text-lg">{session.role}</div>
            <div className="text-xs text-slate-500">Status Akun</div>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="p-4 space-y-2 mt-2">
        <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <User size={20} />
            </div>
            <span className="font-medium">Edit Profil</span>
          </div>
          <ChevronRight size={20} className="text-slate-400" />
        </button>

        <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <BookOpen size={20} />
            </div>
            <span className="font-medium">Riwayat Peminjaman</span>
          </div>
          <ChevronRight size={20} className="text-slate-400" />
        </button>
        
        <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Settings size={20} />
            </div>
            <span className="font-medium">Pengaturan</span>
          </div>
          <ChevronRight size={20} className="text-slate-400" />
        </button>

        <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
              <HelpCircle size={20} />
            </div>
            <span className="font-medium">Bantuan & FAQ</span>
          </div>
          <ChevronRight size={20} className="text-slate-400" />
        </button>
      </div>

      <div className="p-4 pt-2 pb-8">
        <LogoutButton />
        <p className="text-center text-xs text-slate-400 mt-6">Pustaka Pangkalan App v1.0.0</p>
      </div>
    </div>
  );
}
