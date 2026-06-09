'use client';

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/user';
import { LoginUserInput } from '@/types/user';
import { AuthContext } from '@/context/AuthContext';
import '../../landing.css';

const Login = () => {
  const router = useRouter();
  const auth = useContext(AuthContext);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload: LoginUserInput = { username, password };
      const response = await loginUser(payload);

      if (response.status === 'fail') {
        setError(response.error || 'Credenciales inválidas');
      } else if (response.status === 'ok') {
        await auth?.login(response.token);
        router.push('/admin/dashboard');
      }
    } catch {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cnmp-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="bg-field" />

      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: 420,
        margin: '0 auto', padding: '0 20px',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img src="/logo-principal.png" alt="CNMP 2026" style={{ height: 56, display: 'inline-block' }} />
        </div>

        {/* Card */}
        <div style={{
          border: '1px solid var(--line)',
          borderRadius: 20,
          background: 'var(--panel)',
          padding: '40px 36px',
          boxShadow: '0 24px 64px rgba(0,0,0,.5)',
        }}>
          <div style={{ marginBottom: 32 }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 10 }}>Panel de administración</span>
            <h1 style={{
              fontFamily: 'var(--display)', fontWeight: 800,
              fontSize: 'clamp(22px,4vw,28px)', lineHeight: 1.2,
              color: 'var(--white)',
            }}>
              Iniciar sesión
            </h1>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{
                fontFamily: 'var(--display)', fontSize: 12,
                letterSpacing: '.1em', textTransform: 'uppercase',
                color: 'var(--mute)',
              }}>
                Usuario
              </label>
              <input
                type="text"
                autoComplete="username"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  background: 'var(--ink-deep)',
                  border: '1px solid var(--line)',
                  borderRadius: 10,
                  padding: '12px 16px',
                  color: 'var(--white)',
                  fontFamily: 'var(--body)',
                  fontSize: 15,
                  outline: 'none',
                  transition: 'border-color .2s',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--neon-line)')}
                onBlur={e => (e.target.style.borderColor = 'var(--line)')}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{
                fontFamily: 'var(--display)', fontSize: 12,
                letterSpacing: '.1em', textTransform: 'uppercase',
                color: 'var(--mute)',
              }}>
                Contraseña
              </label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  background: 'var(--ink-deep)',
                  border: '1px solid var(--line)',
                  borderRadius: 10,
                  padding: '12px 16px',
                  color: 'var(--white)',
                  fontFamily: 'var(--body)',
                  fontSize: 15,
                  outline: 'none',
                  transition: 'border-color .2s',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--neon-line)')}
                onBlur={e => (e.target.style.borderColor = 'var(--line)')}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(255,60,60,.08)',
                border: '1px solid rgba(255,60,60,.25)',
                borderRadius: 10,
                padding: '10px 14px',
                color: '#ff6b6b',
                fontFamily: 'var(--display)',
                fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-neon"
              style={{
                width: '100%', justifyContent: 'center',
                marginTop: 4,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? (
                <>
                  <svg style={{ width: 18, height: 18, animation: 'spin 1s linear infinite', marginRight: 8 }}
                    viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                  </svg>
                  Verificando...
                </>
              ) : (
                <>Ingresar <span className="arr">→</span></>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--mute-2)', fontSize: 12, fontFamily: 'var(--display)', letterSpacing: '.08em' }}>
          CNMP 2026 · Solo acceso autorizado
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;
