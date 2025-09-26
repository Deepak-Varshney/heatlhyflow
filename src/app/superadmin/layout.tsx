// app/superadmin/layout.tsx

import { getMongoUser } from "@/lib/CheckUser";
import { redirect } from "next/navigation";

export default async function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getMongoUser();

    // This is the security guard for all superadmin pages.
    if (user?.role !== "SUPERADMIN") {
        redirect("/dashboard"); // Or any other page
    }

    return (
        <div>
            {/* You can add a special header or navigation for the admin panel here */}
            <main>{children}</main>
        </div>
    );
}