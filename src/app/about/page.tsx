import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Lightbulb, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">About Us</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Your centralized hub for discovering extracurricular opportunities in the UAE.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-headline font-semibold">The Problem We Solve</h2>
            <p className="text-muted-foreground leading-relaxed">
              Many incredible extracurricular opportunities—internships, volunteering roles, competitions, and more—are available across the UAE. However, these are often scattered across different websites, social media channels, and school notice boards. For ambitious students, finding relevant and timely opportunities can be a frustrating and time-consuming scavenger hunt.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Most students simply don't know where to look, and as a result, they miss out on valuable experiences that could shape their futures.
            </p>
          </div>
          <div>
            <img
              src="https://placehold.co/600x400.png"
              alt="Students collaborating"
              className="rounded-lg shadow-xl"
              data-ai-hint="collaboration students"
            />
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-headline font-semibold text-center mb-12">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">Centralize</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To bring all youth opportunities into one easy-to-navigate platform, saving students time and effort.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">Simplify</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To simplify the discovery process with powerful filters, allowing students to find the perfect activity for their interests and goals.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">Empower</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To empower the youth of the UAE by providing them with the tools and information they need to succeed outside the classroom.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
