"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })} 
      className={className}
    >
      {children}
    </button>
  );
}
