import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/dashboard');
      setStats(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ color: '#d32f2f', fontSize: '16px' }}>{error}</div>
        <button onClick={fetchStats} style={{ marginTop: '20px' }} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  const cards = [
    { label: 'Total Projects', value: stats?.totalProjects || 0, icon: '📊' },
    { label: 'In Progress', value: stats?.projectsInProgress || 0, icon: '⚙️' },
    { label: 'Total Tasks', value: stats?.totalTasks || 0, icon: '✓' },
    { label: 'Completed', value: stats?.completedTasks || 0, icon: '✓' },
    { label: 'Pending', value: stats?.pendingTasks || 0, icon: '⏳' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's an overview of your projects.</p>
        </div>
        <Link to="/projects" className="btn btn-primary">
          View All Projects
        </Link>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-label">{card.label}</div>
            <div className="stat-value">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}