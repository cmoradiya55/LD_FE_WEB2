export type DetailOptionIcon = 'sparkles';

export interface DetailOptionData {
    label: string;
    images: string[];
    icon?: DetailOptionIcon;
    isActive?: boolean;
}

export interface FeatureCategory {
    key: string;
    title: string;
    features: string[];
}

export interface FeatureListItem {
    key: string;
    name: string;
    value?: string | number | boolean | null;
}

export interface SpecSectionRow {
    label: string;
    value: string;
}

export interface SpecSection {
    key: string;
    title: string;
    rows: SpecSectionRow[];
}

// Shared enums for filters and listings
export enum UsedCarSortOption {
    NEWEST = 2,
    PRICE_LOW_TO_HIGH = 3,
    PRICE_HIGH_TO_LOW = 4,
    KM_LOW_TO_HIGH = 5,
    MODEL_NEW_TO_OLD = 6,
}

export enum SafetyRating {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}

export enum FuelType {
    PETROL = 1,
    DIESEL = 2,
    CNG = 3,
    ELECTRIC = 4,
    HYBRID = 5,
}

export enum BodyType {
    SEDAN = 1,
    SUB_COMPACT_SUV = 2,
    SUV = 3,
    HATCHBACK = 4,
    MUV = 5,
    COUPE = 6,
    CONVERTIBLE = 7,
    PICKUP = 8,
    WAGON = 9,
}

export enum TransmissionType {
    MANUAL = 1,
    AUTOMATIC = 2,
}

export enum OwnerType {
    FIRST = 1,
    SECOND = 2,
    THIRD = 3,
    FOURTH = 4,
}

export interface CarData {
    id: string;
    slug?: string;
    name: string;
    year: number;
    price: string;
    final_price?: number | null;
    image: string; // primary image used across the app
    detailOptions: DetailOptionData[];
    fuelType: string;
    transmission: string;
    kmsDriven: string;
    location: string;
    owner: string;
    ownerType?: number | string;
    registrationYear: string;
    registrationNumber?: string;
    insurance: string;
    seats: string;
    rto: string;
    engineDisplacement: string;
    yearOfManufacture: string;
    mileageKmpl?: number;
    displacementCc?: number;
    powerBhp?: number;
    torqueNm?: number;
    numberOfGears?: number;
    seatingCapacity?: number;
    fuelTankCapacityLiters?: number | null;
    featureList?: FeatureListItem[];
    features?: FeatureCategory[];
    emi?: string;
    newCarPrice?: string;
    views?: string;
    badgeType: 'assured' | 'private';
    isWishlisted?: boolean;
}

export interface Bid {
    id: string;
    buyerName: string;
    amount: number;
    status: 'pending' | 'accepted' | 'rejected';
    timestamp: string;
}

// Extended car interface for listings with bids
export interface ListingCar extends Omit<CarData, 'price' | 'views' | 'image'> {
    brand: string;
    model: string;
    variant: string;
    images: string[];
    price: number; // numeric price for calculations
    bids?: Bid[];
    views?: number;
    image: string; // retain original image property for compatibility
}

// Helper function to parse price string to number
const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[₹,\s]/g, '').toLowerCase();
    const lakhMatch = cleaned.match(/([\d.]+)\s*lakh/);
    if (lakhMatch) {
        return parseFloat(lakhMatch[1]) * 100000;
    }
    const croreMatch = cleaned.match(/([\d.]+)\s*crore/);
    if (croreMatch) {
        return parseFloat(croreMatch[1]) * 10000000;
    }
    return parseFloat(cleaned) || 0;
};

// Helper function to extract brand and model from car name
const extractBrandModel = (name: string): { brand: string; model: string; variant: string } => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return {
            brand: parts[0],
            model: parts.slice(1, -1).join(' ') || parts[1],
            variant: parts[parts.length - 1] || '',
        };
    }
    return {
        brand: parts[0] || 'Unknown',
        model: parts.slice(1).join(' ') || 'Unknown',
        variant: '',
    };
};

// Convert CarData to ListingCar
const convertToListingCar = (car: CarData, bids?: Bid[], views?: number): ListingCar => {
    const { brand, model, variant } = extractBrandModel(car.name);
    return {
        ...car,
        brand,
        model,
        variant,
        images: [car.image, ...car.detailOptions.flatMap(opt => opt.images)],
        price: parsePrice(car.price),
        bids,
        views: views ? parseInt(views.toString().replace(/[^0-9]/g, '')) : undefined,
    };
};

