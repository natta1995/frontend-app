import React, { useState } from 'react';
import {Link , useNavigate} from 'react-router-dom';

interface LoginProps {
    onLogin: (username: string, password: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await onLogin(username, password);

        if (success) {
          navigate('/feed'); 
        }
        
    }

    return (
        <div style={{ width: '300px', margin: '0 auto', textAlign: 'center' }}>
          <h2>Logga in</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="username">Användarnamn:</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="password">Lösenord:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" style={{ padding: '8px 16px' }}>Logga in</button>
            <p>Har du inget konto hos oss? <br></br><Link to="/register">Registrera här</Link></p>
          </form>
        </div>
      );
}

export default Login;
