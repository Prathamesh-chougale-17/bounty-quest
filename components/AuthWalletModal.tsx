'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import { useMemo, useEffect } from 'react';
import Image from 'next/image';

export function WalletModal() {
    const { wallets, select, connected } = useWallet();

    useEffect(() => {
        const mainContent = document.querySelector('main');
        if (!connected && mainContent) {
            mainContent.classList.add('blur-sm');
        } else if (mainContent) {
            mainContent.classList.remove('blur-sm');
        }
    }, [connected]);

    const [listedWallets] = useMemo(() => {
        const installed = wallets.filter(
            wallet => wallet.readyState === WalletReadyState.Installed
        );
        const notInstalled = wallets.filter(
            wallet => wallet.readyState !== WalletReadyState.Installed
        );
        return installed.length ? [installed, notInstalled] : [notInstalled, []];
    }, [wallets]);

    return (
        <AlertDialog open={!connected}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Connect a wallet on Solana to continue
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <div className="grid gap-4">
                    {listedWallets.map((wallet) => (
                        <button
                            key={wallet.adapter.name}
                            onClick={() => select(wallet.adapter.name)}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent"
                        >
                            {wallet.adapter.icon && (
                                <Image
                                    src={wallet.adapter.icon}
                                    alt={wallet.adapter.name}
                                    className="w-8 h-8"
                                    height={32}
                                    width={32}
                                />
                            )}
                            <span>{wallet.adapter.name}</span>
                        </button>
                    ))}
                </div>
            </AlertDialogContent>
            <AlertDialogOverlay className="bg-background/80 backdrop-blur-sm" />
        </AlertDialog>
    );
}
