import Button from './Button';
import './ui.css';

export default function ErrorState({ title = 'Unable to load data', message, onRetry }) {
  return (
    <div className="ui-state ui-state-error" role="alert">
      <h2 className="ui-state-title">{title}</h2>
      <p className="ui-state-text">{message}</p>
      {onRetry ? (
        <Button variant="primary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
