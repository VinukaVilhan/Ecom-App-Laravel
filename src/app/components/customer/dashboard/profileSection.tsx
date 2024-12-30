import React from 'react';
import { Settings, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/User'; // Create this type file

interface ProfileCardProps {
  user: User | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => (
  <div className="bg-white shadow-md rounded-lg p-6">
    <div className="flex items-center space-x-4 mb-6">
      <div className="avatar">
        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img 
            src={'../../../../../public/images/defaultProfile.png'} 
            alt="User Profile" 
            className="object-cover"
          />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{user?.displayName || 'User'}</h2>
        <p className="text-gray-500">{user?.email}</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase">Phone</h3>
        <p className="text-gray-700">{user?.phoneNumber || 'Not provided'}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase">Member Since</h3>
        <p className="text-gray-700">
          {user?.metadata?.creationTime 
            ? new Date(user.metadata.creationTime).toLocaleDateString() 
            : 'Unknown'}
        </p>
      </div>
    </div>
  </div>
);

export const ProfileSection: React.FC<ProfileCardProps> = ({ user }) => {
  const router = useRouter();
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <ProfileCard user={user} />
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
        <div className="space-y-4">
          <button 
            className="btn btn-outline w-full"
            onClick={() => router.push('/pages/editProfile')}
          >
            <Settings className="mr-2" /> Edit Profile
          </button>
          <button className="btn btn-outline w-full">
            <CreditCard className="mr-2" /> Payment Methods
          </button>
        </div>
      </div>
    </div>
  );
};