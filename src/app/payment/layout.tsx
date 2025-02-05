"use client";

import { Toaster } from "@/components/ui/toaster";
import React from "react";


const Layout = ({children}: {children: React.ReactNode}) => {



  return (
    <>
      <div className="relative">{children}</div>
      <Toaster />
    </>
  )
}


export default Layout