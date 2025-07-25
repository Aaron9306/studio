'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Code, Trophy, Users, Target, Lightbulb } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';
import { ForceBlueTheme } from '@/components/ForceDarkTheme';

export default function Home() {
  
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
    <>
    <ForceBlueTheme />
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
             <div className="text-center mt-16">
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                    See More Opportunities <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
           <div className="container mx-auto px-4">
              <div className="text-center">
                 <h2 className="text-3xl font-headline font-semibold text-primary-foreground">Our Mission</h2>
                 <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">We are dedicated to bridging the information gap and empowering the next generation of leaders in the UAE.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <Card className="text-center bg-card/50 backdrop-blur-sm border-border/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline mt-4 text-xl">Centralize Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      To bring every youth opportunity—from internships to workshops—into one simple, powerful, and easy-to-navigate platform.
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center bg-card/50 backdrop-blur-sm border-border/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                      <Lightbulb className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline mt-4 text-xl">Simplify Discovery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      To provide smart filtering and search tools that allow students to instantly find the perfect activity for their unique interests and future goals.
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center bg-card/50 backdrop-blur-sm border-border/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline mt-4 text-xl">Empower Futures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      To equip the youth of the UAE with the critical information and experiences they need to build successful futures outside the classroom.
                    </p>
                  </CardContent>
                </Card>
              </div>
           </div>
        </section>

      </main>
      <Footer />
    </div>
    </>
  );
}
