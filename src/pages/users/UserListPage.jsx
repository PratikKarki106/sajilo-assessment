import { useCallback, useEffect, useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import './components/UserCard.css';
import { useDebounce } from '../../hooks/useDebounce';
import { useUsers } from '../../hooks/useUsers';
import { USERS_PAGE_SIZE } from '../../constants/users';
import UserFilters from './components/UserFilters';
import UserCard from './components/UserCard';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import './UserListPage.css';

export default function UserListPage() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();

  const search = params.get('q') || '';
  const gender = params.get('gender') || '';
  const role = params.get('role') || '';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const debouncedSearch = useDebounce(search);

  const { users, total, loading, error, retry, totalPages } = useUsers({
    q: debouncedSearch,
    gender,
    role,
    page,
  });

  const hasActiveFilters = Boolean(search || gender || role);
  const from = total === 0 ? 0 : (page - 1) * USERS_PAGE_SIZE + 1;
  const to = Math.min(page * USERS_PAGE_SIZE, total);

  const updateParams = useCallback(
    (updates) => {
      const next = new URLSearchParams(params);
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) next.delete(key);
        else next.set(key, String(value));
      });
      setParams(next);
    },
    [params, setParams],
  );

  const resultLabel = useMemo(() => {
    if (loading) return 'Updating results';
    if (total === 0) return 'No users to show';
    return `Showing ${from}–${to} of ${total} users`;
  }, [loading, total, from, to]);

  useEffect(() => {
    if (!loading && total > 0 && page > totalPages) {
      updateParams({ page: totalPages });
    }
  }, [loading, page, total, totalPages, updateParams]);

  return (
    <section className="user-list-page">
      <header className="user-list-header">
        <div>
          <p className="user-list-kicker">User Dashboard</p>
          <h1 className="user-list-title">User List</h1>
        </div>
        <div className="user-list-header-actions">
          <p className="user-list-count" aria-live="polite">{resultLabel}</p>
          <Button as={Link} to="/users/new">Add user</Button>
        </div>
      </header>

      {location.state?.notice ? (
        <p className="user-list-notice" role="status">{location.state.notice}</p>
      ) : null}

      <UserFilters
        search={search}
        gender={gender}
        role={role}
        onSearchChange={(value) => updateParams({ q: value, page: 1 })}
        onGenderChange={(value) => updateParams({ gender: value, page: 1 })}
        onRoleChange={(value) => updateParams({ role: value, page: 1 })}
        onClear={() => setParams({})}
        hasActiveFilters={hasActiveFilters}
      />

      {loading ? <LoadingState /> : null}

      {!loading && error ? (
        <ErrorState
          title="Could not load users"
          message={error}
          onRetry={retry}
        />
      ) : null}

      {!loading && !error && users.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No matching users' : 'No users found'}
          message={
            hasActiveFilters
              ? 'Try a different search term or clear the current filters.'
              : 'There are no users available right now.'
          }
          action={
            hasActiveFilters ? (
              <Button variant="secondary" onClick={() => setParams({})}>
                Clear search and filters
              </Button>
            ) : null
          }
        />
      ) : null}

      {!loading && !error && users.length > 0 ? (
        <>
          <div className="ui-card-grid">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
          <Pagination
            page={Math.min(page, totalPages)}
            totalPages={totalPages}
            onPageChange={(nextPage) => updateParams({ page: nextPage })}
          />
        </>
      ) : null}
    </section>
  );
}
