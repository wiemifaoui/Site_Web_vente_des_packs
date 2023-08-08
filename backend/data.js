import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "Wiem",
      email: "admin@example.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: true,
    },
    {
      name: "John",
      email: "user@example.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: false,
    },
  ],
  packs: [
    {
      // _id: "1",
      name: "pack bicyclette et jeux",
      slug: "pack bicyclette et jeux",
      category: "pack janah",
      image: "/images/p1.jpg", // 679px × 829px
      price: 120,
      countInStock: 10,
      brand: "good barand",
      rating: 4.5,
      numReviews: 10,
      description: "high quality pack",
    },
    {
      // _id: "2",
      name: "trantinette electrique et jeux",
      slug: "trantinette electrique et jeux",
      category: "pack janah",
      image: "/images/p2.jpg", // 679px × 829px
      price: 120,
      countInStock: 10,
      brand: "good barand",
      rating: 4.5,
      numReviews: 10,
      description: "high quality pack",
    },
    {
      // _id: "3",
      name: "pack ecouter musique et lire un livre",
      slug: "pack ecouter musique et lire un livre",
      category: "pack janah",
      image: "/images/p3.avif ", // 679px × 829px
      price: 120,
      countInStock: 10,
      brand: "good barand",
      rating: 4.5,
      numReviews: 10,
      description: "high quality pack",
    },
    {
      // _id: "4",
      name: "pack demmander des information et visite 3D",
      slug: "pack demmander des information et visite 3D",
      category: "pack janah",
      image: "/images/p4.jpg", // 679px × 829px
      price: 250,
      countInStock: 0,
      brand: "good barand",
      rating: 4.5,
      numReviews: 10,
      description: "high quality pack",
    },
    {
      // _id: "4",
      name: "pack demmander des information et visite 3D",
      slug: "pack demmander des information et visite 3D",
      category: "pack janah",
      image: "/images/p4.jpg", // 679px × 829px
      price: 250,
      countInStock: 0,
      brand: "good barand",
      rating: 4.5,
      numReviews: 10,
      description: "high quality pack",
    },
  ],
};

export default data;
