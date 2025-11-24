'use client'

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';


export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const ua = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);
    if (isMobile) {
      router.replace("/unsupported");
    } else {
      router.push('/login'); 
    }
  }, [router]);

  return null;        
}


