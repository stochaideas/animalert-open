import type {
  ClerkProviderProps,
  SignInButtonProps,
  UserButtonProps,
} from "@clerk/nextjs";
import type {
  AuthenticateWithRedirectCallbackProps,
  UserProfileProps,
} from "@clerk/nextjs";
import * as Clerk from "@clerk/nextjs";
import React from "react";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

type ChildrenProps = { children?: React.ReactNode };

type UseUserFallback = {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: null;
};

type UseSignInFallback = {
  isLoaded: boolean;
  signIn: {
    create: (...args: unknown[]) => Promise<unknown>;
    authenticateWithRedirect: (...args: unknown[]) => Promise<void>;
  };
  setActive: (...args: unknown[]) => Promise<void>;
};

type UseSignUpFallback = {
  isLoaded: boolean;
  signUp: {
    create: (...args: unknown[]) => Promise<unknown>;
    prepareEmailAddressVerification: (...args: unknown[]) => Promise<void>;
  };
  setActive: (...args: unknown[]) => Promise<void>;
};

export const ClerkProvider = clerkEnabled
  ? Clerk.ClerkProvider
  : ({ children }: ClerkProviderProps) => <>{children}</>;

export const SignedIn = clerkEnabled
  ? Clerk.SignedIn
  : (_props: ChildrenProps) => null;

export const SignedOut = clerkEnabled
  ? Clerk.SignedOut
  : ({ children }: ChildrenProps) => <>{children}</>;

export const UserButton = clerkEnabled
  ? Clerk.UserButton
  : (_props: UserButtonProps) => null;

export const SignInButton = clerkEnabled
  ? Clerk.SignInButton
  : ({ children }: SignInButtonProps & ChildrenProps) => <>{children}</>;

export const useUser = clerkEnabled
  ? Clerk.useUser
  : () => ({ isLoaded: true, isSignedIn: false, user: null } satisfies UseUserFallback);

export const useSignIn = clerkEnabled
  ? Clerk.useSignIn
  : () => ({
      isLoaded: false,
      signIn: {
        create: async () => ({ status: "complete", createdSessionId: "" }),
        authenticateWithRedirect: async () => {},
      },
      setActive: async () => {},
    } satisfies UseSignInFallback);

export const useSignUp = clerkEnabled
  ? Clerk.useSignUp
  : () => ({
      isLoaded: false,
      signUp: {
        create: async () => ({}),
        prepareEmailAddressVerification: async () => {},
      },
      setActive: async () => {},
    } satisfies UseSignUpFallback);

export const AuthenticateWithRedirectCallback = clerkEnabled
  ? Clerk.AuthenticateWithRedirectCallback
  : (_props: AuthenticateWithRedirectCallbackProps) => null;

export const UserProfile = clerkEnabled
  ? Clerk.UserProfile
  : (_props: UserProfileProps) => <div />;
