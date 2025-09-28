// app/dashboard/manage-clinic/page.tsx

import { OrganizationProfile } from "@clerk/nextjs";

const ManageClinicPage = () => {
  return (
    <div className="flex items-center justify-center p-8">
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

export default ManageClinicPage;