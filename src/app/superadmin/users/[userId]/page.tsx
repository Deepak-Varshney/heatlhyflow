import { redirect } from 'next/navigation';

export const metadata = {
  title: 'SUPERADMIN : Users',
};

export default async function Page() {
  redirect('/superadmin/users');
}
