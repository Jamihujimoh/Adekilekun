'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  handlePrediction,
  handleReport,
  handleSummary,
} from '@/app/actions';
import { Loader2, Sparkles } from 'lucide-react';
import type { Fixture, Team } from '@/types';

// Schemas
const predictionSchema = z.object({
  team1Name: z.string().min(1, 'Please select the first team.'),
  team2Name: z.string().min(1, 'Please select the second team.'),
});

const summarySchema = z.object({
  matchId: z.string().min(1, 'Please select a match.'),
});

const reportSchema = z.object({
  playerName: z.string().min(2, 'Please enter a player name.'),
});

type PredictionFormValues = z.infer<typeof predictionSchema>;
type SummaryFormValues = z.infer<typeof summarySchema>;
type ReportFormValues = z.infer<typeof reportSchema>;

interface GenAIPanelProps {
  teams: Team[];
  completedMatches: Fixture[];
}

export function GenAIPanel({ teams, completedMatches }: GenAIPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI-Powered Insights</CardTitle>
        <CardDescription>
          Use generative AI to get predictions, summaries, and reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="predict">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="predict">Predict</TabsTrigger>
            <TabsTrigger value="summarize">Summarize</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
          </TabsList>
          <TabsContent value="predict">
            <PredictionForm teams={teams} />
          </TabsContent>
          <TabsContent value="summarize">
            <SummaryForm completedMatches={completedMatches} />
          </TabsContent>
          <TabsContent value="report">
            <ReportForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function PredictionForm({ teams }: { teams: Team[] }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionSchema),
    defaultValues: { team1Name: '', team2Name: '' },
  });

  const onSubmit: SubmitHandler<PredictionFormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    const response = await handlePrediction(data);
    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    } else {
      setResult(response.data);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="team1Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team 1</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Team" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={t.name}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="team2Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team 2</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Team" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={t.name}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Predict Outcome
        </Button>
        {result && (
          <ResultCard
            title="Prediction Result"
            content={`**Outcome:** ${
              result.predictedOutcome
            }\n**Confidence:** ${(result.confidenceLevel * 100).toFixed(
              0
            )}%\n\n**Odds:**\n- ${form.getValues(
              'team1Name'
            )} Win: **${result.team1WinOdds.toFixed(
              2
            )}**\n- ${form.getValues(
              'team2Name'
            )} Win: **${result.team2WinOdds.toFixed(
              2
            )}**\n- Draw: **${result.drawOdds.toFixed(2)}**\n\n**Rationale:**\n${
              result.rationale
            }`}
          />
        )}
      </form>
    </Form>
  );
}

function SummaryForm({ completedMatches }: { completedMatches: Fixture[] }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: { matchId: '' },
  });

  const onSubmit: SubmitHandler<SummaryFormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    const response = await handleSummary(data);
    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    } else {
      setResult(response.data);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="matchId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Match</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Match" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {completedMatches.map((match) => (
                    <SelectItem
                      key={match.fixture.id}
                      value={String(match.fixture.id)}
                    >
                      {match.teams.home.name} vs {match.teams.away.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Summary
        </Button>
        {result && (
          <ResultCard title="Match Summary" content={result.summary} />
        )}
      </form>
    </Form>
  );
}

function ReportForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { playerName: '' },
  });

  const onSubmit: SubmitHandler<ReportFormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    const response = await handleReport(data);
    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    } else {
      setResult(response.data);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="playerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Player Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Erling Haaland" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Report
        </Button>
        {result && (
          <ResultCard title="Player Report" content={result.report} />
        )}
      </form>
    </Form>
  );
}

function ResultCard({ title, content }: { title: string; content: string }) {
  // A simple markdown-like renderer for bold text and newlines
  const renderContent = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index} className="block">
        {line.split('**').map((part, partIndex) =>
          partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
        )}
      </span>
    ));
  };

  return (
    <Card className="bg-muted/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
          {renderContent(content)}
        </div>
      </CardContent>
    </Card>
  );
}
