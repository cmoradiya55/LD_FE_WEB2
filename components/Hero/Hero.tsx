'use client';

const Hero = () => {
    return (
        <div className="mt-4 rounded-3xl bg-gradient-to-br from-white via-primary-50/60 to-blue-50 px-5 py-7 text-center shadow-[0_18px_45px_rgba(15,23,42,0.08)] border border-white">
            <p className="pill mx-auto mb-3 w-fit text-xs">Trusted marketplace</p>
            <h1 className="text-[1.9rem] md:text-4xl font-bold mb-3 leading-tight text-slate-900">
                <span className="text-gradient">Find your next ride</span> from verified sellers
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                Explore curated inventory backed by inspection reports, transparent history, and instant booking support.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-sm">
                {[
                    { label: 'Active listings', value: '1,250+' },
                    { label: 'Verified inspections', value: '4,800+' },
                    { label: 'Buyer satisfaction', value: '4.9/5' },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white bg-white/80 p-4 shadow-inner">
                        <p className="text-slate-500 text-sm">{stat.label}</p>
                        <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hero;
