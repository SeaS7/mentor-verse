"use client";

import Particles from "@/components/magicui/particles";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/context/AuthProvider";
import React from "react";


const Layout = ({children}: {children: React.ReactNode}) => {



  return (
    <AuthProvider>
      <div className="relative">{children}</div>
      <Toaster />
    </AuthProvider>
  )
}


export default Layout