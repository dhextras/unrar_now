import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
      <Link href="/">
        <div className="flex items-center justify-center w-12 h-12 text-white rounded-xl">
          <img src="logo.png" />
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
