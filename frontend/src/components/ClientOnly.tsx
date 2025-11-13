'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  ssr?: boolean;
}

export default function ClientOnly({
  children,
  fallback = null,
  ssr = false,
}: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(ssr);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
