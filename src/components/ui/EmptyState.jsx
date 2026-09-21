import './ui.css';

export default function EmptyState({ title, message, action }) {
  return (
    <div className="ui-state ui-state-center" role="status">
      <h2 className="ui-state-title">{title}</h2>
      <p className="ui-state-text">{message}</p>
      {action}
    </div>
  );
}
