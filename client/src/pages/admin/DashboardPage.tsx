const AdminDashboardPage = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                    <p className="text-2xl font-bold mt-2">1,234</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                    <p className="text-2xl font-bold mt-2">$45,200</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
                    <p className="text-2xl font-bold mt-2">12</p>
                </div>
            </div>
        </div>
    );
};
export default AdminDashboardPage;
