import SignInForm from '@/components/forms/SignInForm';
import MuiLink from '@/components/ui/MuiLink';
import WelcomePageContainer from '@/components/ui/containers/WelcomePageContainer';
import Link from 'next/link';

export default function SignIn() {
  return (
    <WelcomePageContainer>
      <SignInForm>
        <Link href={'/welcome/sign-up'}>
          <MuiLink>Don&apos;t have an account? Sign Up</MuiLink>
        </Link>
      </SignInForm>
    </WelcomePageContainer>
  );
}
