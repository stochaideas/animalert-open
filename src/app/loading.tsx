export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <span className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-500"></span>
      <span className="ml-4 text-lg font-semibold">Loading...</span>
    </div>
  );
}
