import { useEffect } from 'react';
import './ui.css';

export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onDismiss, 3000);
    return () => window.clearTimeout(timeoutId);
  }, [message, onDismiss]);

  return (
    <div className="ui-toast" role="status" aria-live="polite">
      <span>{message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  );
}
