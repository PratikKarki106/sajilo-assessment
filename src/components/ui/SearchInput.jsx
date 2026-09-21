import './ui.css';

export default function SearchInput({
  id = 'user-search',
  label = 'Search users',
  value,
  onChange,
  placeholder = 'Search by name, email, phone, or company',
}) {
  return (
    <div className="ui-search">
      <label className="ui-search-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="ui-search-input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}
