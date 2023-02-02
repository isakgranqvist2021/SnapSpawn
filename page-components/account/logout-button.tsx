export function LogoutButton() {
  return (
    <a
      className="bg-red-800 text-sm text-sm px-2 py-1 rounded text-white hover:bg-red-700"
      href="/api/auth/logout"
    >
      Logout
    </a>
  );
}
