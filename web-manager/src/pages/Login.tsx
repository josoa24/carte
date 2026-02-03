import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import './Login.css';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ username, password });
      login(
        {
          id: response.id,
          username: response.username,
          email: response.email,
          role: response.role,
        },
        response.token
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-circle">
            <i className="bx bx-user-circle"></i>
          </div>
          <h1>Connexion</h1>
          <p className="subtitle">Accédez à votre tableau de bord</p>
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
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder=""
            />
            <label htmlFor="password">Mot de passe</label>
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
                Connexion...
              </>
            ) : (
              <>
                <i className="bx bx-log-in"></i>
                Se connecter
              </>
            )}
          </button>
        </form>
        <div className="login-footer">
          <p>
            Pas encore de compte ? <Link to="/register">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
