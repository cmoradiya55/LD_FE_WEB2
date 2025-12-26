import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <Sidebar />
            <div className="min-h-screen pl-16">
                {children}
            </div>
        </>
    );
}

