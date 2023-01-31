export function LogoutButton() {
  return (
    <a
      className="bg-red-800 px-3 py-2 rounded text-white hover:bg-red-700"
      href="/api/auth/logout"
    >
      Logout
    </a>
  );
}
