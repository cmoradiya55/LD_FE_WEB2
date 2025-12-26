export type StepId =
  | 'brand'
  | 'year'
  | 'model'
  | 'variant'
  | 'ownership'
  | 'kilometerDriven'
  | 'location'
  | 'price'
  | 'photos';

export interface StepMeta {
  id: StepId;
  label: string;
  description: string;
}

export interface ModelOption {
  name: string;
  variants: string[];
}

export interface YearOption {
  value: string;
  models: ModelOption[];
}

export interface BrandOption {
  name: string;
  logo: string;
  years: YearOption[];
}

export interface InventoryCar {
  id: string;
  brand: string;
  year: string;
  model: string;
  variant: string;
  ownership: string;
  kilometerDriven: string;
  location: string;
  priceRange: string;
}

export interface CascadingFilterNode {
  brand: string;
  logo: string;
  years: Array<{
    value: string;
    models: ModelOption[];
  }>;
  defaults: {
    ownership: string;
    kilometerDriven: string;
    location: string;
    priceRange: string;
    photos: string[];
  };
}

export const sellFlowSteps: StepMeta[] = [
  { id: 'brand', label: 'Brand', description: 'Select the manufacturer for your listing.' },
  { id: 'year', label: 'Year', description: 'Choose the manufacturing year to refine matches.' },
  { id: 'model', label: 'Model', description: 'Pick the specific model available for that brand and year.' },
  { id: 'variant', label: 'Variant', description: 'Select the trim or variant buyers will see.' },
  { id: 'ownership', label: 'Ownership', description: 'Tell us how many owners the car has had.' },
  { id: 'kilometerDriven', label: 'Kilometer Driven', description: 'Approximate kilometers driven helps set expectations.' },
  { id: 'location', label: 'Location', description: 'Share the city where the car is located.' },
  { id: 'price', label: 'Price', description: 'Enter the expected selling price for your car.' },
  { id: 'photos', label: 'Photos', description: 'Highlight how you plan to share images.' },
];