export const featureCategories: FeatureCategory[] = [
    {
        key: 'comfort',
        title: 'Comfort & Convenience',
        features: [
            'Power Steering',
            'Air Conditioner',
            'Heater',
            'Adjustable Steering',
            'Height Adjustable Driver Seat',
            'Automatic Climate Control',
            'Remote Trunk Opener',
            'Low Fuel Warning Light',
            'Accessory Power Outlet',
            'Trunk Light',
            'Vanity Mirror',
            'Rear Seat Headrest',
            'Adjustable Headrest',
            'Rear AC Vents',
            'Lumbar Support',
            'Cruise Control',
            'Navigation System',
            'Smart Access Card Entry',
            'Keyless Entry',
            'Engine Start/Stop Button',
            'Cooled Glovebox',
            'Voice Commands',
            'Paddle Shifters',
            'Battery Saver',
            'Lane Change Indicator',
            'Automatic Headlamps',
        ],
    },
    {
        key: 'interior',
        title: 'Interior',
        features: [
            'Tachometer',
            'Electronic Multi-Tripmeter',
            'Fabric Upholstery',
            'Leather Wrapped Steering Wheel',
            'Leather Wrap Gear-Shift Selector',
            'Glove Box',
            'Digital Clock',
            'Digital Odometer',
        ],
    },
    {
        key: 'exterior',
        title: 'Exterior',
        features: [
            'Adjustable Headlamps',
            'Fog Lights - Front',
            'Rear Window Defogger',
            'Alloy Wheels',
            'Outside Rear View Mirror Turn Indicators',
            'Integrated Antenna',
            'Chrome Grille',
            'Projector Headlamps',
            'Cornering Headlamps',
            'Roof Rails',
            'Automatic Headlamps',
            'Sun Roof',
            'LED DRLs',
            'LED Taillights',
            'LED Fog Lamps',
        ],
    },
    {
        key: 'safety',
        title: 'Safety',
        features: [
            'Anti-lock Braking System (ABS)',
            'Central Locking',
            'Power Door Locks',
            'Child Safety Locks',
            'Anti-Theft Alarm',
            'Driver Airbag',
            'Passenger Airbag',
            'Day & Night Rear View Mirror',
            'Passenger Side Rear View Mirror',
            'Rear Seat Belts',
            'Seat Belt Warning',
            'Door Ajar Warning',
            'Side Impact Beams',
            'Front Impact Beams',
            'Adjustable Seats',
            'Tyre Pressure Monitoring System (TPMS)',
            'Vehicle Stability Control System',
            'Engine Immobilizer',
            'Crash Sensor',
            'Centrally Mounted Fuel Tank',
            'Engine Check Warning',
            'EBD',
            'Electronic Stability Control (ESC)',
            'Rear Camera',
            'Anti-Theft Device',
            'Speed Alert',
            'Speed Sensing Auto Door Lock',
            'ISOFIX Child Seat Mounts',
            'Pretensioners & Force Limiter Seatbelts',
            'Hill Assist',
            'Impact Sensing Auto Door Unlock',
        ],
    },
    {
        key: 'entertainment',
        title: 'Entertainment & Communication',
        features: [
            'Radio',
            'Audio System Remote Control',
            'Integrated 2DIN Audio',
            'Wireless Phone Charging',
            'Bluetooth Connectivity',
            'Touchscreen',
            'Android Auto',
            'Apple CarPlay',
        ],
    },
];

