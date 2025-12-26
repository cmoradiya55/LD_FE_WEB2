import { Button } from '@/components/Button/Button';
import React from 'react'

const ManageConsents = () => {
    return (
        <>
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Manage Consents</h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    Control how we contact you and use your data for better offers.
                </p>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 sm:px-10 py-8 sm:py-10">
                <div className="text-center max-w-md mx-auto">
                    <div className="mx-auto mb-5 h-32 w-32 rounded-full bg-slate-50 flex items-center justify-center">
                        <div className="h-20 w-20 rounded-2xl bg-slate-100" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-900 mb-1">No Consents Found</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mb-5">
                        You have not configured any additional communication preferences yet.
                    </p>
                    <Button
                        href="/"
                        variant="primary"
                        className="px-6 py-2.5 rounded-full text-sm font-semibold"
                    >
                        Manage Consents
                    </Button>
                </div>
            </div>
        </>
    );
}

export default ManageConsents;