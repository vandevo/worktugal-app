import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile, notifyProfileUpdate } from '../hooks/useUserProfile';
import { useSubscription } from '../hooks/useSubscription';
import { updateUserProfile } from '../lib/profile';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { profile, getDisplayName, refetch } = useUserProfile();
  const { purchases } = useSubscription();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUserProfile(user.id, {
        display_name: displayName.trim() || null,
      });
      
      // Notify all useUserProfile hooks to refresh
      notifyProfileUpdate();
      
      setSuccess(true);
      
      // Close modal after short delay
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Update local state when profile changes
  React.useEffect(() => {
    if (profile?.display_name !== undefined) {
      setDisplayName(profile.display_name || '');
    }
  }, [profile]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/[0.08] shadow-2xl p-8 w-full max-w-md mx-4"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center border border-white/[0.06]"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Content */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-400/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-400/20 shadow-lg">
                <User className="h-8 w-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>
              <p className="text-gray-400">Customize how your name appears</p>
            </div>

            {error && (
              <Alert variant="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success">
                Profile updated successfully!
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email (cannot be changed)
                </label>
                <div className="px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-gray-400 backdrop-blur-xl">
                  {user?.email}
                </div>
              </div>

              <Input
                label="Display Name"
                placeholder="Enter your preferred name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                hint="Leave empty to use your email username"
              />

              <div className="text-sm text-gray-400">
                <p>Current display: <span className="text-white font-medium">{getDisplayName()}</span></p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-2xl"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 rounded-2xl"
                loading={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};