const brandLogoEntries: Array<{ name: string; logo: string }> = [
  { name: 'Ashok Leyland', logo: '/CarLogo/AshokLeyland.png' },
  { name: 'Aston Martin', logo: '/CarLogo/AstonMartin.jpg' },
  { name: 'Audi', logo: '/CarLogo/Audi.png' },
  { name: 'Austin', logo: '/CarLogo/Austin.png' },
  { name: 'Bajaj', logo: '/CarLogo/Bajaj.png' },
  { name: 'Bentley', logo: '/CarLogo/BentleyLogo.png' },
  { name: 'BMW', logo: '/CarLogo/BMW.png' },
  { name: 'Bugatti', logo: '/CarLogo/Bugatti.png' },
  { name: 'BYD', logo: '/CarLogo/BYD.png' },
  { name: 'Cadillac', logo: '/CarLogo/Cadillac.png' },
  { name: 'Caterham', logo: '/CarLogo/Caterham.png' },
  { name: 'Chevrolet', logo: '/CarLogo/Chevrolet.png' },
  { name: 'Chrysler', logo: '/CarLogo/Chrysler.png' },
  { name: 'Citroen', logo: '/CarLogo/Citroen.png' },
  { name: 'Conquest', logo: '/CarLogo/Conquest.png' },
  { name: 'Daewoo', logo: '/CarLogo/Daewoo.png' },
  { name: 'Datsun', logo: '/CarLogo/Datsun.png' },
  { name: 'DC', logo: '/CarLogo/DC.png' },
  { name: 'Dodge', logo: '/CarLogo/Dodge.png' },
  { name: 'Ferrari', logo: '/CarLogo/Ferrari.png' },
  { name: 'Fiat', logo: '/CarLogo/Fiat.png' },
  { name: 'Force', logo: '/CarLogo/Force.png' },
  { name: 'Ford', logo: '/CarLogo/Ford.png' },
  { name: 'Hindustan Motors', logo: '/CarLogo/HindustanMotors.png' },
  { name: 'Honda', logo: '/CarLogo/Honda.png' },
  { name: 'Hummer', logo: '/CarLogo/Hummer.png' },
  { name: 'Hyundai', logo: '/CarLogo/Hyundai.png' },
  { name: 'ICML', logo: '/CarLogo/ICML.png' },
  { name: 'Infiniti', logo: '/CarLogo/Infiniti.png' },
  { name: 'Isuzu', logo: '/CarLogo/Isuzu.png' },
  { name: 'Jaguar', logo: '/CarLogo/Jaguar.png' },
  { name: 'Jeep', logo: '/CarLogo/Jeep.png' },
  { name: 'Kia', logo: '/CarLogo/Kia.png' },
  { name: 'Lamborghini', logo: '/CarLogo/Lamborghini.png' },
  { name: 'Land Rover', logo: '/CarLogo/LandRover.png' },
  { name: 'Lexus', logo: '/CarLogo/Lexus.png' },
  { name: 'Lotus', logo: '/CarLogo/Lotus.jpg' },
  { name: 'Mahindra', logo: '/CarLogo/Mahindra.jpg' },
  { name: 'Mahindra Renault', logo: '/CarLogo/MahindraRenault.png' },
  { name: 'Maruti Suzuki', logo: '/CarLogo/MarutiLogo.png' },
  { name: 'Maserati', logo: '/CarLogo/Maserati.png' },
  { name: 'Maybach', logo: '/CarLogo/Maybach.png' },
  { name: 'Mazda', logo: '/CarLogo/Mazda.png' },
  { name: 'McLaren', logo: '/CarLogo/Mclaren.jpg' },
  { name: 'Mercedes-Benz', logo: '/CarLogo/Mercedes.png' },
  { name: 'MG', logo: '/CarLogo/MG.png' },
  { name: 'Mini', logo: '/CarLogo/MINI.png' },
  { name: 'Mitsubishi', logo: '/CarLogo/Mitsubishi.png' },
  { name: 'Nissan', logo: '/CarLogo/Nissan.png' },
  { name: 'Opel', logo: '/CarLogo/Opel.png' },
  { name: 'Peugeot', logo: '/CarLogo/Peugeot.png' },
  { name: 'PMV', logo: '/CarLogo/PMV.jpg' },
  { name: 'Porsche', logo: '/CarLogo/Porsche.png' },
  { name: 'Pravaig', logo: '/CarLogo/Pravaig.jpg' },
  { name: 'Premier', logo: '/CarLogo/Premier.png' },
  { name: 'Renault', logo: '/CarLogo/Renault.png' },
  { name: 'Reva', logo: '/CarLogo/Reva.png' },
  { name: 'Rolls Royce', logo: '/CarLogo/RollsRoyce.png' },
  { name: 'San Motors', logo: '/CarLogo/SanMotors.png' },
  { name: 'Sipani', logo: '/CarLogo/Sipani.jpg' },
  { name: 'Skoda', logo: '/CarLogo/Skoda.jpg' },
  { name: 'Smart', logo: '/CarLogo/Smart.png' },
  { name: 'SsangYong', logo: '/CarLogo/Ssangyong.png' },
  { name: 'Subaru', logo: '/CarLogo/Subaru.png' },
  { name: 'Tata', logo: '/CarLogo/TATA.png' },
  { name: 'Tesla', logo: '/CarLogo/Tesla.png' },
  { name: 'Toyota', logo: '/CarLogo/carToyota.png' },
  { name: 'Vayve Mobility', logo: '/CarLogo/VayveMobility.jpg' },
  { name: 'Volkswagen', logo: '/CarLogo/Wokswagon.png' },
  { name: 'Volvo', logo: '/CarLogo/Volvo.png' },
];

const baseYears = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000', '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991', '1990', '1989', '1988', '1987', '1986', '1985'];

const brandModelLibrary: Record<string, ModelOption[]> = {
  Honda: [
    { name: 'City', variants: ['ZX CVT', 'VX MT', 'SV MT'] },
    { name: 'Elevate', variants: ['ZX CVT', 'VX MT'] },
    { name: 'Amaze', variants: ['VX CVT', 'S MT'] },
  ],
  Hyundai: [
    { name: 'Creta', variants: ['SX (O) AT', 'SX Turbo'] },
    { name: 'Venue', variants: ['SX(O) DCT', 'SX MT'] },
    { name: 'i20', variants: ['Asta DCT', 'Sportz MT'] },
  ],
  'Maruti Suzuki': [
    { name: 'Baleno', variants: ['Alpha MT', 'Zeta AT'] },
    { name: 'Swift', variants: ['ZXI Plus', 'ZXI AMT'] },
    { name: 'Grand Vitara', variants: ['Alpha eCVT', 'Zeta MT'] },
  ],
  Tata: [
    { name: 'Nexon', variants: ['Fearless+ S', 'Creative DT'] },
    { name: 'Harrier', variants: ['XZ+ AT', 'XZ MT'] },
    { name: 'Punch', variants: ['Creative DT', 'Adventure Rhythm'] },
  ],
  Mahindra: [
    { name: 'XUV700', variants: ['AX7 L AT', 'AX5 MT'] },
    { name: 'Scorpio N', variants: ['Z8L AT', 'Z6 MT'] },
    { name: 'Thar', variants: ['LX D AT', 'AX(O) Petrol MT'] },
  ],
};

const genericModelLibrary: ModelOption[] = [
  { name: 'Signature', variants: ['Base MT', 'Premium AT'] },
  { name: 'Performance', variants: ['Sport', 'Elite'] },
];

