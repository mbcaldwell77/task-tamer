import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { CheckIn } from './pages/CheckIn';
import { Spin } from './pages/Spin';
import { Focus } from './pages/Focus';

const AppRoutes = () => {
  const { loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-secondary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<CheckIn />} />
      <Route path="/spin" element={<Spin />} />
      <Route path="/focus/:taskId" element={<Focus />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </Router>
  );
}

export default App;
