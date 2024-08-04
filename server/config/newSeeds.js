const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const db = require("./connection");
const { User, Product, Category, Auction } = require('../models'); // Import necessary models

const cleanDB = async () => {
  await User.deleteMany();
  await Product.deleteMany();
  await Category.deleteMany();
  await Auction.deleteMany();
};

const seedCategories = async () => {
  const categories = await Category.insertMany([
    { name: "Food" },
    { name: "Household Supplies" },
    { name: "Electronics" },
    { name: "Books" },
    { name: "Toys" },
  ]);

  console.log("categories seeded");

};

const seedData = async () => {
  await cleanDB();

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
  const categories = await Category.find();
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

  console.log('Seed data inserted successfully.');
};

const seedAuctions = async () => {
  const products = await Product.find();

  for (let i = 0; i < 5; i++) {
    const auction = new Auction({
      product: products[Math.floor(Math.random() * products.length)]._id,
      startTime: faker.date.recent(),
      endTime: faker.date.future(),
      startingPrice: faker.finance.amount(),
      bids: [],
      status: "Active",
    });
    await auction.save();
  }

  console.log('Auctions seeded successfully.');
};

db.once("open", async () => {
  await seedCategories();
  await seedData();
  await seedAuctions();
});

