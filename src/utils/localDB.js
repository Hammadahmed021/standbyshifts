import img from "../assets/Images/restaurant-image.png";
import {
  menu,
  ImgA2,
  ImgA4,
  ImgA5,
  ImgA1,
  ImgB,
  ImgB1,
  like,
  bubble,
  support,
  messages,
  trendUp,
  grammerly,
  task,
  people as peeps,
  layout1,
  layout2,
  layout3,
  layout4,
} from "../assets";

export const imageData = [
  { src: ImgA1 },
  { src: ImgA2 },
  { src: ImgB1 },
  { src: ImgB },
  { src: ImgA4 },
  { src: ImgA5 },
];

export const layoutOptions = [
  {
    id: "1",
    label: "Layout 1",
    imageUrl: layout1,
  },
  {
    id: "2",
    label: "Layout 2",
    imageUrl: layout2,
  },
  {
    id: "3",
    label: "Layout 3",
    imageUrl: layout3,
  },
  {
    id: "4",
    label: "Layout 4",
    imageUrl: layout4,
  },
];

export const infoGrid = [
  {
    icon: bubble,
    title: "Connect.",
    description:
      "It is a long established fact that a reader will be distracted by.",
  },
  {
    icon: messages,
    title: "Find and Fill Shifts.",
    description:
      "It is a long established fact that a reader will be distracted by.",
  },
  {
    icon: like,
    title: "Set your schedule.",
    description:
      "It is a long established fact that a reader will be distracted by.",
  },
  {
    icon: support,
    title: "Rate Your Experience.",
    description:
      "It is a long established fact that a reader will be distracted by.",
  },
];
export const testimonial = [
  {
    text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
];
export const revenueGrid = [
  {
    icon: trendUp,
    title: "Make Meaningful Connections.",
    description:
      "It is a long established fact that a reader will be distracted by the readable content.",
  },
  {
    icon: peeps,
    title: "Find Shifts that Fit Your Schedule.",
    description:
      "It is a long established fact that a reader will be distracted by the readable content.",
  },
  {
    icon: grammerly,
    title: "Find Shift Seekers that Want to Work.",
    description:
      "It is a long established fact that a reader will be distracted by the readable content.",
  },
  {
    icon: task,
    title: "Take Charge of your Workforce Experience.",
    description:
      "It is a long established fact that a reader will be distracted by the readable content.",
  },
];

export const employer = [
  {
    image: "https://via.placeholder.com/150",
    title: "John Doe",
    subheading: "Software Engineer",
  },
  {
    image: "https://via.placeholder.com/150",
    title: "Jane Smith",
    subheading: "Product Manager",
  },
  {
    image: "https://via.placeholder.com/150",
    title: "Michael Brown",
    subheading: "Designer",
  },
  // Add more employee objects as needed
];

export const employees = [
  {
    image: "https://via.placeholder.com/150",
    title: "John Doe",
    subheading: "Software Engineer",
    rating: 4.5,
  },
  {
    image: "https://via.placeholder.com/150",
    title: "Jane Smith",
    subheading: "Product Manager",
    rating: 4.8,
  },
  {
    image: "https://via.placeholder.com/150",
    title: "Michael Brown",
    subheading: "Designer",
    rating: 4.2,
  },
  // Add more employee objects as needed
];

export const localDB = [
  {
    id: 1,
    title: "Yosemite National Restaurant",
    location: "Groveland, California",
    rating: 4.5,
    cuisine: "Italian",
    timeline: ["Lunch", "Dinner", "Late Night"],
    type: "featured",
    images: [img, img, img, img],
  },
  {
    id: 2,
    title: "Yosemite National Restaurant",
    location: "Groveland, California",
    rating: 4.5,
    cuisine: "Italian",
    timeline: ["Lunch", "Dinner", "Late Night"],
    type: "featured",
    images: [img, img, img, img],
  },
  {
    id: 3,
    title: "Yosemite National Restaurant",
    location: "Groveland, California",
    rating: 4.5,
    cuisine: "Italian",
    timeline: ["Lunch", "Dinner", "Late Night"],
    type: "featured",
    images: [img, img, img, img],
  },
  {
    id: 4,
    title: "Yosemite National Restaurant",
    location: "Groveland, California",
    rating: 4.5,
    cuisine: "Italian",
    timeline: ["Lunch", "Dinner", "Late Night"],
    type: "featured",
    images: [img, img, img, img],
  },
  {
    id: 5,
    title: "Yosemite National Restaurant",
    location: "Groveland, California",
    rating: 4.5,
    cuisine: "Italian",
    timeline: ["Lunch", "Dinner", "Late Night"],
    type: "featured",
    images: [img, img, img, img],
  },
  {
    id: 6,
    title: "Yosemite National Restaurant",
    location: "Groveland, California",
    rating: 4.5,
    cuisine: "Italian",
    timeline: ["Lunch", "Dinner", "Late Night"],
    type: "featured",
    images: [img, img, img, img],
  },
  {
    id: 7,
    title: "Yosemite National Restaurant",
    location: "Groveland, California",
    rating: 4.5,
    cuisine: "Italian",
    timeline: ["Lunch", "Dinner", "Late Night"],
    type: "featured",
    images: [img, img, img, img],
  },
  {
    id: 8,
    title: "Yosemite National Restaurant",
    location: "Groveland, California",
    rating: 4.5,
    cuisine: "Italian",
    timeline: ["Lunch", "Dinner", "Late Night"],
    type: "featured",
    images: [img, img, img, img],
  },
];

export const infoLinks = {
  "Find Employee": "/",
  "Find Employer": "/",
  // "Register": "/",
  // "Login": "/",
};

export const supportLinks = {
  // "Privacy Policy": "/privacy-policy",
  // About: "/about",
  Contact: "/contact",
};

export const menus = [
  {
    id: 0,
    image: menu,
    type: "Hot cakes",
    name: "Hot caketerías",
    detail: "Incluye dos toppics",
    duration: "20-30 min",
    price: "70",
  },
  {
    id: 1,
    image: menu,
    type: "Continental",
    name: "Desayunos",
    detail: "Incluye dos toppics",
    duration: "20-30 min",
    price: "70",
  },
  {
    id: 2,
    image: menu,
    type: "Continental",
    name: "Desayunos Bread With Extra top",
    detail: "Incluye dos toppics",
    duration: "20-30 min",
    price: "70",
  },
  {
    id: 3,
    image: menu,
    type: "Continental",
    name: "Desayunos Soft",
    detail: "Incluye dos toppics",
    duration: "20-30 min",
    price: "70",
  },
];

export const dates = [
  { id: "2024-06-24", name: "June 24, 2024" },
  { id: "2024-06-25", name: "June 25, 2024" },
  { id: "2024-06-26", name: "June 26, 2024" },
  // add more dates as needed
];

export const times = [
  { id: "10:00", name: "10:00 AM" },
  { id: "12:00", name: "12:00 PM" },
  { id: "14:00", name: "02:00 PM" },
  // add more times as needed
];

export const people = [
  { id: "1", name: "1 person" },
  { id: "2", name: "2 people" },
  { id: "3", name: "3 people" },
  // add more options as needed
];

export const city = [
  { id: "melbourne", name: "Melbourne" },
  { id: "sydney", name: "Sydney" },
];

export const cuisine = [
  { id: "chinese", name: "Chinese" },
  { id: "italian", name: "Italian" },
  { id: "thai", name: "Thai" },
  { id: "indian", name: "Indian" },
  { id: "french", name: "French" },
];

export const guest = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
];

export const facilities = [
  { id: "kids_play_area", name: "Kids Play Area" },
  { id: "rest_rooms", name: "Rest Rooms" },
  { id: "handicap_people", name: "Handicap People" },
  { id: "air_conditioned", name: "Air Conditioned" },
  { id: "ambience", name: "Ambience" },
  { id: "pool_side", name: "Pool Side" },
  { id: "indoor_area", name: "Indoor Area" },
  { id: "outdoor_area", name: "Outdoor Area" },
];
