import { Sidebar } from './Sidebar';

export const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-slate-100">
    <Sidebar />
    <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
      {children}
    </main>
  </div>
);
