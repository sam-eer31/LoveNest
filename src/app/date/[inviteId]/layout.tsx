export default function DateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background selection:bg-primary/30">
      {/* 
        This layout intentionally lacks a header/footer.
        The receiver experience should feel fully immersive, like a fullscreen app or story.
      */}
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  );
}
