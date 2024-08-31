import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
      <Link href="/">
        <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-xl">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 20.735a2 2 0 0 1 -1 -1.735v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-1"></path>
            <path d="M11 17a2 2 0 0 1 2 2v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-2a2 2 0 0 1 2 -2z"></path>
            <path d="M11 5l-1 0"></path>
            <path d="M13 7l-1 0"></path>
            <path d="M11 9l-1 0"></path>
            <path d="M13 11l-1 0"></path>
            <path d="M11 13l-1 0"></path>
            <path d="M13 15l-1 0"></path>
          </svg>
        </div>
      </Link>
      <nav className="flex space-x-4">
        <Link href="/" className="text-black underline">
          Home
        </Link>
        <Link href="/common-questions" className="text-black underline">
          Common Questions
        </Link>
      </nav>
    </header>
  );
}
