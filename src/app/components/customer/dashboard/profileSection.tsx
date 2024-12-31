import React from 'react';
import { Settings, CreditCard, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
}

interface ProfileCardProps {
  user: User | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const router = useRouter();

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="avatar">
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <UserIcon size={64} className="text-gray-400" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Additional profile details can be added here */}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={() => router.push('/pages/editProfile')}
          className="btn btn-primary"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export const ProfileSection: React.FC<ProfileCardProps> = ({ user }) => {
  return (

      <ProfileCard user={user} />
 
  );
};

export default ProfileSection;