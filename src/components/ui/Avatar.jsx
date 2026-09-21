import { useState } from 'react';
import './ui.css';

const FALLBACK =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect fill="%23e2e8f0" width="128" height="128"/><circle fill="%2394a3b8" cx="64" cy="48" r="22"/><ellipse fill="%2394a3b8" cx="64" cy="112" rx="40" ry="32"/></svg>';

export default function Avatar({ src, alt, size = 56, className = '' }) {
  const [failed, setFailed] = useState(false);

  return (
    <img
      className={`ui-avatar ${className}`.trim()}
      src={failed || !src ? FALLBACK : src}
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
