'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
    const { connected, publicKey, disconnect } = useWallet();
    const { toast } = useToast();
    const { setVisible } = useWalletModal();

    const shortAddress = publicKey?.toBase58().slice(0, 4) +
        '...' +
        publicKey?.toBase58().slice(-4);

    const copyAddress = () => {
        if (publicKey) {
            navigator.clipboard.writeText(publicKey.toBase58());
            toast({
                description: "Address copied to clipboard",
                duration: 2000,
            });
        }
    };

    if (!connected) {
        return (
            <Button
                variant="default"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold"
                onClick={() => setVisible(true)}
                size={"default"}
            >
                <span className='sm:hidden block'>Connect</span>
                <span className='hidden sm:block'>Connect Wallet</span>

            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{shortAddress}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={copyAddress}>
                    Copy address
                </DropdownMenuItem>
                <DropdownMenuItem onClick={disconnect}>
                    Disconnect
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
