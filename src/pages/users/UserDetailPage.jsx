import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { deleteUser } from '../../api/users.api';
import { getApiErrorMessage } from '../../api/client';
import Button from '../../components/ui/Button';
import { useUser } from '../../hooks/useUser';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import ErrorState from '../../components/ui/ErrorState';
import { getFullName, formatLabel, formatAddress, maskCardNumber } from '../../utils/format';
import './UserDetailPage.css';

function DetailSection({ title, children }) {
  return (
    <section className="detail-section">
      <h2 className="detail-section-title">{title}</h2>
      <dl className="detail-grid">{children}</dl>
    </section>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <dt>{label}</dt>
      <dd>{value || '—'}</dd>
    </div>
  );
}

export default function UserDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, error, retry } = useUser(id);
  const [deleteError, setDeleteError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const backTo = location.state?.from || '/users';

  if (loading) {
    return (
      <div className="user-detail-page" aria-busy="true">
        <p className="sr-only">Loading user details</p>
        <div className="ui-skeleton" style={{ height: 28, width: 180, marginBottom: 20 }} />
        <div className="user-detail-hero">
          <div className="ui-skeleton" style={{ width: 88, height: 88, borderRadius: '50%' }} />
          <div style={{ flex: 1, display: 'grid', gap: 10 }}>
            <div className="ui-skeleton" style={{ height: 24, width: '40%' }} />
            <div className="ui-skeleton" style={{ height: 14, width: '55%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="user-detail-page">
        <Link className="back-link" to={backTo}>
          ← Back to user list
        </Link>
        <ErrorState
          title="Could not load user details"
          message={error || 'This user could not be found.'}
          onRetry={retry}
        />
      </div>
    );
  }

  const fullName = getFullName(user);

  async function handleDelete() {
    if (!window.confirm(`Delete ${fullName}? This action cannot be undone.`)) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteUser(id);
      navigate('/users', { replace: true, state: { notice: `${fullName} was deleted successfully.` } });
    } catch (deleteRequestError) {
      setDeleteError(getApiErrorMessage(deleteRequestError));
      setDeleting(false);
    }
  }

  return (
    <article className="user-detail-page">
      <Link className="back-link" to={backTo}>
        ← Back to user list
      </Link>

      <header className="user-detail-hero">
        <Avatar src={user.image} alt={`${fullName} profile photo`} size={88} />
        <div>
          <p className="user-list-kicker">User details</p>
          <h1 className="user-detail-name">{fullName}</h1>
          <div className="user-detail-badges">
            <Badge tone={user.role || 'default'}>{formatLabel(user.role)}</Badge>
            <Badge tone={user.gender || 'default'}>{formatLabel(user.gender)}</Badge>
          </div>
          <p className="user-detail-subtitle">{user.company?.title || 'No job title listed'}</p>
        </div>
      </header>

      <div className="user-detail-actions">
        <Button as={Link} to={`/users/${id}/edit`} variant="secondary">Edit user</Button>
        <Button variant="danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete user'}
        </Button>
      </div>
      {location.state?.notice ? <p className="user-detail-notice" role="status">{location.state.notice}</p> : null}
      {deleteError ? <p className="user-detail-error" role="alert">{deleteError}</p> : null}

      <div className="detail-sections">
        <DetailSection title="Personal information">
          <DetailItem label="Full name" value={fullName} />
          <DetailItem label="Email" value={user.email} />
          <DetailItem label="Phone" value={user.phone} />
          <DetailItem label="Username" value={user.username} />
          <DetailItem label="Age" value={user.age} />
          <DetailItem label="Birth date" value={user.birthDate} />
          <DetailItem label="Blood group" value={user.bloodGroup} />
          <DetailItem label="University" value={user.university} />
        </DetailSection>

        <DetailSection title="Address">
          <DetailItem label="Street" value={user.address?.address} />
          <DetailItem label="City" value={user.address?.city} />
          <DetailItem label="State" value={user.address?.state} />
          <DetailItem label="Postal code" value={user.address?.postalCode} />
          <DetailItem label="Country" value={user.address?.country} />
          <DetailItem label="Full address" value={formatAddress(user.address)} />
        </DetailSection>

        <DetailSection title="Company">
          <DetailItem label="Company" value={user.company?.name} />
          <DetailItem label="Title" value={user.company?.title} />
          <DetailItem label="Department" value={user.company?.department} />
          <DetailItem
            label="Office address"
            value={formatAddress(user.company?.address)}
          />
        </DetailSection>

        <DetailSection title="Bank information">
          <DetailItem label="Card type" value={user.bank?.cardType} />
          <DetailItem label="Card number" value={maskCardNumber(user.bank?.cardNumber)} />
          <DetailItem label="Expires" value={user.bank?.cardExpire} />
          <DetailItem label="Currency" value={user.bank?.currency} />
          <DetailItem label="IBAN" value={user.bank?.iban} />
        </DetailSection>
      </div>
    </article>
  );
}
