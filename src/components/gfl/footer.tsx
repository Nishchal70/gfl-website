import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-stone-950 text-white py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row justify-between gap-5">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/gfl-logo.png"
            alt="GFL logo"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
          <span className="brand-font text-2xl text-red-500">GFL</span>
        </div>
        <p className="text-sm text-stone-400">
          Global Farming League · Cooperative Clash of Clans farming wars
        </p>
      </div>
    </footer>
  );
}
