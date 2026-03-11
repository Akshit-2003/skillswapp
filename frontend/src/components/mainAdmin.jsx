import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';

// --- Styled Components for Dashboard ---
const SidebarItem = ({ icon, label, to, active, badgeCount = 0 }) => (
  <Link
    to={to} 
    style={{
      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px',
      textDecoration: 'none', color: active ? '#fff' : '#9ca3af',
      background: active ? 'linear-gradient(90deg, rgba(100,108,255,0.15) 0%, transparent 100%)' : 'transparent',
      borderLeft: active ? '3px solid #646cff' : '3px solid transparent',
      transition: 'all 0.2s ease', fontSize: '0.95rem', fontWeight: active ? '600' : '500',
      position: 'relative'
    }}
  >
    <span style={{ fontSize: '1.1rem', width: '24px', textAlign: 'center' }}>{icon}</span>
    <span>{label}</span>
    {badgeCount > 0 && (
      <span style={{
        marginLeft: 'auto', background: '#ef4444', color: '#fff',
        borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold',
        padding: '2px 8px', lineHeight: '1.2'
      }}>
        {badgeCount}
      </span>
    )}
  </Link>
);

const StatCard = ({ title, value, icon, color }) => (
  <div style={{
    background: '#1f2937', padding: '24px', borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  }}>
    <div style={{
      width: '40px', height: '40px', borderRadius: '8px',
      background: `${color}20`, color: color, display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '1rem'
    }}>
      {icon}
    </div>
    <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: '0 0 4px 0', fontWeight: '500' }}>{title}</p>
    <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#fff', margin: 0 }}>{value}</h3>
  </div>
);

const SimpleLineChart = ({ data, color }) => (
  <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '2%', padding: '10px 0' }}>
    {data.map((val, idx) => (
      <div key={idx} style={{
        width: '100%',
        height: `${val}%`,
        background: `linear-gradient(to top, ${color}40, ${color})`,
        borderRadius: '4px 4px 0 0',
        transition: 'height 0.3s ease'
      }}></div>
    ))}
  </div>
);

