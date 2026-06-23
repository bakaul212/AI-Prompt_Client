const Footer = () => {
    return (
        <footer className="bg-[#05070b] text-slate-500 py-8 text-center border-t border-slate-900/80 mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium">
                <p>&copy; {new Date().getFullYear()} PromptForge Engineering. Built for creators.</p>
                <div className="flex gap-6 text-slate-600">
                    <span className="hover:text-indigo-400 cursor-pointer transition-colors">Market License</span>
                    <span className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy Policy</span>
                    <span className="hover:text-indigo-400 cursor-pointer transition-colors">Developer API</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;