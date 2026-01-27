export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full flex flex-col xl:items-center gap-8 pt-4">{children}</div>;
}
