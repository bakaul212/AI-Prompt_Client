export const metadata = {
  title: 'Dashboard | PromptForge',
  description: 'Manage your AI configurations and forge new algorithmic cores.',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="w-full min-h-screen bg-[#0a0d14]">
      {children}
    </div>
  );
}