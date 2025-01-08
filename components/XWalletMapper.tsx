"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWallet } from "@solana/wallet-adapter-react";
import SampleTweet from "./SampleTweet";

const tweetFormSchema = z.object({
  tweetUrl: z
    .string()
    .min(1, "Tweet URL is required")
    .regex(
      /^https?:\/\/x\.com\/.+\/status\/.+$/,
      "Please enter a valid Twitter URL"
    ),
});

type FormData = z.infer<typeof tweetFormSchema>;

export function XWalletMapper() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(tweetFormSchema),
  });
  const { toast } = useToast();
  const walletAddress = useWallet().publicKey?.toBase58();

  const onSubmit = async (data: FormData) => {
    if (!walletAddress) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/tweet/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tweetUrl: data.tweetUrl,
          publicKey: walletAddress,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error);
      }

      toast({
        title: "Success",
        description: "Your wallet has been verified successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Verification failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Verify Your Wallet on Twitter</CardTitle>
          <CardDescription>
            Follow these steps to verify your wallet ownership
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <ol className="list-decimal pl-4 space-y-2">
                <li>
                  Copy your wallet address:{" "}
                  <code className="bg-muted p-1 rounded">{walletAddress}</code>
                </li>
                <li>Post a tweet containing your wallet address</li>
                <li>Copy the tweet URL and paste it below</li>
                <li>Submit the form for verification</li>
              </ol>
            </AlertDescription>
          </Alert>

          <div className="my-4">
            <p className="text-sm text-gray-500 mb-2">Example tweet:</p>
            <SampleTweet
              avatar="/phantom.png"
              name="Crypto Enthusiast"
              handle="cryptolover"
              content={`Verifying my wallet address for @YourProject:\n\n${
                walletAddress || "Your wallet address will appear here"
              }`}
              timestamp="Just now"
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register("tweetUrl")}
              placeholder="https://x.com/user/status/123..."
            />
            {errors.tweetUrl && (
              <p className="text-sm text-red-500">{errors.tweetUrl.message}</p>
            )}
            <Button type="submit" className="w-full">
              Submit for Verification
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
