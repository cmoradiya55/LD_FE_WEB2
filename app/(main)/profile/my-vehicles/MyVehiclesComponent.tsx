import React from 'react'

const MyVehiclesComponent = () => {
    return (
        <>
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900">My Vehicles</h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    Manage the vehicles you own or have listed for sale.
                </p>
            </div>
            <div className="flex-1 flex items-center justify-center px-4 sm:px-10 py-8 sm:py-10">
                <p className="text-xs sm:text-sm text-slate-500">You don't have any vehicles added yet.</p>
            </div>
        </>
    )
}

export default MyVehiclesComponent;