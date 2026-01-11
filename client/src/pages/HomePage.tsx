const HomePage = () => {
    return (
        <div className="space-y-12">
            <section className="text-center py-20 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl">
                <h1 className="text-5xl font-bold text-gray-900 mb-6">Minimalist Decor for Modern Spaces</h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Discover a curated collection of premium setup items designed to elevate your productivity and aesthetics.
                </p>
                <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
                    Explore Collection
                </button>
            </section>

            <section>
                <h2 className="text-3xl font-bold mb-8 text-center">Featured Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-64 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 hover:scale-[1.02] transition-transform cursor-pointer">
                        Desk Setup
                    </div>
                    <div className="h-64 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 hover:scale-[1.02] transition-transform cursor-pointer">
                        Lighting
                    </div>
                    <div className="h-64 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 hover:scale-[1.02] transition-transform cursor-pointer">
                        Accessories
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
