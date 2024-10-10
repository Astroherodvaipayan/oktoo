import React, { useState } from 'react';
import BlurFade from '@/components/ui/blur-fade';
import { NeonGradientCard } from '@/components/ui/neon-gradient-card';
import confetti from 'canvas-confetti';
import { useAuthenticationStore } from '@/utils/auth-store';
import { AuthDialog } from './authenticate-dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function ConfettiEmoji({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  const handleClick = () => {
    if (loading) {
      return null;
    }
    const scalar = 2;
    const logo = confetti.shapeFromText({ text: '🙂‍↔️', scalar });

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: [logo],
      scalar,
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 30,
      });

      confetti({
        ...defaults,
        particleCount: 5,
      });

      confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
        shapes: ['circle'],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
    onClick();
  };

  return (
    <BlurFade delay={0} className="rounded-full">
      <div className="relative justify-center cursor-pointer w-full mt-4 rounded-full" onClick={handleClick}>
        <NeonGradientCard className="w-full" borderRadius={100}>
          <span className="text-xl">{loading ? 'Claiming...' : 'Claim now!'}</span>
        </NeonGradientCard>
      </div>
    </BlurFade>
  );
}

const ClaimButton = ({ emojis }: { emojis: string }) => {
  const [authOpen, setAuthOpen] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [claimErrorReason, setClaimErrorReason] = useState('');
  const { user, saveInformation } = useAuthenticationStore();
  const router = useRouter();
  console.log({ user });
  console.log({ user });
  return (
    <>
      <AuthDialog
        emojis={emojis}
        onClose={(createdUserButAlreadyCreatedEmojis) => {
          setAuthOpen(false);
          if (createdUserButAlreadyCreatedEmojis) {
            setClaimErrorReason('Emojis already claimed! Try with other ones...');
          }
        }}
        open={authOpen}
      />
      <div className="rounded-full">
        <ConfettiEmoji
          onClick={async () => {
            setClaimErrorReason('');
            if (!user) {
              setAuthOpen(true);
              return;
            }
            if (user.emojis) {
              const toastId = toast.loading('Redirecting to your profile...', {
                duration: 900000,
              });
              // to keep the animation...
              setTimeout(() => {
                router.push('/dash');
                toast.dismiss(toastId);
              }, 1000);
              return;
            }
            setUpdatingUser(true);
            const toastId = toast.loading('Assigning your emojis...', {
              duration: 900000,
            });
            try {
              const response = await fetch('/api/emoji', {
                method: 'PATCH',
                body: JSON.stringify({
                  emojis,
                  oktoUserId: user.oktoUserId,
                }),
              });
              const errorResponse = await response.json();
              let errorText = '';
              if (!response.ok) {
                errorText = 'Error creating user, contact support.';
              }
              if (errorResponse.status === 400) {
                errorText = 'Invalid input';
              } else if (errorResponse.status === 409) {
                errorText = 'User with Emojis already exists';
              } else if (errorResponse.status === 500) {
                errorText = 'Internal server error during user creation';
              }
              if (errorText) {
                toast.dismiss(toastId);
                setClaimErrorReason(errorText);
                toast.error('Error assigning emojis', {
                  duration: 5000,
                  description: errorText,
                });
                return;
              }
              saveInformation({ ...user, emojis });
              router.push('/dash');
              console.log('User created successfully');
              toast.success('Emojis claimed!', {
                duration: 5000,
              });

              toast.dismiss(toastId);
            } catch (error) {
              console.log({ error });
            } finally {
              setUpdatingUser(false);
            }
          }}
          loading={updatingUser}
        />
        {!!claimErrorReason && <span className="text-red-500">{claimErrorReason}</span>}
      </div>
    </>
  );
};
export default ClaimButton;
