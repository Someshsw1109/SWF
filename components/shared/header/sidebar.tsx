import * as React from 'react'
import Link from 'next/link'
import { X, ChevronRight, UserCircle, MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignOut } from '@/lib/actions/user.actions' // Assuming this path is correct
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    // DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import { auth } from '@/auth' // Assuming this path is correct

export default async function Sidebar({
    categories,
}: {
    categories: string[]
}) {
    const session = await auth()

    return (
        <Drawer direction='left'>
            {/* The trigger button remains the same */}
            <DrawerTrigger className='header-button flex items-center !p-2'>
                <MenuIcon className='h-5 w-5 mr-1' />
                All
            </DrawerTrigger>

            {/* Apply background color to DrawerContent to prevent transparency */}
            <DrawerContent className='w-[350px] mt-0 top-0 h-full  bg-violet-600 flex flex-col'>
                {/* User Sign In Section - No changes needed here, but ensuring it's within the structure */}
                <div className='dark bg-gray-800 text-white flex items-center justify-between'> {/* Using text-white for better contrast on dark bg */}
                    <DrawerHeader>
                        <DrawerTitle className='flex items-center'>
                            <UserCircle className='h-6 w-6 mr-2' />
                            {session ? (
                                <DrawerClose asChild>
                                    <Link href='/account'>
                                        <span className='text-lg font-semibold'>
                                            Hello, {session.user.name}
                                        </span>
                                    </Link>
                                </DrawerClose>
                            ) : (
                                <DrawerClose asChild>
                                    <Link href='/sign-in'>
                                        <span className='text-lg font-semibold'>
                                            Hello, sign in
                                        </span>
                                    </Link>
                                </DrawerClose>
                            )}
                        </DrawerTitle>
                        {/* DrawerDescription is optional, can be removed if empty */}
                        {/* <DrawerDescription></DrawerDescription> */}
                    </DrawerHeader>
                    <DrawerClose asChild>
                        <Button variant='ghost' size='icon' className='mr-2 text-white hover:bg-gray-700'> {/* Ensure icon is visible */}
                            <X className='h-5 w-5' />
                            <span className='sr-only'>Close</span>
                        </Button>
                    </DrawerClose>
                </div>

                {/* Shop By Category - Make this section scrollable if content overflows */}
                <div className='flex-1 overflow-y-auto'>
                    <div className='p-4 border-b border-violet-400'>
                        <h2 className='text-lg font-semibold'>Shop By Department</h2>
                    </div>
                    <nav className='flex flex-col'>
                        {/* Use a consistent hover/focus style for links */}
                        {categories.map((category) => (
                            <DrawerClose asChild key={category}>
                                <Link
                                    href={`/search?category=${category}`}
                                    className={`flex items-center justify-between p-4 hover:bg-accent focus:outline-none focus:bg-accent`} // Added padding and hover/focus styles
                                >
                                    <span>{category}</span>
                                    <ChevronRight className='h-4 w-4' />
                                </Link>
                            </DrawerClose>
                        ))}
                    </nav>
                </div>

                {/* Setting and Help - Keep this section at the bottom */}
                <div className='border-t'>
                    <div className='p-4'>
                        <h2 className='text-lg font-semibold'>Help & Settings</h2>
                    </div>
                    {/* Apply consistent styling to these links as well */}
                    <DrawerClose asChild>
                        <Link href='/account' className='flex items-center p-4 hover:bg-accent focus:outline-none focus:bg-accent'>
                            Your account
                        </Link>
                    </DrawerClose>
                    <DrawerClose asChild>
                        <Link href='/page/customer-service' className='flex items-center p-4 hover:bg-accent focus:outline-none focus:bg-accent'>
                            Customer Service
                        </Link>
                    </DrawerClose>
                    {session ? (
                        <form action={SignOut} className='w-full'>
                             {/* Ensure the button inside the form also closes the drawer if needed, although action might handle redirect */}
                             <DrawerClose asChild>
                                <Button
                                    type="submit" // Explicitly set type submit for forms
                                    className='w-full justify-start p-4 h-auto text-base font-normal hover:bg-accent focus:outline-none focus:bg-accent' // Adjusted styles
                                    variant='ghost'
                                >
                                    Sign out
                                </Button>
                            </DrawerClose>
                        </form>
                    ) : (
                         <DrawerClose asChild>
                            <Link href='/sign-in' className='flex items-center p-4 hover:bg-accent focus:outline-none focus:bg-accent'>
                                Sign in
                            </Link>
                        </DrawerClose>
                    )}
                </div>
            {/* </DrawerContent> contains the entire sidebar structure */}
            </DrawerContent>
        </Drawer>
    )
}