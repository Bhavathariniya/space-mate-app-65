
import { Room, Meal, Notification, Hostel, Review, Payment, MealResponse } from "@/types";

// Mock Rooms Data
export const rooms: Room[] = [
  {
    id: "1",
    roomNumber: "101",
    capacity: 2,
    occupied: 1,
    type: "Standard Single",
    price: 8000,
    amenities: ["Attached Bathroom", "Study Table", "Cupboard", "AC"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    available: true,
  },
  {
    id: "2",
    roomNumber: "102",
    capacity: 2,
    occupied: 2,
    type: "Standard Double",
    price: 7000,
    amenities: ["Shared Bathroom", "Study Table", "Cupboard", "Fan"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    available: false,
  },
  {
    id: "3",
    roomNumber: "201",
    capacity: 1,
    occupied: 0,
    type: "Premium Single",
    price: 10000,
    amenities: ["Attached Bathroom", "Study Table", "Cupboard", "AC", "TV"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    available: true,
  },
  {
    id: "4",
    roomNumber: "202",
    capacity: 3,
    occupied: 2,
    type: "Triple Sharing",
    price: 6000,
    amenities: ["Shared Bathroom", "Study Table", "Cupboard", "Fan"],
    images: ["/placeholder.svg", "/placeholder.svg"],
    available: true,
  },
];

// Mock Meals Data
export const meals: Meal[] = [
  {
    id: "1",
    date: "2023-05-01",
    mealType: "breakfast",
    menu: "Poha, Upma, Fruits, Tea/Coffee",
    isActive: true,
  },
  {
    id: "2",
    date: "2023-05-01",
    mealType: "lunch",
    menu: "Rice, Dal, Roti, Vegetable Curry, Salad",
    isActive: true,
  },
  {
    id: "3",
    date: "2023-05-01",
    mealType: "dinner",
    menu: "Rice, Dal Fry, Roti, Paneer Curry, Sweet",
    isActive: true,
  },
  {
    id: "4",
    date: "2023-05-02",
    mealType: "breakfast",
    menu: "Paratha, Curd, Fruits, Tea/Coffee",
    isActive: true,
  },
  {
    id: "5",
    date: "2023-05-02",
    mealType: "lunch",
    menu: "Rice, Dal, Roti, Mixed Vegetable, Salad",
    isActive: true,
  },
  {
    id: "6",
    date: "2023-05-02",
    mealType: "dinner",
    menu: "Rice, Dal Tadka, Roti, Chicken Curry, Ice Cream",
    isActive: true,
  },
];

// Mock Meal Responses
export const mealResponses: MealResponse[] = [
  {
    id: "1",
    userId: "guest-1",
    mealId: "1",
    attending: true,
    response: "yes",
  },
  {
    id: "2",
    userId: "guest-1",
    mealId: "2",
    attending: true,
    response: "yes",
  },
  {
    id: "3",
    userId: "guest-1",
    mealId: "3",
    attending: false,
    response: "no",
  },
];

// Mock Notifications Data
export const notifications: Notification[] = [
  {
    id: "1",
    userId: "guest-1",
    title: "Dinner is Ready!",
    message: "Please come to the dining hall to have your dinner.",
    read: false,
    createdAt: "2023-05-01T18:30:00",
    type: "meal",
  },
  {
    id: "2",
    userId: "guest-1",
    title: "Payment Reminder",
    message: "Your monthly payment is due in 3 days.",
    read: true,
    createdAt: "2023-05-01T09:00:00",
    type: "payment",
  },
  {
    id: "3",
    userId: "guest-1",
    title: "Will you have dinner tonight?",
    message: "Please confirm if you will be having dinner tonight.",
    read: false,
    createdAt: "2023-05-01T15:00:00",
    type: "meal",
    requiresAction: true,
    actionId: "3",
  },
  {
    id: "4",
    userId: "admin-1",
    title: "New Booking Request",
    message: "A new guest has requested a room booking.",
    read: false,
    createdAt: "2023-05-01T10:15:00",
    type: "service",
  },
];

// Mock Hostel Data
export const hostel: Hostel = {
  id: "1",
  name: "Comfort PG Hostel",
  address: "123 Main Street",
  city: "Bangalore",
  description:
    "A premium PG hostel offering comfortable accommodation with all modern amenities for students and working professionals.",
  amenities: [
    "24/7 Security",
    "WiFi",
    "Laundry",
    "Housekeeping",
    "Power Backup",
    "Common TV Room",
    "Gym",
  ],
  rules: [
    "No smoking",
    "No alcohol",
    "Guests allowed till 8 PM",
    "Quiet hours 10 PM - 6 AM",
  ],
  images: [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ],
  logo: "/placeholder.svg",
  rating: 4.5,
  reviews: [
    {
      id: "1",
      userId: "user1",
      userName: "John Doe",
      rating: 5,
      comment: "Excellent facilities and food. Highly recommended!",
      date: "2023-04-10",
    },
    {
      id: "2",
      userId: "user2",
      userName: "Jane Smith",
      rating: 4,
      comment: "Good place to stay. Clean and well-maintained.",
      date: "2023-03-25",
    },
  ],
};

// Mock Payments Data
export const payments: Payment[] = [
  {
    id: "1",
    userId: "guest-1",
    amount: 8000,
    type: "monthly",
    status: "completed",
    date: "2023-04-01",
    description: "Monthly rent payment for April 2023",
  },
  {
    id: "2",
    userId: "guest-1",
    amount: 8000,
    type: "monthly",
    status: "pending",
    date: "2023-05-01",
    description: "Monthly rent payment for May 2023",
  },
  {
    id: "3",
    userId: "guest-1",
    amount: 2000,
    type: "service",
    status: "completed",
    date: "2023-04-15",
    description: "Additional service charges",
  },
];
