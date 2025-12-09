import { Button } from '@/components/Button/Button';
import Image from 'next/image';
import React from 'react'

const MyOrderComponent = () => {
    return (
        <>
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900">My Orders</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              No order yet, start your auto explore journey and many more.
            </p>
          </div>
    
          <div className="flex-1 flex items-center justify-center px-4 sm:px-10 py-8 sm:py-10">
            <div className="text-center max-w-md mx-auto">
              <div className="mx-auto h-40 w-40 sm:h-52 sm:w-52 relative">
                <Image
                  src="/NotFound.webp"
                  alt="No orders illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h2 className="text-base font-semibold text-slate-900 mb-1">No Orders Found</h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-5">
                No order yet, start your auto explore journey and many more.
              </p>
              <Button
                href="/"
                variant="primary"
                className="px-6 py-2.5 rounded-full text-sm font-semibold"
              >
                Browse Vehicles
              </Button>
            </div>
          </div>
        </>
      );
}

export default MyOrderComponent;