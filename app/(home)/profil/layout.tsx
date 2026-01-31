import { ProfileNavigation } from "@/components/profile/ProfileNavigation";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-5xl flex-1 pt-4 flex gap-4 w-full flex-col md:flex-row">
      <div className="flex flex-col gap-4">
        {/* <header className="flex items-center gap-2">
          <h3 className="text-violet-700 leading-none font-medium">PROFİL</h3>
        </header> */}
        <ProfileNavigation />
      </div>
      <section className="flex-1 flex flex-col gap-4">{children}</section>
    </div>
  );
}