export const specSections: SpecSection[] = [
    {
        key: 'engine',
        title: 'Engine & Transmission',
        rows: [
            { label: 'Engine Type', value: 'Kappa 1.0 L Turbo GDi Petrol' },
            { label: 'Displacement', value: '998 cc' },
            { label: 'Max Power', value: '118.35 bhp @ 6000 rpm' },
            { label: 'Max Torque', value: '172 Nm @ 1500–4000 rpm' },
            { label: 'No. of Cylinders', value: '3' },
            { label: 'Valves Per Cylinder', value: '4' },
            { label: 'Fuel Supply System', value: 'GDi' },
            { label: 'Turbo Charger', value: 'Yes' },
            { label: 'Transmission Type', value: 'Automatic' },
            { label: 'Gearbox', value: '7-Speed DCT' },
            { label: 'Drive Type', value: 'FWD' },
        ],
    },
    {
        key: 'fuel',
        title: 'Fuel & Performance',
        rows: [
            { label: 'Fuel Type', value: 'Petrol' },
            { label: 'Petrol Mileage ARAI', value: '18.15 kmpl' },
            { label: 'Petrol Highway Mileage', value: '16.72 kmpl' },
            { label: 'Petrol Fuel Tank Capacity', value: '45 Litres' },
            { label: 'Emission Norm Compliance', value: 'BS VI' },
        ],
    },
    {
        key: 'suspension',
        title: 'Suspension, Steering & Brakes',
        rows: [
            { label: 'Front Suspension', value: 'McPherson Strut with Coil Spring' },
            { label: 'Rear Suspension', value: 'Coupled Torsion Beam Axle with Coil Spring' },
            { label: 'Steering Type', value: 'Electric' },
            { label: 'Steering Column', value: 'Tilt' },
            { label: 'Steering Gear Type', value: 'Rack & Pinion' },
            { label: 'Front Brake Type', value: 'Disc' },
            { label: 'Rear Brake Type', value: 'Drum' },
            { label: 'Braking (100–0 kmph)', value: '42.92 m' },
            { label: 'Braking (80–0 kmph)', value: '26.69 m' },
            { label: '0–100 kmph (Tested)', value: '11.24 s' },
            { label: 'City driveability (20–80 kmph)', value: '6.72 s' },
        ],
    },
    {
        key: 'dimensions',
        title: 'Dimensions & Capacity',
        rows: [
            { label: 'Length', value: '3995 mm' },
            { label: 'Width', value: '1770 mm' },
            { label: 'Height', value: '1605 mm' },
            { label: 'Wheel Base', value: '2500 mm' },
            { label: 'Ground Clearance (Laden)', value: '190 mm' },
            { label: 'Kerb Weight', value: '1440 kg' },
            { label: 'No. of Doors', value: '5' },
            { label: 'Seating Capacity', value: '5 Seats' },
        ],
    },
];

