const Food = require("./models/food");

const foodItems = require("./food-data.json");

async function seedDB() {
  try {
    await Food.deleteMany();
    console.log("collection deleted successfully");
    await Food.insertMany(foodItems);
    console.log("Food Items inserted.");
  } catch (error) {
    console.log(error);
  }
}

module.exports = seedDB;
