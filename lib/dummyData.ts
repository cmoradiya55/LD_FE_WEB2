export interface Car {
  id: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  kmDriven: number;
  ownership: string;
  fuelType: string;
  transmission: string;
  city: string;
  price: number;
  status: 'pending' | 'live' | 'sold';
  images: string[];
  videoUrl?: string;
  description: string;
  features: string[];
  inspectionStatus: 'pending' | 'scheduled' | 'completed' | 'approved';
  inspectionDate?: string;
  valuationPrice?: number;
  sellerId: string;
  bids?: Bid[];
  isFavorite?: boolean;
  views?: number;
}

export interface Bid {
  id: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'buyer' | 'seller' | 'both';
}

export const dummyCars: Car[] = [
  {
    id: '1',
    brand: 'Honda',
    model: 'City',
    variant: 'VX CVT',
    year: 2020,
    kmDriven: 32000,
    ownership: '1st Owner',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    city: 'Mumbai',
    price: 1250000,
    status: 'live',
    images: [
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    ],
    description: 'Well-maintained Honda City with full service history. Single owner, garage kept.',
    features: ['Sunroof', 'Cruise Control', 'Leather Seats', 'Touchscreen Infotainment', 'Rear Camera'],
    inspectionStatus: 'approved',
    inspectionDate: '2024-11-15',
    valuationPrice: 1280000,
    sellerId: 'seller1',
    views: 234,
    bids: [
      {
        id: 'bid1',
        buyerId: 'buyer1',
        buyerName: 'Rahul Sharma',
        amount: 1200000,
        timestamp: '2024-11-20T10:30:00',
        status: 'pending'
      },
      {
        id: 'bid2',
        buyerId: 'buyer2',
        buyerName: 'Priya Patel',
        amount: 1230000,
        timestamp: '2024-11-21T14:45:00',
        status: 'pending'
      }
    ]
  },
  {
    id: '2',
    brand: 'Hyundai',
    model: 'Creta',
    variant: 'SX(O) Diesel',
    year: 2021,
    kmDriven: 24500,
    ownership: '1st Owner',
    fuelType: 'Diesel',
    transmission: 'Manual',
    city: 'Bangalore',
    price: 1650000,
    status: 'live',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      'https://images.unsplash.com/photo-1621135802920-1516e4d6e8cc?w=800',
    ],
    description: 'Premium SUV with all features. Accident-free, comprehensive insurance valid till 2025.',
    features: ['Panoramic Sunroof', 'Wireless Charger', 'Ventilated Seats', '360° Camera', 'ADAS'],
    inspectionStatus: 'approved',
    valuationPrice: 1680000,
    sellerId: 'seller2',
    views: 456,
    isFavorite: true,
  },
  {
    id: '3',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'ZXI Plus',
    year: 2019,
    kmDriven: 45000,
    ownership: '2nd Owner',
    fuelType: 'Petrol',
    transmission: 'Manual',
    city: 'Delhi',
    price: 650000,
    status: 'live',
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
    ],
    description: 'Fuel-efficient hatchback, perfect for city driving. Recently serviced.',
    features: ['Touchscreen', 'Rear Parking Sensors', 'Alloy Wheels', 'ABS', 'Dual Airbags'],
    inspectionStatus: 'approved',
    valuationPrice: 665000,
    sellerId: 'seller3',
    views: 189,
  },
  {
    id: '4',
    brand: 'Tata',
    model: 'Nexon',
    variant: 'XZ+ Petrol',
    year: 2022,
    kmDriven: 15000,
    ownership: '1st Owner',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    city: 'Pune',
    price: 1320000,
    status: 'live',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
      'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=800',
    ],
    description: 'Like new condition. Under warranty till 2027. Full manufacturer service.',
    features: ['Connected Car Tech', 'Air Purifier', 'Electric Sunroof', 'JBL Audio', 'Cruise Control'],
    inspectionStatus: 'approved',
    valuationPrice: 1350000,
    sellerId: 'seller1',
    views: 312,
    isFavorite: true,
  },
  {
    id: '5',
    brand: 'Mahindra',
    model: 'XUV700',
    variant: 'AX7 Diesel AT',
    year: 2023,
    kmDriven: 8000,
    ownership: '1st Owner',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    city: 'Mumbai',
    price: 2450000,
    status: 'live',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    ],
    description: 'Premium 7-seater SUV with advanced safety features. Almost brand new.',
    features: ['ADAS Level 2', 'Sony 3D Audio', 'Panoramic Sunroof', 'Dual-Zone AC', 'Wireless Charger'],
    inspectionStatus: 'approved',
    valuationPrice: 2480000,
    sellerId: 'seller4',
    views: 523,
  },
  {
    id: '6',
    brand: 'Kia',
    model: 'Seltos',
    variant: 'GTX Plus',
    year: 2020,
    kmDriven: 38000,
    ownership: '1st Owner',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    city: 'Hyderabad',
    price: 1580000,
    status: 'pending',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    ],
    description: 'Feature-loaded SUV with excellent build quality. Regular maintenance done.',
    features: ['Ventilated Seats', 'BOSE Audio', 'UVO Connect', '10.25" Touchscreen', 'LED Lights'],
    inspectionStatus: 'scheduled',
    inspectionDate: '2024-11-25',
    sellerId: 'seller1',
    views: 78,
  },
];

export const currentUser: User = {
  id: 'user1',
  name: 'Amit Kumar',
  email: 'amit.kumar@example.com',
  phone: '+91 98765 43210',
  type: 'both'
};

// Cars listed by current user (for seller dashboard)
export const myListings: Car[] = dummyCars.filter(car => car.sellerId === 'seller1');

// Cars favorited by current user (for buyer dashboard)
export const myFavorites: Car[] = dummyCars.filter(car => car.isFavorite);

export const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat'
];

export const brands = [
  'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda',
  'Kia', 'Toyota', 'Ford', 'Volkswagen', 'Renault', 'Nissan'
];

export const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric'];

export const transmissionTypes = ['Manual', 'Automatic'];

