'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Search, CheckCircle, Globe, Briefcase } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function Home() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    // This will apply the new dark theme by default on the homepage
    document.documentElement.classList.add('dark');
    document.documentElement.style.setProperty('color-scheme', 'dark');
    
    // We remove the light theme class if it exists
    document.documentElement.classList.remove('light');

    // On unmount, we can revert this if needed, but for a consistent
    // dark theme on the homepage, we can just leave it.
    return () => {
      // If you wanted to revert to system theme on leaving the page:
      // document.documentElement.classList.remove('dark');
      // document.documentElement.style.removeProperty('color-scheme');
    };
  }, []);


  const features = [
    {
      icon: Search,
      title: 'Easy Access to Events',
      description: 'Find all UAE youth opportunities in one centralized platform.',
    },
    {
      icon: CheckCircle,
      title: 'Verified Opportunities',
      description: 'All opportunities are reviewed and verified by our team.',
    },
    {
      icon: Globe,
      title: 'Both Emirati & All-Nationality Filters',
      description: 'Filter opportunities based on nationality requirements.',
    },
     {
      icon: Briefcase,
      title: 'Online & Offline Listings',
      description: 'Discover both virtual and in-person opportunities.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-40 text-center">
          <div className="container mx-auto px-4 relative">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 tracking-tight">
              Discover More <span className="text-primary">Opportunities</span> for UAE Youth
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-muted-foreground">
              Your gateway to internships, competitions, volunteering, and educational programs designed specifically for young talents in the UAE.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                See More <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
              Why Choose Us?
            </h2>
             <p className="text-lg max-w-3xl mx-auto text-muted-foreground">
                UAE students often miss valuable opportunities due to scattered information across different platforms and organizations. We solve this by creating a centralized hub where all youth opportunities are verified, organized, and easily accessible.
            </p>
          </div>
        </section>
        
        {/* Everything You Need Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              Everything You Need in One Place
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center bg-card/50 backdrop-blur-sm border-border/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="font-headline text-xl mb-2">{feature.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
