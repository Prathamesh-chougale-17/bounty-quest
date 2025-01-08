use anchor_lang::prelude::*;

declare_id!("BhxmdcE5m32ueHTXuR21Kn6NmrqUPEqmTv4MF4vGkS9Y");

#[program]
pub mod solana_send_sol {
    use super::*;

    pub fn send_sol(ctx: Context<SendSol>, amount: u64) -> Result<()> {
        let sender = &ctx.accounts.sender; // Sender account
        let recipient = &ctx.accounts.recipient; // Recipient account

        // Ensure the sender has enough balance
        if sender.lamports() < amount {
            return Err(ErrorCode::InsufficientFunds.into());
        }

        // Transfer lamports from sender to recipient
        **sender.try_borrow_mut_lamports()? -= amount;
        **recipient.try_borrow_mut_lamports()? += amount;

        msg!(
            "Transferred {} lamports from {} to {}",
            amount,
            sender.key(),
            recipient.key()
        );
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SendSol<'info> {
    /// CHECK: This is the account that will pay the lamports
    #[account(mut, signer)] // Sender must be a signer
    pub sender: AccountInfo<'info>,

    /// CHECK: This is the account that will receive the lamports
    #[account(mut)] // Recipient's balance will be modified
    pub recipient: AccountInfo<'info>,

    pub system_program: Program<'info, System>, // System program for SOL transfers
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds in the sender account.")]
    InsufficientFunds,
}
