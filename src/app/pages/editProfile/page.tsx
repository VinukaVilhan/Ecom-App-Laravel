"use client";
import React, { useState } from 'react';
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from "@/app/middleware/ProtectedRoutes";
import TopNavigation from '@/app/components/customer/topNavigationBar';
import { Camera, User } from 'lucide-react';

const EditProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
    });
    const [activeSection, setActiveSection] = useState<'profile' | 'cart' | 'orders' | 'wishlist'>('profile');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const updateProfile = async (data: any) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/profile/update', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        try {
            setIsLoading(true);
            setMessage(null);
            const updateData = {
                name: formData.name,
                email: formData.email,
                ...(formData.password && {
                    password: formData.password,
                    password_confirmation: formData.password_confirmation
                })
            };

            const response = await updateProfile(updateData);
            
            setMessage({
                type: 'success',
                text: 'Profile updated successfully'
            });

            setFormData(prev => ({
                ...prev,
                password: '',
                password_confirmation: ''
            }));
            
            setIsEditing(false);
            // Update the user context if needed
            // updateUser(response.user);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to update profile'
            });
        } finally {
            setIsLoading(false);
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
                            {message && (
                                <div className={`mb-4 p-4 rounded ${
                                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {message.text}
                                </div>
                            )}

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
                                                title="Upload profile photo"
                                                aria-label="Upload profile photo"
                                            />
                                        </label>
                                    )}
                                </div>
                                <h3 className="mt-4 text-xl font-semibold">{user?.name || 'User'}</h3>
                                <p className="text-gray-500">{user?.email}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing || isLoading}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            required
                                            title="Enter your name"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing || isLoading}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            required
                                            title="Enter your email"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="space-y-6 pt-4 border-t">
                                        <h3 className="text-lg font-medium">Change Password</h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                    New Password
                                                </label>
                                                <input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                                    minLength={6}
                                                    title="Enter new password"
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    id="password_confirmation"
                                                    type="password"
                                                    name="password_confirmation"
                                                    value={formData.password_confirmation}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                                    minLength={6}
                                                    title="Confirm new password"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isEditing && (
                                    <div className="flex space-x-4 pt-6">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 btn btn-primary"
                                        >
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            disabled={isLoading}
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