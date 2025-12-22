// src/pages/Docs/PaidServiceTerms.tsx
import { useEffect, useState } from 'react';

export default function PaidServiceTerms() {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/paid-service-terms.html')
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        setContent(doc.querySelector('body')?.innerHTML || '');
      });
  }, []);

  return (
    <div className="document-page">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}