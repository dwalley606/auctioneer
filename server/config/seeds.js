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
      beauty: {
        category: "Clothing, Shoes & Accessories",
        subcategory: "Men's Clothing",
      },
      fragrances: {
        category: "Clothing, Shoes & Accessories",
        subcategory: "Women's Clothing",
      },
      furniture: {
        category: "Toys & Hobbies",
        subcategory: "Indoor",
      },
      groceries: {
        category: "Toys & Hobbies",
        subcategory: "Outdoor",
      },
      "home-improvement": {
        category: "Toys & Hobbies",
        subcategory: "Outdoor",
      },
    };

    const findCategoryAndSubcategoryByName = (name) => {
      const mapping = categoryMapping[name.toLowerCase()];
      if (!mapping) return { categoryId: null, subcategoryId: null };

      const category = categories.find(
        (cat) => cat.name.toLowerCase() === mapping.category.toLowerCase()
      );
      if (!category) return { categoryId: null, subcategoryId: null };

      const subcategory = category.subcategories.find(
        (subcat) =>
          subcat.name.toLowerCase() === mapping.subcategory.toLowerCase()
      );
      return {
        categoryId: category._id.toString(),
        subcategoryId: subcategory ? subcategory._id.toString() : null,
      };
    };

    const products = mockProducts.products
      .map((product, index) => {
        const { categoryId, subcategoryId } = findCategoryAndSubcategoryByName(
          product.category
        );
        if (!categoryId || !subcategoryId) {
          console.error(
            `Category or Subcategory not found for product: ${product.title}`
          );
          return null;
        }
        return {
          id: product.id,
          name: product.title,
          category: categoryId,
          subcategory: subcategoryId,
          description: product.description,
          image: product.thumbnail,
          price: product.price,
          quantity: product.stock,
          seller: users[index % users.length]._id.toString(),
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
