import { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import authContext from './store/auth-context';

let isInitial = true;

function App() {

  const { isLoggedIn } = useContext(authContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (isInitial) {
      isInitial = false;
      navigate('/auth', { replace: true })
    }
  }, [navigate])

  return (
    <Layout>
      <Routes>
        <Route path='/' element={<HomePage />} />
        {!isLoggedIn && <Route path='/auth' element={<AuthPage />} />}
        <Route
          path='/profile'
          element={isLoggedIn ?
            <UserProfile /> :
            <Navigate to='/' replace />} />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Layout>
  );
}

export default App;