const PieChart = ({ data, title }) => {
  const backgroundGradient = data.map((item, index) => {
      let start = data.slice(0, index).reduce((sum, i) => sum + i.percentage, 0);
      let end = start + item.percentage;
      return `${item.color} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div style={{ background: '#1f2937', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#e5e7eb', fontSize: '1.2rem' }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{
          width: '150px', height: '150px', borderRadius: '50%',
          background: `conic-gradient(${backgroundGradient})`
        }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }}></div>
              <span style={{ color: '#d1d5db', fontSize: '0.9rem' }}>{item.label} ({item.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title, icon }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#6b7280', animation: 'fadeInUp 0.5s ease' }}>
    <div style={{ textAlign: 'center', background: '#1f2937', padding: '4rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem', filter: 'grayscale(80%)', opacity: 0.6 }}>{icon}</div>
      <h2 style={{ color: '#e5e7eb', margin: '0 0 0.5rem 0' }}>{title} Page</h2>
      <p>This feature is currently under construction. Check back soon!</p>
    </div>
  </div>
);

const ActionButton = ({ onClick, title, icon, color = '#9ca3af' }) => (
    <button 
        onClick={onClick} 
        title={title}
        style={{ 
            background: 'transparent', border: 'none', cursor: 'pointer', 
            color: color, padding: '6px', borderRadius: '50%',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
    >
        {icon}
    </button>
);

const ProfileDropdown = ({ onLogout }) => (
  <div style={{
    position: 'absolute', top: '60px', right: 0,
    background: '#1f2937', borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    width: '200px', zIndex: 20, border: '1px solid #374151',
    animation: 'fadeInUp 0.2s ease-out'
  }}>
    <div style={{ padding: '1rem', borderBottom: '1px solid #374151' }}>
      <p style={{ margin: 0, fontWeight: '600', color: '#fff' }}>Akshit Kansal</p>
      <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>Super Admin</p>
    </div>
    <div style={{ padding: '0.5rem' }}>
      <Link to="/super-admin/settings" style={{ textDecoration: 'none', color: '#d1d5db', display: 'block', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}>Profile Settings</Link>
      <a href="#" onClick={onLogout} style={{ textDecoration: 'none', color: '#ef4444', display: 'block', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}>Logout</a>
    </div>
  </div>
);

// --- Main Component ---
const SuperAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({ totalUsers: 0, totalSkills: 0, totalSwaps: 0, activeSwaps: 154 });
  const [allUsers, setAllUsers] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Mock Data for Tables
  const recentRequests = [
    { id: 1, userA: 'Sarah Jenkins', userB: 'Mike Taylor', skill: 'React for Guitar', status: 'Pending' },
    { id: 2, userA: 'John Doe', userB: 'Elena R.', skill: 'Python for Spanish', status: 'Active' },
  ];
  const mockReviews = [
    { id: 1, user: 'Alice', teacher: 'Sarah Wilson', rating: 5, comment: 'Amazing teacher, very patient!' },
    { id: 2, user: 'Bob', teacher: 'Mike Ross', rating: 4, comment: 'Good session, learned a lot.' },
  ];

  // Mock Data for Chart
  const userGrowthData = [20, 35, 45, 50, 65, 75, 85, 90, 80, 95];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes, skillsRes, teachersRes] = await Promise.all([
        fetch('http://localhost:5000/get-all-users'),
        fetch('http://localhost:5000/get-platform-stats'),
        fetch('http://localhost:5000/get-all-skills'),
        fetch('http://localhost:5000/get-teacher-admins')
      ]);

      const usersData = await usersRes.json();
      if (usersRes.ok) setAllUsers(usersData);

      const statsData = await statsRes.json();
      if (statsRes.ok) setStats(prev => ({ ...prev, ...statsData, activeSwaps: 154, completedSessions: 1205 }));

      const skillsData = await skillsRes.json();
      if (skillsRes.ok) setAllSkills(skillsData);

      const teachersData = await teachersRes.json();
      if (teachersRes.ok) setAllTeachers(teachersData);

    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const handleRemoveUser = async (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:5000/remove-user/${userId}`, { method: 'DELETE' });
        if (response.ok) {
          alert('User removed successfully.');
          fetchData(); // Re-fetch all data to update lists and stats
        } else {
          const data = await response.json();
          alert(`Failed to remove user: ${data.message || 'Unknown error'}`);
        }
      } catch (err) {
        console.error("Remove user error:", err);
        alert('Could not connect to the server to remove user.');
      }
    }
  };

  // Filter logic for Users
  const filteredUsers = allUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  // Filter logic for Skills
  const filteredSkills = allSkills.filter(s => s.skillName.toLowerCase().includes(searchTerm.toLowerCase()) || s.providerName.toLowerCase().includes(searchTerm.toLowerCase()));

  // Filter logic for Teachers
  const filteredTeachers = allTeachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.email.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- Page Components ---

  const DashboardOverview = () => {
    const skillCategoryData = [
      { label: 'Development', percentage: 45, color: '#646cff' },
      { label: 'Design', percentage: 25, color: '#10b981' },
      { label: 'Music', percentage: 15, color: '#f59e0b' },
      { label: 'Lifestyle', percentage: 10, color: '#ef4444' },
      { label: 'Other', percentage: 5, color: '#6b7280' },
    ];
    return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeInUp 0.5s ease' }}>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Total Users" value={stats.totalUsers || 0} icon="👥" color="#646cff" />
        <StatCard title="Active Teachers" value={stats.totalTeacherAdmins || 0} icon="🎓" color="#34d399" />
        <StatCard title="Total Skills" value={stats.totalSkills || 0} icon="⚡" color="#f59e0b" />
        <StatCard title="Active Swaps" value={stats.activeSwaps || 0} icon="🔄" color="#10b981" />
        <StatCard title="Pending Requests" value={recentRequests.filter(r => r.status === 'Pending').length} icon="🔔" color="#ef4444" />
        <StatCard title="Completed Sessions" value="1.2k" icon="✅" color="#bc13fe" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Chart Section */}
        <div style={{ background: '#1f2937', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#e5e7eb', fontSize: '1.2rem' }}>User Growth</h3>
          <SimpleLineChart data={userGrowthData} color="#646cff" />
        </div>
        <PieChart data={skillCategoryData} title="Skill Category Distribution" />
      </div>

      {/* Tables Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Recent Users Table */}
        <div style={{ background: '#1f2937', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: '#e5e7eb', fontSize: '1.2rem' }}>Recent Users</h3>
            <button onClick={() => navigate('/super-admin/users')} style={{ background: 'transparent', border: '1px solid #374151', color: '#9ca3af', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>View All</button>
          </div>
          {/* Table content here */}
        </div>

        {/* Swap Requests Table */}
        <div style={{ background: '#1f2937', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#e5e7eb', fontSize: '1.2rem' }}>Recent Swap Requests</h3>
          {/* Table content here */}
        </div>

        {/* Teacher Management Table */}
        <div style={{ background: '#1f2937', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#e5e7eb', fontSize: '1.2rem' }}>Top Teachers</h3>
          {/* Table content here */}
        </div>

        {/* Reviews Table */}
        <div style={{ background: '#1f2937', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#e5e7eb', fontSize: '1.2rem' }}>Recent Reviews</h3>
          {/* Table content here */}
        </div>
      </div>
    </div>
    );
  };

  const UserManagementPage = () => <PlaceholderPage title="User Management" icon="👥" />;
  const TeacherManagementPage = () => <PlaceholderPage title="Teacher Management" icon="🎓" />;
  const SkillManagementPage = () => <PlaceholderPage title="Skill Management" icon="⚡" />;
  const SwapRequestsPage = () => <PlaceholderPage title="Swap Requests" icon="🔄" />;
  const SessionsPage = () => <PlaceholderPage title="Sessions / Meetings" icon="📅" />;
  const ReportsPage = () => <PlaceholderPage title="Reports & Analytics" icon="📑" />;
  const SettingsPage = () => <PlaceholderPage title="Platform Settings" icon="⚙️" />;
  const FeedbackPage = () => <PlaceholderPage title="Feedback & Reviews" icon="⭐" />;
  const SystemLogsPage = () => <PlaceholderPage title="System Logs" icon="📜" />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#111827', fontFamily: "'Inter', sans-serif" }}>

      {/* --- Left Sidebar --- */}
      <div style={{
        width: '260px', background: '#1f2937', borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', position: 'fixed', height: '100%', zIndex: 10,
        overflowY: 'auto'
      }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/vite.svg" alt="Logo" width="32" />
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', letterSpacing: '-0.5px' }}>SkillSwap<span style={{ color: '#646cff' }}>.Admin</span></span>
        </div>

        <div style={{ flex: 1, padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <p style={{ padding: '0 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>Menu</p>
          <SidebarItem to="overview" label="Dashboard" icon="📊" active={location.pathname.endsWith('overview') || location.pathname.endsWith('super-admin/')} />
          <SidebarItem to="user-management" label="User Management" icon="👥" active={location.pathname.includes('user-management')} />
          <SidebarItem to="teacher-management" label="Teacher Management" icon="🎓" active={location.pathname.includes('teacher-management')} />
          <SidebarItem to="skill-management" label="Skill Management" icon="⚡" active={location.pathname.includes('skill-management')} />
          <SidebarItem to="swap-requests" label="Swap Requests" icon="🔄" active={location.pathname.includes('swap-requests')} badgeCount={recentRequests.filter(r => r.status === 'Pending').length} />
          <SidebarItem to="sessions" label="Sessions / Meetings" icon="📅" active={location.pathname.includes('sessions')} />

          <p style={{ padding: '0 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '600', margin: '20px 0 8px' }}>Management</p>
          <SidebarItem to="reports" label="Reports & Analytics" icon="📑" active={location.pathname.includes('reports')} />
          <SidebarItem to="settings" label="Platform Settings" icon="⚙️" active={location.pathname.includes('settings')} />
          <SidebarItem to="feedback" label="Feedback & Reviews" icon="⭐" active={location.pathname.includes('feedback')} />
          <SidebarItem to="logs" label="System Logs" icon="📜" active={location.pathname.includes('logs')} />
        </div>

        <div style={{ padding: '20px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
              border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>

        {/* Top Navbar */}
        <div style={{
          height: '70px', background: '#1f2937', borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', position: 'sticky', top: 0, zIndex: 5
        }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', width: '300px' }}>
            <input
              type="text"
              placeholder="Search anything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', background: '#111827', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', padding: '10px 16px 10px 40px', color: '#fff', fontSize: '0.9rem'
              }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div title="Notifications" style={{ position: 'relative', cursor: 'pointer', color: '#9ca3af' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span>
            </div>
            <div title="Messages" style={{ position: 'relative', cursor: 'pointer', color: '#9ca3af' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div onClick={() => setShowProfileDropdown(!showProfileDropdown)} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid #374151', paddingLeft: '20px', cursor: 'pointer' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#fff' }}>Akshit Kansal</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>Super Admin</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #646cff, #bc13fe)', border: '2px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                AK
              </div>
              {showProfileDropdown && <ProfileDropdown onLogout={handleLogout} />}
            </div>
          </div>
        </div>

        {/* Dashboard Content Container */}
        <div style={{ padding: '30px', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="user-management" element={<UserManagementPage />} />
            <Route path="teacher-management" element={<TeacherManagementPage />} />
            <Route path="skill-management" element={<SkillManagementPage />} />
            <Route path="swap-requests" element={<SwapRequestsPage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="logs" element={<SystemLogsPage />} />
          </Routes>
        </div>

      </div>
    </div>
  );
};

export default SuperAdmin;