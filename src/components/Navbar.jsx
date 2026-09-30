export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="text-xl font-bold">SiteFix AI</div>

        <button className="rounded-lg border px-4 py-2 text-sm">Sign In</button>
      </div>
    </nav>
  );
}
