"use client";
import { useState } from "react";
import { Task } from "@/types/challenge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

interface SubmissionResult {
  relevanceScore: number;
  engagementScore: number;
  contentQuality: number;
  overallScore: number;
  feedback: string;
}

interface Props {
  task: Task;
}

export default function TwitterSubmissionForm({ task }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [error, setError] = useState("");
  const { publicKey } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First fetch tweet data
      const tweetResponse = await fetch("/api/tweet/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          taskData: task,
          publicKey: publicKey?.toBase58(),
        }),
      });

      const res = await tweetResponse.json();
      if (!tweetResponse.ok) throw new Error(res.error);

      // Then send for review
      //   const reviewResponse = await fetch("/api/tweet/review", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       data: tweetData.data,
      //       taskId: task._id,
      //       taskData: task,
      //     }),
      //   });

      //   const reviewData = await reviewResponse.json();
      //   if (!reviewResponse.ok) throw new Error(reviewData.error);
      setResult(res.result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 space-y-6 dark:bg-gray-800 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-gray-200">
            Submit your Tweet URL
          </label>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://twitter.com/user/status/123..."
            className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Evaluating...
            </>
          ) : (
            "Submit Tweet"
          )}
        </Button>
      </form>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4 p-4 bg-green-50 dark:bg-green-900/30 rounded">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <h3 className="font-medium">Submission Results</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium dark:text-gray-200">
                Relevance Score
              </p>
              <p className="text-2xl dark:text-gray-100">
                {result.relevanceScore}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium dark:text-gray-200">
                Engagement Score
              </p>
              <p className="text-2xl dark:text-gray-100">
                {result.engagementScore}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium dark:text-gray-200">
                Content Quality
              </p>
              <p className="text-2xl dark:text-gray-100">
                {result.contentQuality}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium dark:text-gray-200">
                Overall Score
              </p>
              <p className="text-2xl dark:text-gray-100">
                {result.overallScore}%
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded">
            <p className="text-sm font-medium dark:text-gray-200">Feedback</p>
            <p className="text-gray-600 dark:text-gray-300">
              {result.feedback}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
