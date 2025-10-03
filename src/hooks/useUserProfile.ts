import { useAuth } from './useAuth';

export function useUserProfile() {
  const { user } = useAuth();

  const getDisplayName = () => {
    if (!user) return 'Guest';
    return user.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    if (!user) return 'G';
    const name = getDisplayName();
    return name.substring(0, 2).toUpperCase();
  };

  return {
    getDisplayName,
    getInitials,
  };
}
