export default function ApiStatus() {
  return (
    <div
      style={{
        fontFamily: 'monospace',
        padding: '2rem',
        backgroundColor: '#0f0f0f',
        color: '#00ff00',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1>🚀 IVO-TECH API</h1>
      <p>
        Status: <span style={{ color: '#00ff00' }}>ONLINE</span>
      </p>
      <p>Version: 1.0.0</p>
      <p>Environment: {process.env.NODE_ENV}</p>
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          border: '1px solid #00ff00',
        }}
      >
        <h3>Available Endpoints:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>📡 /api/trpc/health - Health check</li>
          <li>🔐 /api/trpc/auth.* - Authentication</li>
          <li>📝 /api/trpc/blog.* - Blog management</li>
          <li>💼 /api/trpc/projects.* - Projects management</li>
        </ul>
      </div>
    </div>
  );
}
