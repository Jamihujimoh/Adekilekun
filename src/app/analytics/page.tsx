import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Deep dive into your data with advanced analytics.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            This page is under construction. Check back later for powerful analytics tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">No analytics available yet.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
