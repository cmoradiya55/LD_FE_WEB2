# 🚀 Quick Start Guide

## Installation & Running

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open in Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Exploring the App

### As a Buyer

1. **Browse Cars** - Start at homepage (/)
   - Use search bar to find specific cars
   - Apply filters (city, brand, fuel type, price, year)
   - Click on any car to view details

2. **Car Details Page**
   - View photos, specifications, and valuation report
   - Click heart icon to save as favorite
   - Click "Place Bid" to submit your offer
   - Book a test visit

3. **Favorites** - Access via navigation or `/favorites`
   - View all saved cars in one place

4. **Dashboard** - View your activity
   - Switch to "Saved Cars" tab
   - See all your favorite cars and bids

### As a Seller

1. **Add Car** - Click "Sell Car" button in header
   - Fill in car details (3-step form)
   - Upload photos and documents
   - Review and submit

2. **Track Inspection** - `/sell/inspection/[id]`
   - Monitor inspection progress
   - View scheduled appointment details
   - See timeline of steps

3. **Valuation Report** - `/sell/valuation/[id]`
   - View detailed assessment
   - See market comparison
   - Download PDF report

4. **Manage Bids** - `/sell/manage-bids/[id]`
   - View all received bids
   - Accept or reject offers
   - Contact buyers directly

5. **My Listings** - Access via navigation
   - View all your cars (pending, live, sold)
   - See bid notifications (red badge)

### Dashboard

- **Unified View** - Access both buyer and seller features
- **Quick Stats** - Total views, active bids, favorites
- **Switch Tabs** - Toggle between "My Listings" and "Saved Cars"

## 🎨 Design Features

### Mobile-First
- Fully responsive design
- Bottom navigation on mobile
- Touch-friendly buttons
- Optimized layouts for small screens

### Visual Elements
- **Status Badges** - Pending, Live, Sold, Verified
- **Progress Indicators** - Inspection timeline
- **Cards** - Modern card-based layout
- **Icons** - Lucide React icons throughout
- **Animations** - Smooth transitions and hover effects

### Color Coding
- 🟢 **Green** - Live listings, approved, accepted
- 🟡 **Yellow** - Pending review, in progress
- 🔵 **Blue** - Primary actions, information
- 🔴 **Red** - Notifications, important actions
- ⚫ **Gray** - Sold, rejected, inactive

## 📄 Key Pages & Routes

| Page | Route | Description |
|------|-------|-------------|
| Browse Cars | `/` | Homepage with search & filters |
| Car Details | `/car/[id]` | Detailed car information |
| Login | `/auth/login` | OTP authentication |
| Dashboard | `/dashboard` | Unified buyer/seller dashboard |
| Add Car | `/sell/add-car` | Create new listing |
| Track Inspection | `/sell/inspection/[id]` | Monitor inspection progress |
| Valuation | `/sell/valuation/[id]` | View valuation report |
| Manage Bids | `/sell/manage-bids/[id]` | Handle received bids |
| My Listings | `/my-listings` | View all seller listings |
| Favorites | `/favorites` | Saved cars |
| Book Test Visit | `/book-test-visit` | Schedule car viewing |

## 🎯 Sample Data

The app includes 6 dummy cars with realistic data:

1. **Honda City VX CVT 2020** - ₹12.5L (Live, 2 bids)
2. **Hyundai Creta SX(O) Diesel 2021** - ₹16.5L (Live)
3. **Maruti Suzuki Swift ZXI Plus 2019** - ₹6.5L (Live)
4. **Tata Nexon XZ+ Petrol 2022** - ₹13.2L (Live)
5. **Mahindra XUV700 AX7 Diesel AT 2023** - ₹24.5L (Live)
6. **Kia Seltos GTX Plus 2020** - ₹15.8L (Pending)

## 🔧 Customization Tips

### Change Brand Name
Edit `components/Navigation.tsx`:
```tsx
<span>AutoMarket</span> // Change to your brand
```

### Update Colors
Edit `tailwind.config.js`:
```js
primary: {
  600: '#0284c7', // Change to your brand color
}
```

### Modify Dummy Data
Edit `lib/dummyData.ts` to add/modify cars, users, and bids

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Deploy with one click

Or use Vercel CLI:
```bash
npm i -g vercel
vercel
```

## 💡 Pro Tips

1. **Test Mobile View** - Use browser DevTools or real device
2. **Check All Flows** - Test both buyer and seller journeys
3. **Interact with Bids** - Click notification badges on dashboard
4. **Try Filters** - Test search and filter combinations
5. **View Responsive Design** - Resize browser to see layout changes

## 🎨 UI Components

Reusable styling helpers live in `app/globals.css` and our `Button` component:

- `Button` (`components/Button/Button.tsx`) - primary/secondary/ghost variants
- `.input-field` - Form input styling
- `.card` - Container card
- `.badge-*` - Status badges

## 📱 Mobile Navigation

- **Desktop** - Top horizontal navigation
- **Mobile** - Bottom tab navigation (auto-detected)

## ⚡ Quick Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🎉 You're All Set!

The app is fully functional with dummy data. Explore all features, customize as needed, and integrate with your backend when ready!

**Need Help?** Check the main README.md for detailed documentation.

