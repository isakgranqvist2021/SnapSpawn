import Link from 'next/link';

interface NavDropdownLinkProps {
  children: React.ReactNode;
  href: string;
}

export function NavDropdownLink(props: NavDropdownLinkProps) {
  const { children, ...rest } = props;

  return <Link {...rest}>{children}</Link>;
}
