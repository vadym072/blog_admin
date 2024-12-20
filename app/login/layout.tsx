export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 dark:from-indigo-900 dark:via-indigo-800 dark:to-purple-900 p-4">
      {children}
    </div>
  );
}