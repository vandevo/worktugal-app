import { useAuth } from '../hooks/useAuth';
import { SubscriptionStatus } from './SubscriptionStatus';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { User, Settings, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your account and services from your dashboard.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Profile</h3>
                <p className="text-sm text-gray-600">Manage your account</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{user?.email}</span>
              </div>
            </div>
          </Card>

          {/* Services Card */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Services</h3>
                <p className="text-sm text-gray-600">Browse available services</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/services')}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              View Services
            </Button>
          </Card>

          {/* Settings Card */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gray-100 rounded-full p-3">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Account preferences</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              Sign Out
            </Button>
          </Card>
        </div>

        {/* Subscription Status */}
        <div className="mt-8">
          <SubscriptionStatus />
        </div>
      </div>
    </div>
  );
}