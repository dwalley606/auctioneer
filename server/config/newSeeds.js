const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const db = require("./connection");
const cleanDB = require("./cleanDB");
const { User, Product, Category, Auction } = require('../models'); // Import necessary models

db.once("open", async () => {
  try {
    await cleanDB("Category", "categories");
    await cleanDB("Product", "products");
    await cleanDB("User", "users");
    await cleanDB("Auction", "auctions");

    const categories = await Category.insertMany([
      {
        name: "Clothing, Shoes & Accessories",
        subcategories: [
          { name: "Men's Clothing" },
          { name: "Women's Clothing" },
          { name: "Shoes" },
        ],
      },
      {
        name: "Sporting Goods",
        subcategories: [{ name: "Outdoor Sports" }, { name: "Indoor Sports" }],
      },
      {
        name: "Electronics",
        subcategories: [{ name: "Computers" }, { name: "Mobile Devices" }],
      },
      {
        name: "Toys & Hobbies",
        subcategories: [{ name: "Outdoor" }, { name: "Indoor" }],
      },
      {
        name: "Books, Movies, Music",
        subcategories: [
          { name: "Books" },
          { name: "Movies" },
          { name: "Music" },
        ],
      },
      {
        name: "Jewelry",
        subcategories: [
          { name: "Rings" },
          { name: "Bracelets" },
          { name: "Earrings" },
        ],
      },
    ]);
    console.log("Categories seeded");

    // Seed Users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const user = new User({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: await bcrypt.hash(faker.internet.password(), 10),
        photoUrl: faker.image.avatar(),
        googleId: faker.string.alphanumeric({ length: 16 }),
      });
    users.push(user);
    await user.save();
    }

    // Seed Products
    console.log(categories);
    const sellers = await User.find();
    const products = [];
    for (let i = 0; i < 5; i++) {
      const product = new Product({
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        image: faker.image.url(),
        quantity: faker.string.numeric(3),
        price: faker.finance.amount(),
        category: categories[Math.floor(Math.random() * categories.length)]._id,
        seller: sellers[Math.floor(Math.random() * sellers.length)]._id,
      });
      products.push(product);
      await product.save();
    }
  } catch (error) {
  console.error("Error seeding data", error);
  process.exit(1);
  }
});


// const seedAuctions = async () => {
//   const products = await Product.find();

//   for (let i = 0; i < 5; i++) {
//     const auction = new Auction({
//       product: products[Math.floor(Math.random() * products.length)]._id,
//       startTime: faker.date.recent(),
//       endTime: faker.date.future(),
//       startingPrice: faker.finance.amount(),
//       bids: [],
//       status: "Active",
//     });
//     await auction.save();
//   }

//   console.log('Auctions seeded successfully.');
// };

// db.once("open", async () => {

// });

