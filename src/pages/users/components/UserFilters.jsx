import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { GENDER_OPTIONS, ROLE_OPTIONS } from '../../../constants/users';
import './UserFilters.css';

export default function UserFilters({
  search,
  gender,
  role,
  onSearchChange,
  onGenderChange,
  onRoleChange,
  onClear,
  hasActiveFilters,
}) {
  return (
    <section className="user-filters" aria-label="Search and filter users">
      <SearchInput value={search} onChange={onSearchChange} />
      <div className="user-filters-row">
        <Select
          id="filter-gender"
          label="Gender"
          value={gender}
          onChange={onGenderChange}
          options={GENDER_OPTIONS}
        />
        <Select
          id="filter-role"
          label="Role"
          value={role}
          onChange={onRoleChange}
          options={ROLE_OPTIONS}
        />
        <div className="user-filters-clear">
          <Button variant="secondary" onClick={onClear} disabled={!hasActiveFilters}>
            Clear filters
          </Button>
        </div>
      </div>
    </section>
  );
}
