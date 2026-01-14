import { useRouter } from "next/navigation";

export function Backbutton() {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-semibold rounded-lg transition text-sm"
        title="Voltar para página anterior"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="hidden sm:inline">Voltar</span>
      </button>
      <button
        onClick={() => router.replace("/")}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-semibold rounded-lg transition text-sm"
        title="Ir para página inicial"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span className="hidden sm:inline">Início</span>
      </button>
    </div>
  );
}
