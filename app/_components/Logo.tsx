import logo from "@/public/logo-dark.png";
import Image from "next/image";
import Link from "next/link";
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      <Image
        src={logo}
        height="60"
        width="60"
        alt="Cabin in the Woods"
        quality={50}
      />
      <span className="text-xl font-semibold text-primary-100">
        Cabin in The Woods
      </span>
    </Link>
  );
}

export default Logo;
