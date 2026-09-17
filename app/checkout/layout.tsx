export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA]">
      <main className="flex-1">{children}</main>
    </div>
  );
}
