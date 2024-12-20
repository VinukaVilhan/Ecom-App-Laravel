"use client";
import React, { useState } from 'react';
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from "@/app/middleware/ProtectedRoutes";
import TopNavigation from '@/app/components/customer/topNavigationBar';
import { Camera, User } from 'lucide-react';

const EditProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        address: user?.address || '',
        password: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [activeSection, setActiveSection] = useState<'profile' | 'cart' | 'orders' | 'wishlist'>('profile');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            try {
                // Here you would implement your update logic
                console.log('Updating profile:', formData);
                // After successful update
                setIsEditing(false);
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        } else {
            setIsEditing(true);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Handle photo upload logic here
            console.log('Uploading photo:', file);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <TopNavigation
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    onLogout={logout}
                />
                
                <main className="container mx-auto px-4 pt-20">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Profile Settings</h2>
                                <button
                                    onClick={() => !isEditing && setIsEditing(true)}
                                    className={`btn btn-sm ${isEditing ? 'hidden' : 'btn-primary'}`}
                                >
                                    Edit Profile
                                </button>
                            </div>

                            {/* Profile Photo Section */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                                        {user?.photoURL ? (
                                            <img 
                                                src={user.photoURL} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                <User size={64} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <label 
                                            htmlFor="photo-upload" 
                                            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg"
                                        >
                                            <Camera size={20} />
                                            <input
                                                id="photo-upload"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                                title="Upload your profile photo"
                                                placeholder="Upload your profile photo"
                                            />
                                        </label>
                                    )}
                                </div>
                                <h3 className="mt-4 text-xl font-semibold">{user?.displayName || 'User'}</h3>
                                <p className="text-gray-500">{user?.email}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            title='Name'
                                            placeholder='Name'
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            title='email'
                                            placeholder='Email'
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    
                                    
                                </div>

                                {isEditing && (
                                    <div className="space-y-6 pt-4 border-t">
                                        <h3 className="text-lg font-medium">Change Password</h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    title='password'
                                                    placeholder='Password'
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    title='newPassword'
                                                    placeholder='New Password'
                                                    value={formData.newPassword}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isEditing && (
                                    <div className="flex space-x-4 pt-6">
                                        <button
                                            type="submit"
                                            className="flex-1 btn btn-primary"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 btn btn-outline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default EditProfile;