'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Code, Trophy, Users } from 'lucide-react';
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
      icon: Code,
      title: 'Bootcamps',
      description: 'Intensive, short-term training programs to build in-demand skills.',
    },
    {
      icon: Trophy,
      title: 'Hackathons & Competitions',
      description: 'Showcase your talents and solve real-world challenges.',
    },
    {
      icon: Users,
      title: 'Volunteering',
      description: 'Gain meaningful experience while giving back to the community.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-40 text-center bg-grid-white/[0.1]">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
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

        
        {/* Everything You Need Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
                A Glimpse of What Awaits You
              </h2>
               <p className="text-lg max-w-3xl mx-auto text-muted-foreground">
                  Explore diverse opportunities tailored for your growth and success.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
