import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, API keys, and preferences.
        </p>
      </div>
      <Separator />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Column 1: Profile Settings */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Update your name and profile picture.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src="https://placehold.co/100x100.png"
                    alt="User avatar"
                  />
                  <AvatarFallback>UP</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="StatCast User" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="statcast@example.com" disabled />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </div>

        {/* Column 2: API Keys and other settings */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage the API keys for the data providers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-football">API-Football Key</Label>
                <Input
                  id="api-football"
                  type="password"
                  placeholder="Enter your API-Football key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="odds-api">The Odds API Key</Label>
                <Input
                  id="odds-api"
                  type="password"
                  placeholder="Enter your Odds API key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sportradar-api">Sportradar API Key</Label>
                <Input
                  id="sportradar-api"
                  type="password"
                  placeholder="Enter your Sportradar API key"
                />
              </div>
              <Button>Save API Keys</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
