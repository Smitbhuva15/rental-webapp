'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
      <Toaster 
        position="bottom-right"
        theme="system"
        richColors
        expand={true}
      />
    </ThemeProvider>
  );
}
