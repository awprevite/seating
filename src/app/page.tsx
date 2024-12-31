'use client';
import { useRouter } from 'next/navigation';

export default function Home() {

  const router = useRouter();

  const handleRedirect = () => {
    router.push('/newpage');
  };

  return (
    <div>
      <h2>Welcome to the Seating Arrangement App!</h2>
      <p>Here you can organize your poker seating arrangement.</p>
      
      {/* Button that navigates to the new page */}
      <button onClick={handleRedirect}>Go to New Page</button>
    </div>
  );
}
