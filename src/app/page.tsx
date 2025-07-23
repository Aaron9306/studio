'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Target, Lightbulb, Users, Laptop, Code, HandHeart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Home() {
  const opportunityTypes = [
    {
      icon: Laptop,
      title: 'Bootcamps',
      description: 'Acquire new skills and accelerate your learning with intensive workshops.',
    },
    {
      icon: Code,
      title: 'Hackathons & Competitions',
      description: 'Test your skills, solve challenges, and win amazing prizes.',
    },
    {
      icon: HandHeart,
      title: 'Volunteering',
      description: 'Make a positive impact in your community and support great causes.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-primary text-primary-foreground text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.1] [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
          <div className="container mx-auto px-4 relative">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 tracking-tight">
              Unlock Your Potential in the UAE
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-primary-foreground/80">
              Your central hub for internships, volunteering, competitions, and more. Discover opportunities that build your future.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transform hover:scale-105 transition-transform duration-300">
                Explore Opportunities <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              A Glimpse of What Awaits You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {opportunityTypes.map((type, index) => (
                <Card key={index} className="text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                      <type.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl">{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Our Mission Section */}
        <section className="py-16 md:py-24 bg-secondary">
           <div className="container mx-auto px-4">
            <div className="text-center">
               <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Mission</h2>
               <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">We are dedicated to bridging the information gap and empowering the next generation of leaders in the UAE.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <Card className="text-center bg-card/50">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4 text-xl">Centralize Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To bring every youth opportunity into one simple, powerful platform.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center bg-card/50">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                    <Lightbulb className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4 text-xl">Simplify Discovery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To provide smart tools that help students instantly find the perfect activity.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center bg-card/50">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4 text-xl">Empower Futures</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To equip the youth with experiences needed to build successful futures.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
