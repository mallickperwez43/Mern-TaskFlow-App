import { useEffect, useState } from 'react';
import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from '@/pages/Landing'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/useAuthStore';
import LoadingOverlay from './components/LoadingOverlay';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DashboardLayout from './components/DashboardLayout';
import Insights from './pages/Insights';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';

function App() {

  const [isHydrated, setIsHydrated] = useState(false);
  const { checkAuth, isChecking } = useAuthStore();
  const location = useLocation();
  const appRoutes = ['/dashboard', '/profile', '/insights', '/schedule', '/settings'];
  const showNavbar = !appRoutes.includes(location.pathname);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => unsub();
  }, []);

  useEffect(() => {
    // const verifySession = async () => {
    //   if (isHydrated && isAuthenticated) {
    //     await checkAuth();
    //   }
    //   setIsCheckingServer(false);
    // };

    // verifySession();
    if (isHydrated) {
      checkAuth();
    }
  }, [isHydrated, checkAuth]);

  if (!isHydrated || isChecking) return <LoadingOverlay />

  return (
    <div className='min-h-screen bg-background bg-grid'>
      {showNavbar && <Navbar />}

      <main className={showNavbar ? 'pt-16' : ''}>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Everything inside here gets the Sidebar */}
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/insights' element={<Insights />} />
              <Route path='/schedule' element={<Schedule />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/settings' element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </main>
    </div>
  )
}

export default App