import { PublicHeader } from '@/components/public-header';

export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 min-h-0">{children}</main>
    </div>
  );
}
