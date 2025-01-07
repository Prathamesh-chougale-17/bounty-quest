"use client";
import { useState } from "react";
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

export function XWalletMapper() {
  const [tweetUrl, setTweetUrl] = useState("");
  const { toast } = useToast();
  const walletAddress = useWallet().publicKey?.toBase58();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          tweetUrl,
          publicKey: walletAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Enter your tweet URL"
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Submit for Verification
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
