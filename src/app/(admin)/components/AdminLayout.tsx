'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Plus,
  BarChart3,
  Calendar,
  FileText,
  Building2,
  LogOut,
  Users,
  Image,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { supabaseClient } from '@/lib/supabase-client';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  currentPage: string;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddClick?: () => void;
}

export default function AdminLayout({
  children,
  title,
  description,
  currentPage,
  showAddButton = false,
  addButtonText = 'Add New',
  onAddClick,
}: AdminLayoutProps) {
  const router = useRouter();
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  const handleSignOut = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      console.log('Signing out', error);
      if (error) {
        console.error('Error signing out:', error);
      }
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Still redirect even if there's an error
      router.push('/login');
    }
  };

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      disabled: false,
    },
    {
      href: '/admin/events',
      label: 'Events',
      icon: <Calendar className="w-4 h-4" />,
      disabled: false,
    },
    {
      href: '/admin/resources',
      label: 'Resources',
      icon: <FileText className="w-4 h-4" />,
      disabled: false,
    },
    {
      href: '/admin/vendors',
      label: 'Vendors',
      icon: <Building2 className="w-4 h-4" />,
      disabled: false,
    },
  ];

  const contentSubItems = [
    {
      href: '/admin/content/team',
      label: 'Team',
      icon: <Users className="w-4 h-4" />,
    },
    {
      href: '/admin/content/banner',
      label: 'Banner',
      icon: <Image className="w-4 h-4" />,
    },
  ];

  // Check if current page is under content section
  const isContentPage = currentPage.startsWith('/admin/content');

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border fixed h-full overflow-y-auto">
        <div className="p-4 border-b border-sidebar-border">
          <h2 className="text-lg font-bold text-sidebar-foreground">
            Netpoleon Admin
          </h2>
          <p className="text-xs text-sidebar-foreground/70 mt-1">Admin Panel</p>
        </div>
        <nav className="p-3">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.href}>
                {item.disabled ? (
                  <div className="flex items-center px-3 py-2 text-sidebar-foreground/50 rounded-md border-transparent cursor-not-allowed text-sm">
                    <span className="mr-2 text-sidebar-foreground/50">
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors text-sm ${
                      currentPage === item.href
                        ? 'border-sidebar-primary bg-sidebar-accent'
                        : 'border-transparent hover:border-sidebar-primary'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}

            {/* Content Section */}
            <li>
              <button
                onClick={() => setIsContentExpanded(!isContentExpanded)}
                className={`flex items-center w-full px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors text-sm ${
                  isContentPage ? 'bg-sidebar-accent' : ''
                }`}
              >
                <FileText className="mr-2 h-4 w-4" />
                Content
                {isContentExpanded ? (
                  <ChevronDown className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </button>
              {isContentExpanded && (
                <ul className="ml-4 mt-1 space-y-1">
                  {contentSubItems.map(item => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors text-sm ${
                          currentPage === item.href
                            ? 'border-sidebar-primary bg-sidebar-accent'
                            : 'border-transparent hover:border-sidebar-primary'
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Logout Button */}
            <li className="mt-auto pt-4 border-t border-sidebar-border">
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors text-sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">{title}</h1>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
          <div className="flex gap-3">
            {showAddButton && (
              <Button onClick={onAddClick}>
                <Plus className="w-4 h-4 mr-2" />
                {addButtonText}
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
