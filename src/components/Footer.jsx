export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <p className="text-sm text-gray-500">
          © 2026 SiteFix AI. All rights reserved.
        </p>

        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-black">
            Privacy
          </a>

          <a href="#" className="hover:text-black">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