export const sampleCars: CarData[] = [
    {
        id: "1",
        name: "Maruti Swift ZXI CNG",
        year: 2023,
        price: "₹5.57 lakh",
        image: "/car/MarutiSwift/MarutiSwift.png",
        detailOptions: [
            {
                label: 'Exterior',
                images: [
                    '/car/MarutiSwift/Exterior/Exterior1.png',
                    '/car/MarutiSwift/Exterior/Exterior2.png',
                    '/car/MarutiSwift/Exterior/Exterior3.png',
                    '/car/MarutiSwift/Exterior/Exterior4.png',
                    '/car/MarutiSwift/Exterior/Exterior5.png',
                    '/car/MarutiSwift/Exterior/Exterior6.png',
                    '/car/MarutiSwift/Exterior/Exterior7.png',
                    '/car/MarutiSwift/Exterior/Exterior8.png',
                    '/car/MarutiSwift/Exterior/Exterior9.png',
                ],
                isActive: true
            },
            {
                label: 'Interior',
                images: [
                    '/car/MarutiSwift/Interior/Interior1.png',
                    '/car/MarutiSwift/Interior/Interior2.jpeg',
                    '/car/MarutiSwift/Interior/Interior3.jpeg',
                    '/car/MarutiSwift/Interior/Interior4.png',
                    '/car/MarutiSwift/Interior/Interior5.jpeg',
                ],
            },
            // { label: 'Highlights', images: ['/car/car2.png', '/car/car4.png'], icon: 'sparkles' },
            {
                label: 'Tyres',
                images: [
                    '/car/MarutiSwift/Tyres/Tyres1.jpeg',
                    '/car/MarutiSwift/Tyres/Tyres2.jpeg',
                    '/car/MarutiSwift/Tyres/Tyres3.jpeg',
                    '/car/MarutiSwift/Tyres/Tyres4.jpeg',
                    '/car/MarutiSwift/Tyres/Tyres5.jpeg',
                ],
            },
        ],
        fuelType: "CNG",
        transmission: "Manual",
        kmsDriven: "52,519 km",
        location: "G.I.P.C.L., Surat",
        owner: "First Owner",
        registrationYear: "2023",
        insurance: "Valid till Feb 2026",
        seats: "5 Seats",
        rto: "Bardoli",
        engineDisplacement: "1197 cc",
        yearOfManufacture: "2023",
        features: featureCategories,
        emi: "₹18,616 /mo",
        newCarPrice: "₹8.57 Lakh",
        views: "1,100+",
        badgeType: "assured",
    },
    {
        id: "2",
        name: "Hyundai i20 SPORTZ 1.2",
        year: 2011,
        price: "₹2.15 Lakh",
        image: "/car/i20/i20.png",
        detailOptions: [
            { 
                label: 'Exterior',
                images: [
                    '/car/i20/Exterior/Exterior1.jpeg',
                    '/car/i20/Exterior/Exterior2.jpeg',
                    '/car/i20/Exterior/Exterior3.jpeg',
                    '/car/i20/Exterior/Exterior4.jpeg',
                    '/car/i20/Exterior/Exterior5.jpeg',
                    '/car/i20/Exterior/Exterior6.jpeg',
                    '/car/i20/Exterior/Exterior7.jpeg',
                    '/car/i20/Exterior/Exterior8.jpeg',
                    '/car/i20/Exterior/Exterior9.jpeg',
                    '/car/i20/Exterior/Exterior10.jpeg',
                    '/car/i20/Exterior/Exterior11.jpeg',
                    '/car/i20/Exterior/Exterior12.jpeg',
                    '/car/i20/Exterior/Exterior13.jpeg',
                ],
                isActive: true
            },
            {
                label: 'Interior',
                images: [
                    '/car/i20/Interior/Interior1.jpeg',
                    '/car/i20/Interior/Interior2.jpeg',
                    '/car/i20/Interior/Interior3.jpeg',
                    '/car/i20/Interior/Interior4.jpeg',
                ],
            },
            // { label: 'Highlights', images: ['/car/car3.png', '/car/car5.png'], icon: 'sparkles' },
            { label: 'Tyres',
                 images: [
                    '/car/i20/Tyre/Tyres1.jpeg',
                    '/car/i20/Tyre/Tyres2.jpeg',
                    '/car/i20/Tyre/Tyres3.jpeg',
                    '/car/i20/Tyre/Tyres4.jpeg',
                    '/car/i20/Tyre/Tyres5.jpeg',
                ],
            },
        ],
        fuelType: "Diesel",
        transmission: "Manual",
        kmsDriven: "1,25,500 Kms",
        location: "Surat, Gujarat",
        owner: "Third Owner",
        registrationYear: "2011",
        insurance: "Not Available",
        seats: "5 Seats",
        rto: "Surat",
        engineDisplacement: "1197 cc",
        yearOfManufacture: "2011",
        features: featureCategories,
        emi: "₹18,616 /mo",
        newCarPrice: "₹6.15 Lakh",
        views: "1,100+",
        badgeType: "private",
    },
    // {
    //     id: "3",
    //     name: "Toyota Prius",
    //     year: 2023,
    //     price: "₹15.75 Lakh",
    //     image: "/car/car3.png",
    //     detailOptions: [
    //         { label: 'Exterior', images: ['/car/car3.png', '/car/car4.png'], isActive: true },
    //         { label: 'Interior', images: ['/car/car5.png', '/car/car6.png'] },
    //         // { label: 'Highlights', images: ['/car/car4.png', '/car/car6.png'], icon: 'sparkles' },
    //         { label: 'Tyres', images: ['/car/car5.png', '/car/car3.png'] },
    //     ],
    //     fuelType: "Hybrid",
    //     transmission: "Automatic",
    //     kmsDriven: "18,000 Kms",
    //     location: "Connaught Place, Delhi",
    //     owner: "First Owner",
    //     registrationYear: "2023",
    //     insurance: "Valid till Jun 2025",
    //     seats: "5 Seats",
    //     rto: "Delhi",
    //     engineDisplacement: "1798 cc",
    //     yearOfManufacture: "2023",
    //     emi: "₹39,000 /mo",
    //     newCarPrice: "₹18.50 Lakh",
    //     views: "4200+",
    //     badgeType: "assured",
    // },
    // {
    //     id: "4",
    //     name: "Kia Niro EV",
    //     year: 2022,
    //     price: "₹18.20 Lakh",
    //     image: "/car/car4.png",
    //     detailOptions: [
    //         { label: 'Exterior', images: ['/car/car4.png', '/car/car5.png'], isActive: true },
    //         { label: 'Interior', images: ['/car/car6.png', '/car/car7.png'] },
    //         // { label: 'Highlights', images: ['/car/car5.png', '/car/car7.png'], icon: 'sparkles' },
    //         { label: 'Tyres', images: ['/car/car6.png', '/car/car4.png'] },
    //     ],
    //     fuelType: "Electric",
    //     transmission: "Automatic",
    //     kmsDriven: "22,000 Kms",
    //     location: "Koramangala, Bangalore",
    //     owner: "Second Owner",
    //     registrationYear: "2022",
    //     insurance: "Valid till Sep 2024",
    //     seats: "5 Seats",
    //     rto: "Bangalore",
    //     engineDisplacement: "Electric Motor",
    //     yearOfManufacture: "2022",
    //     emi: "₹45,000 /mo",
    //     newCarPrice: "₹22.00 Lakh",
    //     views: "3500+",
    //     badgeType: "private",
    // },
    // {
    //     id: "5",
    //     name: "VW ID",
    //     year: 2021,
    //     price: "₹16.50 Lakh",
    //     image: "/car/car5.png",
    //     detailOptions: [
    //         { label: 'Exterior', images: ['/car/car5.png', '/car/car6.png'], isActive: true },
    //         { label: 'Interior', images: ['/car/car7.png', '/car/car8.png'] },
    //         // { label: 'Highlights', images: ['/car/car6.png', '/car/car8.png'], icon: 'sparkles' },
    //         { label: 'Tyres', images: ['/car/car7.png', '/car/car5.png'] },
    //     ],
    //     fuelType: "Electric",
    //     transmission: "Automatic",
    //     kmsDriven: "30,000 Kms",
    //     location: "Hinjewadi, Pune",
    //     owner: "First Owner",
    //     registrationYear: "2021",
    //     insurance: "Valid till Dec 2024",
    //     seats: "5 Seats",
    //     rto: "Pune",
    //     engineDisplacement: "Electric Motor",
    //     yearOfManufacture: "2021",
    //     emi: "₹41,000 /mo",
    //     newCarPrice: "₹20.00 Lakh",
    //     views: "2900+",
    //     badgeType: "assured",
    // },
    // {
    //     id: "6",
    //     name: "Honda City",
    //     year: 2023,
    //     price: "₹11.25 Lakh",
    //     image: "/car/car6.png",
    //     detailOptions: [
    //         { label: 'Exterior', images: ['/car/car6.png', '/car/car7.png'], isActive: true },
    //         { label: 'Interior', images: ['/car/car8.png', '/car/car9.png'] },
    //         // { label: 'Highlights', images: ['/car/car7.png', '/car/car9.png'], icon: 'sparkles' },
    //         { label: 'Tyres', images: ['/car/car8.png', '/car/car6.png'] },
    //     ],
    //     fuelType: "Petrol",
    //     transmission: "Manual",
    //     kmsDriven: "15,000 Kms",
    //     location: "Navrangpura, Ahmedabad",
    //     owner: "First Owner",
    //     registrationYear: "2023",
    //     insurance: "Valid till May 2025",
    //     seats: "5 Seats",
    //     rto: "Ahmedabad",
    //     engineDisplacement: "1498 cc",
    //     yearOfManufacture: "2023",
    //     emi: "₹28,000 /mo",
    //     newCarPrice: "₹13.50 Lakh",
    //     views: "3800+",
    //     badgeType: "private",
    // },
    // {
    //     id: "7",
    //     name: "Hyundai Creta",
    //     year: 2023,
    //     price: "₹14.80 Lakh",
    //     image: "/car/car7.png",
    //     detailOptions: [
    //         { label: 'Exterior', images: ['/car/car7.png', '/car/car8.png'], isActive: true },
    //         { label: 'Interior', images: ['/car/car9.png', '/car/car10.png'] },
    //         // { label: 'Highlights', images: ['/car/car8.png', '/car/car10.png'], icon: 'sparkles' },
    //         { label: 'Tyres', images: ['/car/car9.png', '/car/car7.png'] },
    //     ],
    //     fuelType: "Petrol",
    //     transmission: "Automatic",
    //     kmsDriven: "20,000 Kms",
    //     location: "Gurgaon, Haryana",
    //     owner: "First Owner",
    //     registrationYear: "2023",
    //     insurance: "Valid till Aug 2025",
    //     seats: "5 Seats",
    //     rto: "Gurgaon",
    //     engineDisplacement: "1497 cc",
    //     yearOfManufacture: "2023",
    //     emi: "₹37,000 /mo",
    //     newCarPrice: "₹17.20 Lakh",
    //     views: "5100+",
    //     badgeType: "assured",
    // },
    // {
    //     id: "8",
    //     name: "Mahindra XUV700",
    //     year: 2022,
    //     price: "₹22.50 Lakh",
    //     image: "/car/car8.png",
    //     detailOptions: [
    //         { label: 'Exterior', images: ['/car/car8.png', '/car/car9.png'], isActive: true },
    //         { label: 'Interior', images: ['/car/car10.png', '/car/car11.png'] },
    //         // { label: 'Highlights', images: ['/car/car9.png', '/car/car11.png'], icon: 'sparkles' },
    //         { label: 'Tyres', images: ['/car/car10.png', '/car/car8.png'] },
    //     ],
    //     fuelType: "Diesel",
    //     transmission: "Automatic",
    //     kmsDriven: "28,000 Kms",
    //     location: "Noida, Uttar Pradesh",
    //     owner: "First Owner",
    //     registrationYear: "2022",
    //     insurance: "Valid till Nov 2024",
    //     seats: "7 Seats",
    //     rto: "Noida",
    //     engineDisplacement: "2198 cc",
    //     yearOfManufacture: "2022",
    //     emi: "₹56,000 /mo",
    //     newCarPrice: "₹26.00 Lakh",
    //     views: "6700+",
    //     badgeType: "assured",
    // },
    // {
    //     id: "9",
    //     name: "Tata Nexon EV",
    //     year: 2023,
    //     price: "₹13.90 Lakh",
    //     image: "/car/car9.png",
    //     detailOptions: [
    //         { label: 'Exterior', images: ['/car/car9.png', '/car/car10.png'], isActive: true },
    //         { label: 'Interior', images: ['/car/car11.png', '/car/car12.png'] },
    //         // { label: 'Highlights', images: ['/car/car10.png', '/car/car12.png'], icon: 'sparkles' },
    //         { label: 'Tyres', images: ['/car/car11.png', '/car/car9.png'] },
    //     ],
    //     fuelType: "Electric",
    //     transmission: "Automatic",
    //     kmsDriven: "12,000 Kms",
    //     location: "Salt Lake, Kolkata",
    //     owner: "First Owner",
    //     registrationYear: "2023",
    //     insurance: "Valid till Jul 2025",
    //     seats: "5 Seats",
    //     rto: "Kolkata",
    //     engineDisplacement: "Electric Motor",
    //     yearOfManufacture: "2023",
    //     emi: "₹34,500 /mo",
    //     newCarPrice: "₹16.50 Lakh",
    //     views: "4400+",
    //     badgeType: "private",
    // },
    // {
    //     id: "10",
    //     name: "Maruti Swift",
    //     year: 2024,
    //     price: "₹6.20 Lakh",
    //     image: "/car/car10.png",
    //     detailOptions: [
    //         { label: 'Exterior', images: ['/car/car10.png', '/car/car11.png'], isActive: true },
    //         { label: 'Interior', images: ['/car/car12.png', '/car/car1.png'] },
    //         // { label: 'Highlights', images: ['/car/car11.png', '/car/car1.png'], icon: 'sparkles' },
    //         { label: 'Tyres', images: ['/car/car12.png', '/car/car10.png'] },
    //     ],
    //     fuelType: "Petrol",
    //     transmission: "Manual",
    //     kmsDriven: "8,000 Kms",
    //     location: "Vadodara, Gujarat",
    //     owner: "First Owner",
    //     registrationYear: "2024",
    //     insurance: "Valid till Jan 2026",
    //     seats: "5 Seats",
    //     rto: "Vadodara",
    //     engineDisplacement: "1197 cc",
    //     yearOfManufacture: "2024",
    //     emi: "₹15,400 /mo",
    //     newCarPrice: "₹7.20 Lakh",
    //     views: "5600+",
    //     badgeType: "assured",
    // },
    // {
    //     id: "11",
    //     name: "Ford Endeavour",
    //     year: 2021,
    //     price: "₹28.75 Lakh",
    //     image: "/car/car11.png",
    //     detailOptions: [
    //         { label: 'Exterior', images: ['/car/car11.png', '/car/car12.png'], isActive: true },
    //         { label: 'Interior', images: ['/car/car1.png', '/car/car2.png'] },
    //         // { label: 'Highlights', images: ['/car/car12.png', '/car/car2.png'], icon: 'sparkles' },
    //         { label: 'Tyres', images: ['/car/car1.png', '/car/car11.png'] },
    //     ],
    //     fuelType: "Diesel",
    //     transmission: "Automatic",
    //     kmsDriven: "35,000 Kms",
    //     location: "Whitefield, Bangalore",
    //     owner: "Second Owner",
    //     registrationYear: "2021",
    //     insurance: "Valid till Oct 2024",
    //     seats: "7 Seats",
    //     rto: "Bangalore",
    //     engineDisplacement: "1996 cc",
    //     yearOfManufacture: "2021",
    //     emi: "₹71,000 /mo",
    //     newCarPrice: "₹33.50 Lakh",
    //     views: "2100+",
    //     badgeType: "private",
    // },
    // {
    //     id: "12",
    //     name: "MG ZS EV",
    //     year: 2023,
    //     price: "₹17.50 Lakh",
    //     image: "/car/car12.png",
    //     detailOptions: [
    //         { label: 'Exterior', images: ['/car/car12.png', '/car/car1.png'], isActive: true },
    //         { label: 'Interior', images: ['/car/car2.png', '/car/car3.png'] },
    //         // { label: 'Highlights', images: ['/car/car1.png', '/car/car3.png'], icon: 'sparkles' },
    //         { label: 'Tyres', images: ['/car/car2.png', '/car/car12.png'] },
    //     ],
    //     fuelType: "Electric",
    //     transmission: "Automatic",
    //     kmsDriven: "16,000 Kms",
    //     location: "Bandra, Mumbai",
    //     owner: "First Owner",
    //     registrationYear: "2023",
    //     insurance: "Valid till Jun 2025",
    //     seats: "5 Seats",
    //     rto: "Mumbai",
    //     engineDisplacement: "Electric Motor",
    //     yearOfManufacture: "2023",
    //     emi: "₹43,400 /mo",
    //     newCarPrice: "₹21.00 Lakh",
    //     views: "3900+",
    //     badgeType: "assured",
    // },
];

