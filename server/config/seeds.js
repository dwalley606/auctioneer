const db = require("./connection");
const { User, Product, Category } = require("../models");
const cleanDB = require("./cleanDB");

db.once("open", async () => {
  try {
    await cleanDB("Category", "categories");
    await cleanDB("Product", "products");
    await cleanDB("User", "users");

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

    const users = await User.insertMany([
      {
        username: "pamela",
        firstName: "Pamela",
        lastName: "Washington",
        email: "pamela@testmail.com",
        password: "password12345",
      },
      {
        username: "elijah",
        firstName: "Elijah",
        lastName: "Holt",
        email: "eholt@testmail.com",
        password: "password12345",
      },
    ]);

    console.log("Users seeded");

    const { default: mockProducts } = await import(
      "../../client/src/components/ProductList/mockProducts.js"
    );

    const categoryMapping = {
      beauty: "Clothing, Shoes & Accessories",
      fragrances: "Clothing, Shoes & Accessories",
      furniture: "Toys & Hobbies",
      groceries: "Toys & Hobbies",
      "home-improvement": "Toys & Hobbies",
    };

    const findCategoryByName = (name) => {
      const categoryName = categoryMapping[name.toLowerCase()];
      const category = categories.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      return category ? category._id : null;
    };

    const products = mockProducts.products
      .map((product, index) => {
        const categoryId = findCategoryByName(product.category);
        if (!categoryId) {
          console.error(`Category not found for product: ${product.title}`);
          return null;
        }
        return {
          id: product.id,
          name: product.title,
          category: categoryId,
          description: product.description,
          image: product.thumbnail,
          price: product.price,
          quantity: product.stock,
          seller: users[index % users.length]._id,
        };
      })
      .filter((product) => product !== null);

    await Product.insertMany(products);

    console.log("Products seeded");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
});
