# AutoMarket - Used Car Marketplace

A modern, mobile-first used car marketplace where users can buy and sell verified cars with a single unified account.

## Features

### For Sellers
- 📝 Easy car listing with comprehensive details
- 📸 Multi-image and video upload
- 🔍 Professional 150-point inspection
- 💰 Market-based valuation report
- 📊 Real-time bid tracking and management
- ✅ Automatic listing after approval

### For Buyers
- 🔎 Advanced search and filtering
- ✔️ Verified car listings with inspection reports
- 💵 Place bids on cars
- ❤️ Save favorite cars
- 📅 Book test visit
- 📱 Mobile-first responsive design

### Key Highlights
- 🔐 OTP-based authentication (Phone/Email)
- 👤 Single unified account for buying & selling
- 📊 Comprehensive dashboard
- 🎨 Modern, clean UI with Tailwind CSS
- ⚡ Built with Next.js 14 & TypeScript

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── auth/                # Authentication pages
│   ├── car/                 # Car details
│   ├── sell/                # Seller flow pages
│   │   ├── add-car/        # Add new listing
│   │   ├── inspection/     # Track inspection
│   │   ├── valuation/      # View valuation report
│   │   └── manage-bids/    # Manage received bids
│   ├── dashboard/           # User dashboard
│   ├── favorites/           # Saved cars
│   ├── my-listings/         # Seller's listings
│   └── book-test-visit/     # Book test drive
├── components/              # Reusable components
│   ├── Navigation.tsx       # Main navigation
│   └── CarCard.tsx          # Car listing card
├── lib/                     # Utilities and data
│   └── dummyData.ts        # Mock data for demo
└── public/                  # Static assets
```

## Key Pages

### Buyer Flow
- **Browse** (`/`) - Search and filter cars
- **Car Details** (`/car/[id]`) - View detailed information and place bids
- **Favorites** (`/favorites`) - Saved cars
- **Book Test Visit** (`/book-test-visit`) - Schedule inspection

### Seller Flow
- **Add Car** (`/sell/add-car`) - Create new listing
- **Track Inspection** (`/sell/inspection/[id]`) - Monitor inspection progress
- **Valuation Report** (`/sell/valuation/[id]`) - View professional valuation
- **Manage Bids** (`/sell/manage-bids/[id]`) - Accept/reject bids
- **My Listings** (`/my-listings`) - View all listings

### Common
- **Login** (`/auth/login`) - Phone/Email + OTP authentication
- **Dashboard** (`/dashboard`) - Unified buyer & seller dashboard

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Vercel (recommended)

## Features Implementation

### Authentication
- OTP-based login via phone or email
- Persistent session management
- Single account for both buying and selling

### Search & Filters
- Text search by brand, model, variant
- Filter by city, brand, fuel type, price range, year
- Real-time results

### Car Listing Process
1. Seller submits car details and photos
2. Listing goes to "Pending Review" state
3. Inspection is scheduled and conducted
4. Valuation report is generated
5. Listing automatically goes live
6. Seller receives and manages bids

### Bid Management
- Buyers can place bids on live cars
- Sellers receive bid notifications
- Accept/reject bids with one click
- Contact buyer directly after acceptance

## Design Principles

- **Mobile-First:** Optimized for mobile devices with responsive design
- **Clean UI:** Modern card-based layout with clear CTAs
- **Trust Signals:** Verification badges, inspection reports, valuation
- **User-Friendly:** Intuitive navigation and clear status indicators
- **Performance:** Fast page loads with optimized images

## Dummy Data

The app includes realistic dummy data for:
- 6 sample cars with full details
- Mock inspection and valuation data
- Sample bids and user interactions

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```js
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Branding
Update the brand name in `components/Navigation.tsx`:
```tsx
<span>AutoMarket</span> // Change this
```

## Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
```bash
npm run build
npm start
```

## Future Enhancements

- Real backend integration with API
- Payment gateway integration
- Real-time chat between buyers and sellers
- Push notifications for bids
- Advanced analytics for sellers
- Car comparison feature
- Loan calculator
- Service history verification
- Video call for virtual inspection

## License

MIT

## Support

For support, email support@automarket.com or join our Slack channel.

