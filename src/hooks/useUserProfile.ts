import { useState, useEffect } from 'react';
import { getUserProfile, UserProfile } from '../lib/profile';
import { useAuth } from './useAuth';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userProfile = await getUserProfile(user.id);
        setProfile(userProfile);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const getDisplayName = () => {
    if (profile?.display_name) {
      return profile.display_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    const displayName = getDisplayName();
    if (displayName.includes(' ')) {
      // If display name has spaces, use first letter of each word
      return displayName
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    // Otherwise use first letter
    return displayName.charAt(0).toUpperCase();
  };

  return {
    profile,
    loading,
    error,
    getDisplayName,
    getInitials,
    refetch: () => {
      if (user) {
        getUserProfile(user.id).then(setProfile);
      }
    },
  };
};
</parameter>