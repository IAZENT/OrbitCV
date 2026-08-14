export function AppFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-muted-foreground sm:flex-row">
        <span>OrbitCV — build one CV, tailor it for every role.</span>
        <span>&copy; {new Date().getFullYear()} OrbitCV</span>
      </div>
    </footer>
  );
}
