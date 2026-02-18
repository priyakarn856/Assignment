export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-colors px-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg dark:shadow-black/20 border border-zinc-200 dark:border-zinc-800 p-8 max-w-md text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Authentication Error
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
          Something went wrong during sign in. Please try again.
        </p>
        <a
          href="/"
          className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-600/20"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