const createYearPackages = (brandName: string): YearOption[] => {
  const modelSet = brandModelLibrary[brandName] ?? genericModelLibrary;
  return baseYears.map((year) => ({
    value: year,
    models: modelSet,
  }));
};

export const brandOptions: BrandOption[] = brandLogoEntries.map((brand) => ({
  ...brand,
  years: createYearPackages(brand.name),
}));

// Ownership Enum
export enum OwnershipType {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
  FIFTH = 5,
}

// Ownership label mapping
export const ownershipLabels: Record<OwnershipType, string> = {
  [OwnershipType.FIRST]: '1st Owner',
  [OwnershipType.SECOND]: '2nd Owner',
  [OwnershipType.THIRD]: '3rd Owner',
  [OwnershipType.FOURTH]: '4th Owner',
  [OwnershipType.FIFTH]: '5th Owner',
};

// Ownership options array (for backward compatibility and UI rendering)
export const ownershipOptions = Object.entries(ownershipLabels).map(([id, label]) => ({
  id: Number(id) as OwnershipType,
  label,
}));

// Kilometer Driven Enum
export enum KilometerDriven {
  ZERO_TO_10K = 1,
  TEN_TO_20K = 2,
  TWENTY_TO_30K = 3,
  THIRTY_TO_40K = 4,
  FORTY_TO_50K = 5,
  FIFTY_TO_60K = 6,
  SIXTY_TO_70K = 7,
  SEVENTY_TO_80K = 8,
  EIGHTY_TO_90K = 9,
  NINTY_TO_1LAKH = 10,
  ONE_LAKH_TO_1_2_LAKH = 11,
  ONE_2_LAKH_TO_1_5_LAKH = 12,
  ONE_5_LAKH_PLUS = 13,
}

// Kilometer Driven label mapping
export const kilometerDrivenLabels: Record<KilometerDriven, string> = {
  [KilometerDriven.ZERO_TO_10K]: '0 - 10,000 km',
  [KilometerDriven.TEN_TO_20K]: '10,000 - 20,000 km',
  [KilometerDriven.TWENTY_TO_30K]: '20,000 - 30,000 km',
  [KilometerDriven.THIRTY_TO_40K]: '30,000 - 40,000 km',
  [KilometerDriven.FORTY_TO_50K]: '40,000 - 50,000 km',
  [KilometerDriven.FIFTY_TO_60K]: '50,000 - 60,000 km',
  [KilometerDriven.SIXTY_TO_70K]: '60,000 - 70,000 km',
  [KilometerDriven.SEVENTY_TO_80K]: '70,000 - 80,000 km',
  [KilometerDriven.EIGHTY_TO_90K]: '80,000 - 90,000 km',
  [KilometerDriven.NINTY_TO_1LAKH]: '90,000 - 1,00,000 km',
  [KilometerDriven.ONE_LAKH_TO_1_2_LAKH]: '1,00,000 - 1,20,000 km',
  [KilometerDriven.ONE_2_LAKH_TO_1_5_LAKH]: '1,20,000 - 1,50,000 km',
  [KilometerDriven.ONE_5_LAKH_PLUS]: '1,50,000+ km',
};

// Kilometer Driven options array (for backward compatibility and UI rendering)
export const kilometerDrivenOptions = Object.entries(kilometerDrivenLabels).map(([id, label]) => ({
  id: Number(id) as KilometerDriven,
  label,
}));

export const locationOptions = [
  'Rajkot',
  'Ahmedabad',
  'Surat',
  'Vadodara',
  'Bhavnagar',
];

export const priceRanges = ['Under ₹5L', '₹5L - ₹10L', '₹10L - ₹20L', '₹20L+'];

