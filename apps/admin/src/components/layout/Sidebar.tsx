'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { LayoutDashboard, Globe, Image as ImageIcon, Home, FileText, ShoppingCart, Mail, Truck, Settings, LogOut, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetSite } from '@/hooks/useSites';

const generalNav = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Sites', href: '/sites', icon: Globe },
  { name: 'Media Library', href: '/media', icon: ImageIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const { data: session } = useSession();
  
  const siteId = params?.siteId as string | undefined;
  const { data: site } = useGetSite(siteId || "");

  const siteNav = siteId ? [
    { name: 'Overview', href: `/sites/${siteId}`, icon: Home },
    { name: 'Landing Page', href: `/sites/${siteId}/landing-page`, icon: FileText },
    { name: 'Product Page', href: `/sites/${siteId}/product-page`, icon: ShoppingCart },
    { name: 'Contact Page', href: `/sites/${siteId}/contact-page`, icon: Mail },
    { name: 'Track Order', href: `/sites/${siteId}/track-order-page`, icon: Truck },
    { name: 'Footer', href: `/sites/${siteId}/footer`, icon: Settings },
    { name: 'Media', href: `/sites/${siteId}/media`, icon: ImageIcon },
  ] : [];

  const navGroups = siteId 
    ? [{ title: \`Site: \${site?.name || 'Loading...'}\`, items: siteNav }] 
    : [{ title: 'General', items: generalNav }];

  return (
    <div className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-neutral-950 text-neutral-300">
      <div className="flex h-16 shrink-0 items-center px-6">
        <span className="text-xl font-bold text-white flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          CoreVita
        </span>
      </div>
      
      <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-4 space-y-8">
        {navGroups.map((group, i) => (
          <div key={i}>
            <div className="px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-900 transition-colors relative",
                      isActive ? "text-white bg-neutral-900" : "text-neutral-400 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-md" />
                    )}
                    <item.icon
                      className={cn(
                        "mr-3 flex-shrink-0 h-5 w-5",
                        isActive ? "text-primary" : "text-neutral-500 group-hover:text-neutral-300"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        
        {siteId && (
          <div>
            <div className="px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 mt-4">
              Switch
            </div>
            <Link
              href="/sites"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
            >
              <Globe className="mr-3 flex-shrink-0 h-5 w-5 text-neutral-500 group-hover:text-neutral-300" />
              All Sites
            </Link>
          </div>
        )}
      </nav>

      <div className="shrink-0 border-t border-neutral-800 p-4">
        <div className="flex items-center">
          <div>
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt={session?.user?.email || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {session?.user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-3 flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">
              {session?.user?.email || "Admin"}
            </p>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="ml-auto flex-shrink-0 p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}