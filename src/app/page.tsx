'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, HeartHandshake, Mic, Trophy, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const sampleOpportunities = [
  {
    title: 'Internship at Tech Startup',
    type: 'Internship',
    summary: 'Gain hands-on experience in a fast-paced tech environment.',
  },
  {
    title: 'Model United Nations Conference',
    type: 'MUN',
    summary: 'Debate global issues and enhance your diplomacy skills.',
  },
  {
    title: 'Volunteer with Red Crescent',
    type: 'Volunteering',
    summary: 'Make a difference in your community by helping those in need.',
  },
];

const features = [
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'Curated Opportunities',
    description: 'Access a wide range of activities, from internships to competitions, tailored for students.',
  },
  {
    icon: <HeartHandshake className="h-8 w-8 text-primary" />,
    title: 'Online & Offline Events',
    description: 'Find both virtual and in-person events to fit your schedule and preferences.',
  },
  {
    icon: <Mic className="h-8 w-8 text-primary" />,
    title: 'Diverse Fields',
    description: 'Explore opportunities in various fields like tech, arts, business, and social sciences.',
  },
  {
    icon: <Trophy className="h-8 w-8 text-primary" />,
    title: 'Emirati & All-Nationality',
    description: 'Filter opportunities based on audience to find the perfect match for you.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-primary text-primary-foreground text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.1] [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
          <div className="container mx-auto px-4 relative">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 tracking-tight">
              Discover More Opportunities for UAE Youth
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-primary-foreground/80">
              Your central hub for internships, volunteering, competitions, and more. Unlock your potential and build your future.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transform hover:scale-105 transition-transform duration-300">
                See More Opportunities <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Opportunities Preview Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              A Glimpse of What Awaits You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sampleOpportunities.map((opp, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-accent">
                  <CardHeader>
                    <CardTitle className="font-headline">{opp.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-semibold text-primary mb-2">{opp.type}</p>
                    <p className="text-muted-foreground">{opp.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Use This Platform Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              Why Choose Youth Opportunities Hub?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 bg-card rounded-lg shadow-md">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-headline font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
