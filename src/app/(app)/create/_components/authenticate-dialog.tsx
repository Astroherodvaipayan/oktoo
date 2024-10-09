import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOkto } from 'okto-sdk-react';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuthenticationStore } from '@/utils/auth-store';

export function AuthDialog({ open, onClose, emojis }: { open: boolean; onClose: () => void; emojis: string }) {
  const { authenticate, getUserDetails, createWallet } = useOkto();
  const { saveWalletsInformation } = useAuthenticationStore();
  const [finishLogin, setFinishLogin] = useState<any>(undefined);

  const handleGoogleLogin = async (credentialResponse) => {
    console.log('Google login response:', credentialResponse);
    const idToken = credentialResponse.credential;
    console.log('google idtoken: ', idToken, credentialResponse);
    authenticate(idToken, async (authResponse, error) => {
      if (authResponse) {
        console.log('Authentication check: ', authResponse);
      }

      if (error) {
        console.error('Authentication error:', error);
      } else {
        setFinishLogin({
          googleClientID: credentialResponse.clientId,
        });
      }
    });
  };

  const checkIfUserExists = async (oktoUserId: string) => {
    try {
      const response = await fetch(`/api/user?oktoUserId=${oktoUserId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        let errorText = 'Error checking user existence, contact support.';
        if (errorResponse.status === 400) {
          errorText = 'Invalid input for user existence check';
        } else if (errorResponse.status === 500) {
          errorText = 'Internal server error during user existence check';
        }
        toast.error('Error checking user existence', {
          duration: 5000,
          description: errorText,
        });
        return { exists: !!errorResponse?.data, userData: errorResponse?.data };
      } else {
        const userData = await response.json();
        console.log({ userData });
        console.log({ userData });
        console.log({ userData });
        return { exists: !!userData?.data, userData: userData?.data };
      }
    } catch (error) {
      toast.error('Error checking user existence', {
        duration: 5000,
        description: `Failed to check user existence ${error.message}`,
      });
      return { exists: false, userData: undefined };
    }
  };

  // had to take this approach as the callback of "authenticate"
  // was causing to not have getUserDetails on time
  // having it undefined.
  useEffect(() => {
    if (finishLogin) {
      tryCreateNewUser();
    }
  }, [finishLogin]);

  const router = useRouter();
  const { saveInformation } = useAuthenticationStore();
  const tryCreateNewUser = async () => {
    try {
      const details = await getUserDetails();
      const walletsData = await createWallet();
      saveWalletsInformation(walletsData.wallets);
      const { email, created_at, freeze_reason, freezed, user_id } = details;
      const userExists = await checkIfUserExists(user_id);
      if (userExists.exists) {
        if (!emojis && !userExists?.userData?.emojis) {
          router.push('/create');
          onClose();
        } else {
          router.push('/dash');
        }
        return;
      }
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          googleClientID: finishLogin.googleClientID,
          oktoUserId: user_id,
          oktoAccountCreatedAt: created_at,
          oktoAccountFreezed: freezed,
          oktoFreezeReason: freeze_reason,
          emojis,
        }),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        let errorText = 'Error creating user, contact support.';
        if (errorResponse.status === 400) {
          errorText = 'Invalid input for user creation';
        } else if (errorResponse.status === 409) {
          errorText = 'User already exists';
        } else if (errorResponse.status === 500) {
          errorText = 'Internal server error during user creation';
        }
        toast.error('Error creating user', {
          duration: 5000,
          description: errorText,
        });
      } else {
        const userData = await response.json();
        console.log(userData.data);
        saveInformation(userData.data);
        if (!emojis) {
          router.push('/create');
        }
        console.log('User created successfully');
        toast.success('User created successfully', {
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error('Error creating user', {
        duration: 5000,
        description: `Failed to fetch user details or create user ${error.message}`,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value: boolean) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px] font-sans">
        <DialogHeader>
          <h1 className="text-8xl text-center">🙂‍↔️</h1>
          <h1 className="mb-1.5 text-2xl text-zinc-100 text-center">emoji pay</h1>
          <DialogTitle>Authentication required</DialogTitle>
          <DialogDescription className="text-zinc-400">Before continuing, please authenticate.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 pb-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log('Login Failed')}
            useOneTap={false}
            promptMomentNotification={(notification) => console.log('Prompt moment notification:', notification)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
