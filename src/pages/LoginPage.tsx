import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthModal } from '../components/auth/AuthModal';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(true);

  const redirect = searchParams.get('redirect') || '/dashboard';
  const safeRedirect = redirect.startsWith('/') ? redirect : `/${redirect}`;

  useEffect(() => {
    if (user) {
      navigate(safeRedirect, { replace: true });
    }
  }, [user, navigate, safeRedirect]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <AuthModal
        isOpen={showModal}
        onClose={() => navigate(safeRedirect, { replace: true })}
        initialMode="login"
        source="login_page"
      />
    </div>
  );
};
