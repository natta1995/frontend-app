import React from 'react';
import Login from './components/Login'
import { login } from './api/auth'


const App: React.FC = () => {
  const handleLogin = async (username: string, password: string) => {
    const result = await login(username, password);

    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Login onLogin={handleLogin} />
    </div>
  );
}

export default App;
