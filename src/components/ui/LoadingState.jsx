import './ui.css';

function SkeletonCard() {
  return (
    <div className="user-card user-card-skeleton" aria-hidden="true">
      <div className="ui-skeleton" style={{ width: 56, height: 56, borderRadius: '50%' }} />
      <div style={{ flex: 1, display: 'grid', gap: 8 }}>
        <div className="ui-skeleton" style={{ height: 16, width: '60%' }} />
        <div className="ui-skeleton" style={{ height: 12, width: '80%' }} />
        <div className="ui-skeleton" style={{ height: 12, width: '45%' }} />
      </div>
    </div>
  );
}

export default function LoadingState({ label = 'Loading users' }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="sr-only">{label}</p>
      <div className="ui-card-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