// Extract unique cities from car locations
export const cities: string[] = Array.from(
    new Set(
        sampleCars.map(car => {
            const locationParts = car.location.split(',');
            return locationParts.length > 1 ? locationParts[1].trim() : locationParts[0].trim();
        })
    )
).sort();

// Extract unique brands from car names
export const brands: string[] = Array.from(
    new Set(sampleCars.map(car => car.name.split(' ')[0]))
).sort();

// Extract unique fuel types
export const fuelTypes: string[] = Array.from(
    new Set(sampleCars.map(car => car.fuelType))
).sort();

// Current user data
export const currentUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
};

// Sample bids
const sampleBids: Bid[] = [
    {
        id: 'bid1',
        buyerName: 'Rajesh Kumar',
        amount: 530000,
        status: 'pending',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'bid2',
        buyerName: 'Priya Sharma',
        amount: 545000,
        status: 'pending',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'bid3',
        buyerName: 'Amit Patel',
        amount: 520000,
        status: 'rejected',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'bid4',
        buyerName: 'Sneha Reddy',
        amount: 550000,
        status: 'accepted',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

// My listings - cars I'm selling (with bids and views)
export const myListings: ListingCar[] = [
    convertToListingCar(sampleCars[0], [sampleBids[0], sampleBids[1], sampleBids[3]], 1100),
    convertToListingCar(sampleCars[1], [sampleBids[2]], 4200),
];

// My favorites - cars I've saved
export const myFavorites: CarData[] = [
    sampleCars[0],
    sampleCars[1],
];

// Dummy cars for manage bids (with bids) - same as myListings
export const dummyCars: ListingCar[] = [
    convertToListingCar(sampleCars[0], [sampleBids[0], sampleBids[1], sampleBids[3]], 1100),
    convertToListingCar(sampleCars[1], [sampleBids[2]], 4200),
];

