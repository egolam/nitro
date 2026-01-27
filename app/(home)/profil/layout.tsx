export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full flex flex-col gap-8 pt-4">{children}</div>;
}
