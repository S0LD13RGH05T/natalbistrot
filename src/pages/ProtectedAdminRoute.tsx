import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setIsAuthenticated(Boolean(data.session));
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
      setIsLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center text-platinum">
        <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Verificando acesso...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
