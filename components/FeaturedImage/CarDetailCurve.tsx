'use client';

interface CarDetailCurveProps {
    className?: string;
}

const linearStart = 'var(--car-curve-linear-start, #ffffff)';
const linearMid1 = 'var(--car-curve-linear-mid-1, #f0f9ff)';
const linearMid2 = 'var(--car-curve-linear-mid-2, #e0f2fe)';
const linearEnd = 'var(--car-curve-linear-end, #bae6fd)';
const strokeInner = 'var(--car-curve-stroke-inner, #bae6fd)';
const strokeOuter = 'var(--car-curve-stroke-outer, #7dd3fc)';

const CarDetailCurve = ({ className }: CarDetailCurveProps) => (
    <svg
        className={`w-full ${className}`}
        width="687"
        height="120"
        viewBox="0 0 687 163"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
    >
        <path
            d="M0.125678 1.38764L-0.954167 1.24416V2.3335V307.667V308.621H0H687H687.954V307.667V2.3335V1.23955L686.87 1.38818C419.383 38.0701 269.882 37.2309 0.125678 1.38764Z"
            fill="url(#paint0_linear_9151_436084)"
            stroke="url(#paint1_radial_9151_436084)"
            strokeWidth="0.5"
        />
        <defs>
            <linearGradient id="paint0_linear_9151_436084" x1="0" y1="0" x2="0" y2="163" gradientUnits="userSpaceOnUse">
                <stop offset="0" style={{ stopColor: linearStart }} />
                <stop offset="0.3" style={{ stopColor: linearMid1 }} />
                <stop offset="0.6" style={{ stopColor: linearMid2 }} />
                <stop offset="1" style={{ stopColor: linearEnd }} />
            </linearGradient>
            <radialGradient
                id="paint1_radial_9151_436084"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(343.5 39.546) rotate(-5.90614) scale(306.004 688.508)"
            >
                <stop style={{ stopColor: strokeInner }} />
                <stop offset="1" style={{ stopColor: strokeOuter }} />
            </radialGradient>
        </defs>
    </svg>
);

export default CarDetailCurve;

