import { useAuthStore } from "@/hooks/useAuthStore";

const CustomerProfilePage = () => {
    const { user } = useAuthStore();

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">My Profile</h1>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl">
                        {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{user?.fullName}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                        <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium mt-2 capitalize">{user?.role}</span>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h3 className="font-semibold mb-4">Actions</h3>
                    <button className="text-primary hover:underline">Edit Profile</button>
                </div>
            </div>
        </div>
    );
};
export default CustomerProfilePage;
