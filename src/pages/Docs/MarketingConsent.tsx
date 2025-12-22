// src/pages/Docs/MarketingConsent.tsx
import { useEffect, useState } from 'react';

export default function MarketingConsent() {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/marketing-consent.html')
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