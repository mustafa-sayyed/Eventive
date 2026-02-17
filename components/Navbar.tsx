"use client";
import Image from "next/image";
import Link from "next/link";

function Navbar() {
  return (
    <header>
      <nav>
        <Link href="/">
          <Image src="/icons/logo.png" width={24} height={24} alt="DevEvent Logo" />
          <p>DevEvent</p>
        </Link>

        <ul>
          <Link href="/home">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="/schedule">Schedule</Link>
          <Link href="/sponsors">Sponsors</Link>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
