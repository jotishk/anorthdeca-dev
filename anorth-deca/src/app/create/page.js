'use client';

import { useRef } from 'react';
import { createTest } from '@/lib/firebaseService';

export default function Create() {
  const fileInputRef = useRef(null);
  function submitTest(e) {
    e.preventDefault();
    const file = fileInputRef.current?.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const text = reader.result;
        createTest(text);
      };
      reader.readAsText(file);
  }
  return (
    <form onSubmit = {submitTest()}>
      <input type = "file" ref = {fileInputRef}></input>
      <input type = "submit"></input>
    </form>
  );
}