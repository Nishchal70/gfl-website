export function SectionTitle({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="text-center mb-10">
      <h2 className="display text-4xl md:text-5xl uppercase">{children}</h2>
      <div className="red-line" aria-hidden="true" />
      {sub && <p className="mt-5 max-w-2xl mx-auto text-zinc-600">{sub}</p>}
    </div>
  );
}
