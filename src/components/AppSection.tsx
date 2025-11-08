export default function AppSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="mt-8 text-center">{children}</section>;
}
