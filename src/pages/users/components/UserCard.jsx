import { Link, useLocation } from 'react-router-dom';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';
import { getFullName } from '../../../utils/format';
import './UserCard.css';

export default function UserCard({ user }) {
  const location = useLocation();
  const fullName = getFullName(user);
  const returnTo = `${location.pathname}${location.search}`;

  return (
    <Link
      to={`/users/${user.id}`}
      state={{ from: returnTo }}
      className="user-card"
      aria-label={`View details for ${fullName}`}
    >
      <Avatar src={user.image} alt="" size={56} />
      <div className="user-card-body">
        <div className="user-card-top">
          <h2 className="user-card-name">{fullName}</h2>
          <Badge tone={user.role || 'default'}>{user.role || 'user'}</Badge>
        </div>
        <p className="user-card-meta">{user.email || 'No email'}</p>
        <p className="user-card-meta">{user.phone || 'No phone'}</p>
        <p className="user-card-company">{user.company?.name || 'No company listed'}</p>
      </div>
    </Link>
  );
}
