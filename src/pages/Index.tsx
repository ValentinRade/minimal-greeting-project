
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Index = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Welcome, {profile?.first_name || 'User'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile && (
            <div className="space-y-2">
              <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
            </div>
          )}
          <Button 
            onClick={signOut} 
            variant="outline"
            className="w-full"
          >
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
