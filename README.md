<div align="center">
<div
  style="
    width:80px;
    height:80px;
    display:flex;
    align-items:center;
    justify-content:center;
    background:linear-gradient(to top right,#802BB1,#bd6eff);
    border-radius:20px;
    color:white;
    margin:auto;
    box-shadow:0 18px 50px -35px rgba(128,43,177,0.85);
  "
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="38"
    height="38"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M3 9.5L12 3l9 6.5" />
    <path d="M5 10v10h14V10" />
    <path d="M9 20v-6h6v6" />
  </svg>
</div>

<br />
<br />
  <h1>RentHub - Modern Real Estate & Property Booking Platform</h1>
  
  <p>
    <strong>A premium, full-stack real estate web application built with Next.js.</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-14.x-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Razorpay-Payment-02042B?style=for-the-badge&logo=razorpay" alt="Razorpay" />
  </p>
</div>

<hr />

## 📖 Introduction
RentHub is a state-of-the-art property rental platform that seamlessly connects landlords with potential tenants. Featuring a breathtaking dark-themed UI (Glassmorphism & Neon accents), comprehensive dashboard management, advanced search filters, and an integrated booking and payment system using Razorpay.

## ✨ Key Features
- **Advanced Property Search:** Dynamic URL-based filtering allowing users to search by category, location, and price ranges instantly.
- **Integrated Booking System:** Book properties seamlessly. Checks for existing bookings to prevent overlaps. 
- **Razorpay Payments:** Secure payment gateway integration for monthly rent processing.
- **Interactive Image Galleries:** Beautiful, high-resolution masonry grid galleries for desktop and swipeable carousels for mobile.
- **Save to Wishlist:** Users can favorite and save properties for later, persisting to their unique accounts.
- **Owner Dashboard:** A complete CMS-like experience for landlords to Add, Edit, and Delete their property listings, view bookings, and manage subscriptions.
- **Fully Responsive:** Layouts gracefully degrade from high-resolution desktop grids to mobile-first accessible components.

<!-- ## 📸 Screenshots

| Browse Properties | Property Details |
| :---: | :---: |
| <img src="https://placehold.co/600x400/030711/802BB1?text=Browse+Page" alt="Browse Page" width="100%" /> | <img src="https://placehold.co/600x400/030711/802BB1?text=Gallery+Layout" alt="Property Details" width="100%" /> |

| User Dashboard | Checkout Flow |
| :---: | :---: |
| <img src="https://placehold.co/600x400/030711/802BB1?text=Owner+Dashboard" alt="Dashboard" width="100%" /> | <img src="https://placehold.co/600x400/030711/802BB1?text=Payment+Integration" alt="Checkout" width="100%" /> |

*Replace placeholder images with actual high-quality screenshots before production.* -->

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 
- **Library:** React 18
- **Styling:** Tailwind CSS 
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend
- **API:** Next.js Serverless Route Handlers
- **Database:** MongoDB Atlas (Mongoose)
- **Auth:** Custom JWT / Session Management via standard cookies
- **Payments:** Razorpay API Node SDK
- **Image Handling:** Next/Image optimized loading, Cloudinary

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Smitbhuva15/rental-webapp.git
   cd renthub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔐 Authentication & Payments
- **Secure Sessions:** Built with HTTP-only cookies and JWTs. Protected routes enforce strict authorization checks.
- **Razorpay Integration:** The application triggers Razorpay's checkout modal directly from the property details page. Server-side signature verification is implemented to prevent tampering and secure transaction callbacks.

## 📅 Booking & Management System
- **Overlap Prevention:** The database checks existing `Booking` documents against requested date ranges to disable UI elements for unavailable dates.
- **Landlord Access:** Users can only upload listings if their subscription is active. Landlords cannot book their own houses and are presented with an "Edit Property" shortcut instead.


## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

