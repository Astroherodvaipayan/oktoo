import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOkto } from 'okto-sdk-react';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getWindowDimensions } from '../../dash/_components/send-tokens';
import { useAuthenticationStore } from '@/modules/authenticated/auth-store';

export function AuthDialog({
  open,
  onClose,
  emojis,
}: {
  open: boolean;
  onClose: (createdUserButAlreadyCreatedEmojis?: boolean) => void;
  emojis: string;
}) {
  const { authenticate, getUserDetails, createWallet } = useOkto();
  const { saveWalletsInformation, saveGoogleIdToken } = useAuthenticationStore();
  const [finishLogin, setFinishLogin] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return () => {};
    } else {
      setWindowDimensions(getWindowDimensions());
    }
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isHydrated]);

  const handleGoogleLogin = async (credentialResponse) => {
    console.log('Google login response:', credentialResponse);
    setIsLoading(true);
    const idToken = credentialResponse.credential;
    saveGoogleIdToken(idToken);
    authenticate(idToken, async (authResponse, error) => {
      setIsLoading(false);
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

  useEffect(() => {
    if (finishLogin) {
      tryCreateNewUser();
    }
  }, [finishLogin]);

  const router = useRouter();
  const { saveInformation } = useAuthenticationStore();
  const tryCreateNewUser = async () => {
    let oktoUserId;
    let createdUserButAlreadyCreatedEmojis = false;
    try {
      const details = await getUserDetails();
      const { email, created_at, freeze_reason, freezed, user_id } = details;
      oktoUserId = user_id;
      const userExists = await checkIfUserExists(user_id);
      if (userExists.exists) {
        saveInformation(userExists.userData);
        saveWalletsInformation(userExists.userData.wallets);
        //userExists.userData.oktoUserId === oktoUserId
        if (!emojis && !userExists?.userData?.emojis) {
          router.push('/create');
          onClose();
        } else {
          router.push('/dash');
        }
        return;
      }

      createdUserButAlreadyCreatedEmojis = userExists.exists && userExists.userData.oktoUserId !== oktoUserId;
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          googleClientID: finishLogin.googleClientID,
          oktoUserId,
          oktoAccountCreatedAt: created_at,
          oktoAccountFreezed: freezed,
          oktoFreezeReason: freeze_reason,
          emojis: createdUserButAlreadyCreatedEmojis ? '' : emojis,
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
        return;
      } else {
        const userData = await response.json();
        if (!userData?.data?.id) {
          toast.error('Error creating user', {
            duration: 5000,
          });
          return;
        }
        saveInformation(userData.data);
      }
    } catch (error) {
      toast.error('Error creating user', {
        duration: 5000,
        description: `Failed to fetch user details or create user ${error.message}`,
      });
      return;
    }
    try {
      const walletsData = await createWallet();
      const walletResponse = await fetch('/api/wallet', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: walletsData.wallets,
          oktoUserId,
        }),
      });
      if (!walletResponse.ok) {
        const errorResponse = await walletResponse.json();
        toast.error('Error saving wallets', {
          duration: 5000,
          description: `Failed to save wallets ${errorResponse.message}`,
        });
        return;
      } else {
        const data = await walletResponse.json();
        console.log('Wallets saved successfully:', data);
        console.log('Wallets saved successfully:', data);
        console.log('Wallets saved successfully:', data);
        saveWalletsInformation(data.data);
      }
    } catch (error) {
      console.log({ error });
      toast.error('Error saving wallets', {
        duration: 5000,
        description: `Failed to save wallets ${error.message}`,
      });
      return;
    }
    if (!emojis) {
      router.push('/create');
    }

    onClose(createdUserButAlreadyCreatedEmojis);

    console.log('User created successfully');
    toast.success('User created successfully', {
      duration: 5000,
    });
  };

  const InnerLoginContent = (
    <div
      className="grid gap-4 pb-4 justify-center align-center items-center mt-4"
      onClick={() => {
        setIsLoading(true);
      }}
    >
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        type="standard"
        onError={() => console.log('Login Failed')}
        useOneTap={false}
        promptMomentNotification={(notification) => console.log('Prompt moment notification:', notification)}
      />
      {isLoading && <div className="text-center">Authenticating your account...</div>}
    </div>
  );

  if (!isHydrated) {
    return null;
  }

  // which is tailwind "lg"
  if (windowDimensions.width < 1024) {
    return (
      <Sheet
        open={open}
        onOpenChange={(value: boolean) => {
          if (!value) onClose();
        }}
      >
        <SheetContent side="bottom" className=" font-sans">
          <SheetHeader>
            <img className="w-28 h-28 self-center" src="/logo.webp" />
            <h1 className="mb-1.5 text-2xl text-zinc-100 text-center">emoji pay</h1>
            <SheetTitle>Authentication required</SheetTitle>
            <SheetDescription className="text-zinc-400">Before continuing, please authenticate.</SheetDescription>
          </SheetHeader>
          {InnerLoginContent}
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(value: boolean) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px] font-sans">
        <DialogHeader>
          <img className="w-28 h-28 self-center" src="/logo.webp" />
          <h1 className="mb-1.5 text-2xl text-zinc-100 text-center">emoji pay</h1>
          <DialogTitle>Authentication required</DialogTitle>
          <DialogDescription className="text-zinc-400">Before continuing, please authenticate.</DialogDescription>
        </DialogHeader>
        {InnerLoginContent}
      </DialogContent>
    </Dialog>
  );
}
