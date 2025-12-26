import type React from 'react';
import { ProfileLayout } from './ProfileLayout';

export default function ProfileSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-4 sm:py-6 md:py-8">
      <ProfileLayout>{children}</ProfileLayout>
    </section>
  );
}

