export default function Loading() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-8" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-48 animate-pulse"
            >
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
