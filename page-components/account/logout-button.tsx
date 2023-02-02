import { getButtonClassName } from '@aa/utils/styles';

export function LogoutButton() {
  return (
    <a
      className={getButtonClassName({
        bgColor: 'bg-red-800',
        textColor: 'text-white',
        hoverBgColor: 'bg-red-700',
      })}
      href="/api/auth/logout"
    >
      Logout
    </a>
  );
}
