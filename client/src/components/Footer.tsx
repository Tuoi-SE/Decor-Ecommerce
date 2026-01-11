const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
            <div className="container mx-auto px-4 text-center text-gray-500">
                <p>© {new Date().getFullYear()} Decor Shop System. All rights reserved.</p>
                <p className="text-sm mt-2">Elevate your space.</p>
            </div>
        </footer>
    );
};

export default Footer;
