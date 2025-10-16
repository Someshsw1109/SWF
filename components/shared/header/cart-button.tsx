'use client'

import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import useIsMounted from '@/hooks/use-is-mounted'
import { cn } from '@/lib/utils'
import useCartStore from '@/hooks/use-cart-store'
import useCartSidebar from '@/hooks/use-cart-sidebar'

export default function CartButton() {
    const isMounted = useIsMounted()
    const {
        cart: { items },
    } = useCartStore()
    const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0)
    const isCartSidebarOpen = useCartSidebar()
    return (
        <Link href='/cart' className='px-1 header-button'>
            <div className='flex items-end text-xs relative'>
                <ShoppingCartIcon className='h-8 w-8' />

                {isMounted && cartItemsCount > 0 && (
                    <span
                        className={cn(
                            `bg-primary text-primary-foreground rounded-full text-xs font-bold absolute -right-1 -top-1 px-2 py-1`,
                            cartItemsCount >= 10 && 'px-1'
                        )}
                    >
                        {cartItemsCount}
                    </span>
                )}
                <span className='font-bold'>Cart</span>
                {
                    isCartSidebarOpen && (
                        <div
                            className={`absolute top-[20px] right-[-16px] rotate-[-90deg] z-10 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-transparent border-b-background`}
                        ></div>
                    )
                }
            </div>
        </Link>
    )
}