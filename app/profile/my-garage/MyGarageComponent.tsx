import React from 'react'

const MyGarageComponent = () => {
    return (
        <>
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900">My Garage</h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    Keep all your vehicles and preferences organised in one place.
                </p>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 sm:px-10 py-8 sm:py-10">
                <p className="text-xs sm:text-sm text-slate-500">Your garage is currently empty.</p>
            </div>
        </>
    );
}

export default MyGarageComponent