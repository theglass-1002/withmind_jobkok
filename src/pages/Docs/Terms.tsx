// src/pages/Docs/Terms.tsx
import { useEffect, useState } from 'react';

export default function Terms() {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/terms.html')  // public/terms.html을 가져옴
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        setContent(doc.querySelector('body')?.innerHTML || '');
      });
  }, []);

  return (
    <div className="terms-page">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}