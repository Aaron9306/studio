import Link from 'next/link';
import { Building } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">UAE Opportunities Hub</span>
          </div>
          <nav className="flex space-x-6 text-sm font-medium">
            <Link href="/about" className="transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-primary">
              Opportunities
            </Link>
          </nav>
        </div>
        <div className="text-center text-muted-foreground text-sm mt-8">
          © {new Date().getFullYear()} UAE Opportunities Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
