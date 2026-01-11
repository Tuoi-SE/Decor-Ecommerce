import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth.service';
import clsx from 'clsx';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const data = await AuthService.login(email, password);
            AuthService.handleLoginSuccess(data);

            // Redirect based on role
            if (data.user.role === 'admin') navigate('/admin/dashboard');
            else if (data.user.role === 'staff') navigate('/staff/dashboard');
            else {
                // If customer tries to login via admin portal, usually we block or allow but redirect to home
                // User said "restricted access", so maybe show error? 
                // For now, let's redirect them to home/profile
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-row font-display bg-background-light dark:bg-background-dark text-[#1b100e] dark:text-white">
            {/* Left Sidebar (Premium Brand Panel) */}
            <div className="hidden lg:flex w-[40%] flex-col justify-between bg-sidebar-dark text-white relative overflow-hidden">
                {/* Decorative Background Image with Overlay */}
                <div
                    className="absolute inset-0 z-0 opacity-40 mix-blend-overlay bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDCWt7F6PB-nRsqQA-37hzgIcSXTYRbUefDlLy950AsU5vcySTomBQD2MNzIoEHnJDx_ZhZUIISIqikWjFZQn-WYcww4PJSLaqsIcUdEjlycWlEdQ9KAa7nHX4Q5iAnQEBH5-XxrIRObd7fw-6XgwIBbn111PdGbBUJP1c4A2oMOIGEx5hxl_tbb8cHS_H_tIDSUi5w3-RLUGkQc8riE0VkCyWgLeKKyn1JcTG1avstZVXHM4kp2jQ2EfVUjqrv1xGI7jIHnqtNfw')" }}
                />

                <div className="relative z-10 p-12">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-4xl">inventory_2</span>
                        <span className="text-2xl font-serif font-bold tracking-wide">Unbox Admin</span>
                    </div>
                </div>

                <div className="relative z-10 p-12">
                    <h2 className="text-4xl font-serif font-medium leading-tight mb-4 text-white/90">Curating Premium Living Spaces.</h2>
                    <p className="text-white/60 text-lg font-light max-w-md">Secure access for authorized personnel only. Manage inventory, orders, and customer relationships with precision.</p>
                </div>

                <div className="relative z-10 px-12 py-8 border-t border-white/10">
                    <p className="text-xs text-white/40 uppercase tracking-widest">Internal System v2.4.0</p>
                </div>
            </div>

            {/* Right Content (Login Form) */}
            <div className="flex flex-1 flex-col items-center justify-center p-6 relative">
                {/* Mobile Logo */}
                <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-3xl">inventory_2</span>
                    <span className="text-xl font-serif font-bold text-gray-900 dark:text-white">Unbox</span>
                </div>

                <div className="w-full max-w-[480px]">
                    {/* Login Card */}
                    <div className="glass-panel rounded-2xl p-8 md:p-12 w-full">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 text-primary">
                                <span className="material-symbols-outlined">lock</span>
                            </div>
                            <h1 className="text-[#1b100e] dark:text-white font-serif text-[32px] font-bold leading-tight pb-2">Admin Portal</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-base font-normal">Please enter your credentials to access the dashboard.</p>
                        </div>

                        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    {error}
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[#1b100e] dark:text-gray-200 text-sm font-semibold leading-normal">
                                    Admin Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="flex w-full rounded-lg border border-gray-300 bg-white/50 dark:bg-background-dark/50 dark:border-gray-600 px-4 py-3.5 text-base text-[#1b100e] dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                    placeholder="name@unbox.com"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[#1b100e] dark:text-gray-200 text-sm font-semibold leading-normal">
                                        Security Key
                                    </label>
                                </div>
                                <div className="relative flex w-full items-center">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="flex w-full rounded-lg border border-gray-300 bg-white/50 dark:bg-background-dark/50 dark:border-gray-600 px-4 py-3.5 pr-12 text-base text-[#1b100e] dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 text-gray-400 hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between mt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 bg-transparent" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">Keep me signed in</span>
                                </label>
                                <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Forgot key?</a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={clsx(
                                    "w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-lg transition-all shadow-lg shadow-primary/20 active:scale-[0.98] mt-2 flex items-center justify-center gap-2",
                                    isLoading && "opacity-70 cursor-wait"
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                                        Authenticating...
                                    </>
                                ) : "Authenticate"}
                            </button>
                        </form>

                        {/* Footer Link */}
                        <div className="mt-8 text-center pt-6 border-t border-gray-200/60 dark:border-gray-700/60">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                New staff member?
                                <a href="#" className="font-semibold text-primary hover:underline ml-1">Request Access</a>
                            </p>
                        </div>
                    </div>

                    {/* Bottom Copyright */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400 dark:text-gray-600">
                            © 2024 Unbox Inc. Restricted Access.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
