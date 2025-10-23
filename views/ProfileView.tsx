
import React from 'react';

const ProfileView: React.FC = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Profile</h2>
            <div className="bg-[var(--surface)] p-6 rounded-2xl text-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-4 flex items-center justify-center">
                    <i className="fas fa-user text-4xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-semibold">User</h3>
                <p className="text-sm text-[var(--text-light)]">Profile settings and features are coming soon!</p>
            </div>
        </div>
    );
};

export default ProfileView;
