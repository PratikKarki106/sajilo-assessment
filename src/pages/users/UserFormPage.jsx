import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createUser, updateUser } from '../../api/users.api';
import { getApiErrorMessage } from '../../api/client';
import { useUser } from '../../hooks/useUser';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import LoadingState from '../../components/ui/LoadingState';
import './UserFormPage.css';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: 'female',
  role: 'user',
  company: { name: '' },
};

function toFormValues(user) {
  return {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    gender: user.gender || 'female',
    role: user.role || 'user',
    company: { name: user.company?.name || '' },
  };
}

function validate(values) {
  const errors = {};
  if (!values.firstName.trim()) errors.firstName = 'First name is required.';
  if (!values.lastName.trim()) errors.lastName = 'Last name is required.';
  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!values.phone.trim()) errors.phone = 'Phone is required.';
  return errors;
}

export default function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { user, loading: userLoading, error: userError, retry } = useUser(id);
  if (isEditing && userLoading) return <LoadingState />;
  if (isEditing && userError) {
    return (
      <section className="user-form-page">
        <Link className="back-link" to="/users">← Back to user list</Link>
        <ErrorState title="Could not load user" message={userError} onRetry={retry} />
      </section>
    );
  }

  return (
    <section className="user-form-page">
      <Link className="back-link" to={isEditing ? `/users/${id}` : '/users'}>
        ← Back to {isEditing ? 'user details' : 'user list'}
      </Link>
      <header className="user-form-header">
        <p className="user-list-kicker">User Dashboard</p>
        <h1>{isEditing ? 'Edit user' : 'Add user'}</h1>
        <p>{isEditing ? 'Update this user’s information.' : 'Create a new user profile.'}</p>
      </header>

      <UserForm
        key={id || 'new'}
        initialValues={isEditing ? toFormValues(user) : emptyForm}
        isEditing={isEditing}
        id={id}
        navigate={navigate}
      />
    </section>
  );
}

function UserForm({ initialValues, isEditing, id, navigate }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    if (name === 'company') {
      setValues((current) => ({ ...current, company: { name: value } }));
    } else {
      setValues((current) => ({ ...current, [name]: value }));
    }
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setSubmitError(null);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      if (isEditing) await updateUser(id, values);
      else await createUser(values);
      navigate('/users', {
        replace: true,
        state: { notice: `User ${isEditing ? 'updated' : 'created'} successfully.` },
      });
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="user-form" onSubmit={handleSubmit} noValidate>
      <div className="user-form-grid">
        {[
          ['firstName', 'First name', 'text'],
          ['lastName', 'Last name', 'text'],
          ['email', 'Email', 'email'],
          ['phone', 'Phone', 'tel'],
          ['company', 'Company', 'text'],
        ].map(([name, label, type]) => (
          <label className="user-form-field" key={name}>
            <span>{label}</span>
            <input
              name={name}
              type={type}
              value={name === 'company' ? values.company.name : values[name]}
              onChange={updateField}
              aria-invalid={Boolean(errors[name])}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
            />
            {errors[name] ? <small id={`${name}-error`}>{errors[name]}</small> : null}
          </label>
        ))}
        <label className="user-form-field">
          <span>Gender</span>
          <select name="gender" value={values.gender} onChange={updateField}>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </label>
        <label className="user-form-field">
          <span>Role</span>
          <select name="role" value={values.role} onChange={updateField}>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>
      {submitError ? <p className="user-form-error" role="alert">{submitError}</p> : null}
      <div className="user-form-actions">
        <Button as={Link} to={isEditing ? `/users/${id}` : '/users'} variant="secondary">
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create user'}
        </Button>
      </div>
    </form>
  );
}
