"use client"

import { ArrowRightIcon } from 'lucide-react';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

function Header() {
  return (
    <nav className='fixed top-0 inset-x-0 z-50 flex items-center justify-between px-10 py-3 border-b border-white/7 backdrop-blur-xl'>
        {/* Logo */}
        <Link  href={"/"}>
            <Image src="/logo.png" alt="Prept Logo" width={100} height={100} className='w-auto h-11' />
        </Link>

        {/* Nav links (signed-in) */}
        <Show when="signed-in">
          <div className='hidden md:flex items-center gap-8 text-sm'>
            <Link href="/explore" className='text-stone-300 hover:text-amber-400 transition'>Explore</Link>
            <Link href="/dashboard" className='text-stone-300 hover:text-amber-400 transition'>Dashboard</Link>
          </div>
        </Show>

        {/* Sign in / Sign up */}
        <div className='flex items-center gap-3'>
            <Show when="signed-out">
              {/* Link */}



              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="border border-white/25 bg-white/5 text-white shadow-sm backdrop-blur-sm hover:bg-white/12 hover:text-white hover:border-white/40 focus-visible:border-white/50 focus-visible:ring-white/25 dark:hover:bg-white/10"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode='modal'>
                <Button variant="gold">
                    Get Started <ArrowRightIcon className='size-4' />
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
        </div>
    </nav>
  )
}

export default Header;