export const cascadedFilters: CascadingFilterNode[] = [
  {
    brand: 'Honda',
    logo: '/CarLogo/Honda.png',
    years: [
      {
        value: '2024',
        models: [
          { name: 'City', variants: ['ZX CVT', 'VX MT', 'SV MT'] },
          { name: 'Elevate', variants: ['ZX CVT', 'VX MT'] },
        ],
      },
      {
        value: '2022',
        models: [
          { name: 'Amaze', variants: ['VX CVT', 'S MT'] },
          { name: 'City', variants: ['VX MT', 'SV MT'] },
        ],
      },
    ],
    defaults: {
      ownership: '1st Owner',
      kilometerDriven: '0 - 20,000 km',
      location: 'Mumbai',
      priceRange: '₹10L - ₹20L',
      photos: ['/photos/honda-city-front.png', '/photos/honda-city-interior.png'],
    },
  },
  {
    brand: 'Hyundai',
    logo: '/CarLogo/Hyundai.png',
    years: [
      {
        value: '2024',
        models: [
          { name: 'Creta', variants: ['SX (O) AT', 'SX Turbo'] },
          { name: 'i20', variants: ['Asta DCT', 'Sportz MT'] },
        ],
      },
      {
        value: '2021',
        models: [
          { name: 'Venue', variants: ['SX(O) DCT', 'SX MT'] },
          { name: 'Creta', variants: ['SX MT', 'EX MT'] },
        ],
      },
    ],
    defaults: {
      ownership: '2nd Owner',
      kilometerDriven: '20,000 - 40,000 km',
      location: 'Delhi',
      priceRange: '₹5L - ₹10L',
      photos: ['/photos/hyundai-creta-front.png', '/photos/hyundai-venue-cabin.png'],
    },
  },
  {
    brand: 'Tata',
    logo: '/CarLogo/TATA.png',
    years: [
      {
        value: '2023',
        models: [
          { name: 'Nexon', variants: ['Fearless+ S', 'Creative DT'] },
          { name: 'Punch', variants: ['Creative DT', 'Adventure Rhythm'] },
        ],
      },
      {
        value: '2020',
        models: [
          { name: 'Harrier', variants: ['XZ+ AT', 'XZ MT'] },
          { name: 'Altroz', variants: ['XZ Turbo', 'XZ NA'] },
        ],
      },
    ],
    defaults: {
      ownership: '1st Owner',
      kilometerDriven: '40,000 - 60,000 km',
      location: 'Bangalore',
      priceRange: '₹10L - ₹20L',
      photos: ['/photos/tata-nexon-front.png', '/photos/tata-harrier-dashboard.png'],
    },
  },
];

export const dummyInventory: InventoryCar[] = [
  {
    id: 'inv-1',
    brand: 'Honda',
    year: '2024',
    model: 'City',
    variant: 'ZX CVT',
    ownership: '1st Owner',
    kilometerDriven: '0 - 20,000 km',
    location: 'Mumbai',
    priceRange: '₹10L - ₹20L',
  },
  {
    id: 'inv-2',
    brand: 'Honda',
    year: '2023',
    model: 'Elevate',
    variant: 'VX MT',
    ownership: '1st Owner',
    kilometerDriven: '20,000 - 40,000 km',
    location: 'Bangalore',
    priceRange: '₹10L - ₹20L',
  },
  {
    id: 'inv-3',
    brand: 'Hyundai',
    year: '2024',
    model: 'Creta',
    variant: 'SX (O) AT',
    ownership: '2nd Owner',
    kilometerDriven: '20,000 - 40,000 km',
    location: 'Delhi',
    priceRange: '₹10L - ₹20L',
  },
  {
    id: 'inv-4',
    brand: 'Hyundai',
    year: '2022',
    model: 'Venue',
    variant: 'SX(O) DCT',
    ownership: '1st Owner',
    kilometerDriven: '40,000 - 60,000 km',
    location: 'Hyderabad',
    priceRange: '₹5L - ₹10L',
  },
  {
    id: 'inv-5',
    brand: 'Maruti Suzuki',
    year: '2023',
    model: 'Baleno',
    variant: 'Alpha MT',
    ownership: '1st Owner',
    kilometerDriven: '0 - 20,000 km',
    location: 'Pune',
    priceRange: '₹5L - ₹10L',
  },
  {
    id: 'inv-6',
    brand: 'Maruti Suzuki',
    year: '2021',
    model: 'Swift',
    variant: 'ZXI Plus',
    ownership: '2nd Owner',
    kilometerDriven: '40,000 - 60,000 km',
    location: 'Ahmedabad',
    priceRange: 'Under ₹5L',
  },
  {
    id: 'inv-7',
    brand: 'Tata',
    year: '2024',
    model: 'Nexon',
    variant: 'Fearless+ S',
    ownership: '1st Owner',
    kilometerDriven: '0 - 20,000 km',
    location: 'Chennai',
    priceRange: '₹10L - ₹20L',
  },
  {
    id: 'inv-8',
    brand: 'Tata',
    year: '2022',
    model: 'Punch',
    variant: 'Creative DT',
    ownership: '1st Owner',
    kilometerDriven: '20,000 - 40,000 km',
    location: 'Delhi',
    priceRange: '₹5L - ₹10L',
  },
  {
    id: 'inv-9',
    brand: 'Mahindra',
    year: '2023',
    model: 'XUV700',
    variant: 'AX7 L AT',
    ownership: '1st Owner',
    kilometerDriven: '0 - 20,000 km',
    location: 'Mumbai',
    priceRange: '₹20L+',
  },
  {
    id: 'inv-10',
    brand: 'Mahindra',
    year: '2021',
    model: 'Thar',
    variant: 'LX D AT',
    ownership: '2nd Owner',
    kilometerDriven: '60,000+ km',
    location: 'Bangalore',
    priceRange: '₹10L - ₹20L',
  },
];

