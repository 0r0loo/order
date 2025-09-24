import { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};