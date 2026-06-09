
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'PreRP | Futuristic Campus Ecosystem',
  description: 'AI-powered campus communication and academic management.',
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<any>;
}) {
  // Unwrap async params for Next.js 15 Server Component
  const params = await props.params;
  const { children } = props;

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden min-h-screen">
        {/* Floating Gradient Orbs */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="fixed top-[40%] right-[10%] w-[20%] h-[20%] bg-purple-500/10 rounded-full blur-[80px] -z-10" />
        
        {children}
        <Toaster />
      </body>
    </html>
  );
}
