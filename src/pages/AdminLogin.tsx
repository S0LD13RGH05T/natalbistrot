import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, User, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSupabaseConfigured) {
      setError('Supabase nao configurado no deploy. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setIsSubmitting(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (!authError) {
      navigate('/admin/dashboard');
    } else {
      setError(`Acesso negado: ${authError.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-darker/80 backdrop-blur-xl border border-gold/20 p-10 rounded-2xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-6 border border-gold/20">
            <LogIn size={28} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gold tracking-tighter mb-2">Painel de Controle</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-platinum/50">Bistrot de Ville Restaurante</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-bold ml-1">Email de Acesso</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-platinum/40">
                <User size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark border border-gold/10 py-4 pl-12 pr-4 focus:border-gold outline-none transition-all text-sm rounded-xl text-platinum placeholder:text-platinum/20"
                placeholder="admin@bistrotdeville.com.br"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-bold ml-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-platinum/40">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark border border-gold/10 py-4 pl-12 pr-4 focus:border-gold outline-none transition-all text-sm rounded-xl text-platinum placeholder:text-platinum/20"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gold text-dark font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all rounded-xl shadow-lg shadow-gold/10 flex items-center justify-center gap-3 mt-8 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Verificando...' : 'Entrar no Sistema'} <ArrowRight size={16} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
