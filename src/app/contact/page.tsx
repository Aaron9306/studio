import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageSquareWarning } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">Get in Touch</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            This project was built for fun with the simple goal of helping students in the UAE discover amazing opportunities. We'd love to hear from you!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="feedback" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="feedback">
                <MessageSquareWarning className="mr-2 h-4 w-4" />
                Feedback / Report an Issue
              </TabsTrigger>
              <TabsTrigger value="involved">
                <Heart className="mr-2 h-4 w-4" />
                Get Involved
              </TabsTrigger>
            </TabsList>
            <TabsContent value="feedback" className="mt-6">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border">
                   <iframe 
                      src="https://docs.google.com/forms/d/e/1FAIpQLScZkQ-8yNKEdf5Srfyiey7ongHN7szOAXSnIp-bb8fyEkUDJw/viewform?embedded=true" 
                      width="100%" 
                      height="500" 
                      frameBorder="0" 
                      marginHeight={0}
                      marginWidth={0}
                      className="w-full h-[500px]"
                    >
                        Loading…
                    </iframe>
                </div>
            </TabsContent>
            <TabsContent value="involved" className="mt-6">
                 <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border">
                   <iframe 
                    src="https://docs.google.com/forms/d/e/1FAIpQLScX-hDPOsZObbtsw9TvYt6EfYsX3WdxqwEzr5NH2lkTrG89YQ/viewform?embedded=true" 
                    width="100%" 
                    height="1150" 
                    frameBorder="0" 
                    marginHeight={0}
                    marginWidth={0}
                    className="w-full h-[1150px]"
                    >
                        Loading…
                    </iframe>
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
