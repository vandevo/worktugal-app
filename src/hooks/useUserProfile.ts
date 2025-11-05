import { useState, useEffect } from 'react';
import { getUserProfile, UserProfile } from '../lib/profile';
import { useAuth } from './useAuth';

// Global event emitter for profile updates
const profileUpdateListeners = new Set<() => void>();

export const notifyProfileUpdate = () => {
  profileUpdateListeners.forEach(listener => listener());
};

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userProfile = await getUserProfile(user.id);
      setProfile(userProfile);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add this hook to the global listeners
    profileUpdateListeners.add(refetch);
    
    // Remove from listeners on cleanup
    return () => {
      profileUpdateListeners.delete(refetch);
    };
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      console.log('[useUserProfile] useEffect triggered', {
        hasUser: !!user,
        userId: user?.id
      });

      if (!user) {
        console.log('[useUserProfile] No user, skipping fetch');
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        console.log('[useUserProfile] Fetching profile for user:', user.id);
        const userProfile = await getUserProfile(user.id);
        console.log('[useUserProfile] Profile fetched successfully:', userProfile);
        setProfile(userProfile);
        setError(null);
        setLoading(false);
      } catch (err: any) {
        console.error('[useUserProfile] Error fetching profile:', err);
        setError(err.message || 'Failed to fetch profile');
        setProfile(null);
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
    refetch,
  };
};