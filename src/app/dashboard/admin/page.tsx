// app/dashboard/admin/page.tsx

import { OrganizationProfile } from "@clerk/nextjs";

const AdminDashboardPage = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Clinic</h1>
            <OrganizationProfile
                routing="hash"
                appearance={{
                    elements: {
                        rootBox: "w-full max-w-4xl",
                        card: "shadow-none border",
                    },
                }}
            />
        </div>
    );
};

export default AdminDashboardPage;