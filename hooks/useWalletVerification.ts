import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export function useWalletVerification() {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { publicKey } = useWallet();

  useEffect(() => {
    async function checkVerification() {
      //   console.log(publicKey?.toBase58());
      if (!publicKey?.toBase58()) {
        setIsVerified(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publicKey: publicKey.toBase58(),
          }),
        });
        const data = await response.json();
        setIsVerified(data.exists);
      } catch (error) {
        console.error("Error checking verification:", error);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    }

    checkVerification();
  }, [publicKey]);

  return { isVerified, loading };
}
