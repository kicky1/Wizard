import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Project Creator</h1>
        <p className="mb-8 text-gray-600">Create and manage your projects with ease.</p>
        <Link to="/create-project">
          <Button>Create New Project</Button>
        </Link>
      </div>
    </div>
  );
};