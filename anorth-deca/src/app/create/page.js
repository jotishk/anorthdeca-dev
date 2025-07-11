'use client';

import { useRef } from 'react';
import { createTest } from '@/lib/firebaseService';


export default function Create() {
  const fileInputRef = useRef(null);
  function uploadTest() {
    
    const file = fileInputRef.current?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        createTest(text);
      };
      reader.readAsText(file);
    }
  }
  return (
    <form onSubmit = {(e) => {e.preventDefault(); uploadTest()}}>
      <input type = "file" ref = {fileInputRef}></input>
      <input type = "submit"></input>
    </form>
  );
}