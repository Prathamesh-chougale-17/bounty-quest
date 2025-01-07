"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Clock, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Task } from "@/types/challenge";
import TwitterSubmissionForm from "@/components/TwitterSubmissionForm";
import { XWalletMapper } from "@/components/XWalletMapper";
import { useWalletVerification } from "@/hooks/useWalletVerification";

const TaskById = ({ params }: { params: { id: string } }) => {
  const { isVerified, loading: verificationLoading } = useWalletVerification();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/active/${params.id}`);
        if (!response.ok) throw new Error("Task not found");
        const data = await response.json();
        setTask(data.task);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch task");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [params.id]);

  useEffect(() => {
    if (!task) return;

    const timer = setInterval(() => {
      const endTime = new Date(task.endTime).getTime();
      const now = new Date().getTime();
      const timeLeft = endTime - now;

      setTimeLeft({
        hours: Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((timeLeft % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [task]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6">
        <Card className="max-w-4xl mx-auto mt-8 border-red-200 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <p className="text-red-500 text-lg font-medium">
                {error || "Task not found"}
              </p>
              <Link href="/">
                <Button variant="outline" className="hover:bg-red-50">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    if (verificationLoading) {
      return (
        <div className="animate-pulse">Loading verification status...</div>
      );
    }

    if (!isVerified) {
      return (
        <Card className="border border-purple-100 dark:border-purple-900 shadow-xl bg-white/80 dark:bg-gray-800/90">
          <CardContent className="p-8">
            <div className="mb-4 text-center text-red-500">
              Please verify your wallet before participating
            </div>
            <XWalletMapper />
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        <Card className="border border-purple-100 dark:border-purple-900 shadow-xl bg-white/80 dark:bg-gray-800/90">
          <CardContent className="p-8">
            <TwitterSubmissionForm task={task} />
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <Link href="/">
          <Button
            variant="outline"
            className="mb-6 hover:bg-white/90 shadow-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-purple-100 dark:border-purple-900 shadow-xl">
            <CardHeader className="space-y-4 p-8">
              <div className="space-y-2">
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {task.title}
                </CardTitle>
                <CardDescription className="text-xl font-medium text-gray-600 dark:text-gray-300">
                  {task.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 p-8 pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex items-center space-x-3 bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-xl text-green-700 dark:text-green-300">
                    {task.rewards.usdcAmount} USDC
                  </span>
                </div>

                <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-xl text-blue-700 dark:text-blue-300">
                    {timeLeft
                      ? `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
                      : "Calculating..."}
                  </span>
                </div>
              </div>

              <div className="bg-purple-50/50 dark:bg-gray-800/50 rounded-xl p-6 shadow-inner">
                <h3 className="font-bold text-xl mb-6 text-purple-900 dark:text-purple-100">
                  Task Requirements
                </h3>
                <ul className="space-y-4">
                  {task.requirements?.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 text-gray-700 dark:text-gray-200"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-lg">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default TaskById;
