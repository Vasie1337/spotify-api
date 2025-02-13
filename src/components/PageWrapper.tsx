interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main className="max-w-screen-2xl mx-auto px-4 py-8">
      {children}
    </main>
  );
} 