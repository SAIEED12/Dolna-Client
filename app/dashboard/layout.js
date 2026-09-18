export default function RootLayout({ children }) {
  return (
    <div>
      <div className="flex w-screen">
        <div className="border w-50 h-screen">Sidebar</div>
        <div className="w-full">
          <div className="border h-10 w-full">Navbar</div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
