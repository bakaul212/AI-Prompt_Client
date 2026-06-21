// client/src/components/Footer.js
const Footer = () => {
    return (
        <footer className="bg-gray-950 text-gray-400 py-6 text-center border-t border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4">
                <p className="text-sm">&copy; {new Date().getFullYear()} PromptMarket Platform. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;