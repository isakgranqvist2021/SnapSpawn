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

        <div>
          <header>Ai Portrait Studio.</header>

          <p>Bringing your vision to life with AI Portraits.</p>

          <a
            className="link link-secondary"
            href="mailto:contact@granqvist.dev"
          >
            contact@granqvist.dev
          </a>
        </div>
      </div>

      <nav>
        <header className="footer-title">Quick links</header>

        <Link className="link link-hover" href="/account">
          Avatar studio
        </Link>
        <Link className="link link-hover" href="/cookie-policy">
          Cookie Policy
        </Link>
      </nav>

      <nav>
        <header className="footer-title">Social</header>

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
      </nav>
    </footer>
  );
}
