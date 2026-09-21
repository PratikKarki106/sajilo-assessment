import './ui.css';

export default function Badge({ children, tone = 'default' }) {
  return <span className={`ui-badge ui-badge-${tone}`}>{children}</span>;
}
