import './ui.css';

export default function Select({ id, label, value, onChange, options }) {
  return (
    <div className="ui-search">
      <label className="ui-select-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="ui-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value || 'all'} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
