import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      await authService.register({ username, email, password });
      navigate('/login', { state: { message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-circle">
            <i className="bx bx-user-plus"></i>
          </div>
          <h1>Créer un compte</h1>
          <p className="subtitle">Rejoignez notre plateforme</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder=""
            />
            <label htmlFor="username">Nom d'utilisateur</label>
            <i className="bx bx-user"></i>
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder=""
            />
            <label htmlFor="email">Email</label>
            <i className="bx bx-envelope"></i>
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder=""
            />
            <label htmlFor="password">Mot de passe</label>
            <i className="bx bx-lock-alt"></i>
          </div>
          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder=""
            />
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <i className="bx bx-lock-alt"></i>
          </div>
          {error && <div className="error-message">
            <i className="bx bx-error-circle"></i>
            {error}
          </div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <i className="bx bx-loader-alt bx-spin"></i>
                Inscription...
              </>
            ) : (
              <>
                <i className="bx bx-user-plus"></i>
                Créer mon compte
              </>
            )}
          </button>
        </form>
        <div className="register-footer">
          <p>
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
