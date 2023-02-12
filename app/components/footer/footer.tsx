import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <div>
        <Image
          width={64}
          height={64}
          className="rounded-full"
          alt=""
          src="/logo.png"
        />
        <p>
          Ai Portrait Studio.
          <br />
          Bringing your vision to life with AI Portraits.
        </p>
      </div>
      <div>
        <span className="footer-title">Quick Links</span>
        <Link href="/refill" className="link link-hover">
          Add Credits
        </Link>
        <Link href="/create" className="link link-hover">
          Generate Avatar
        </Link>
        <Link href="/account" className="link link-hover">
          Avatar Studio
        </Link>
        <Link href="/cookie-policy" className="link link-hover">
          Cookie Policy
        </Link>
      </div>

      <div>
        <span className="footer-title">Legal</span>
        <Link href="/cookie-policy" className="link link-hover">
          Cookie Policy
        </Link>
      </div>

      <div>
        <span className="footer-title">Social</span>
        <div className="grid grid-flow-col gap-4">
          <a href="https://www.facebook.com/profile.php?id=100090161863246">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
