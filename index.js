import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    // Fetch recipes based on the main ingredient (e.g., chicken)
    const ingredient = req.query.ingredient; // assuming the ingredient is passed as a query parameter
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
    const recipes = response.data.meals;
    res.render("index", { recipes });
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
    res.render("error", { message: "Error fetching recipes" });
  }
});

app.get("/meals/:id", async (req, res) => {
  try {
    const mealId = req.params.id;
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const mealDetails = response.data.meals[0]; // Assuming the API response contains meal details
    res.render("meal-details", { mealDetails });
  } catch (error) {
    console.error("Failed to fetch meal details:", error.message);
    res.status(500).send("Failed to fetch meal details");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
