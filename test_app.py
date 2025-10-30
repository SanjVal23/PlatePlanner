import unittest
from main import User, CalorieTracker, RecipeStorage

class TestLoginLogout(unittest.TestCase):

    def setUp(self):
        self.user = User("goodexample123", "gpass12!")
    def test_valid_login(self):
        result = self.user.login("goodexample123", "gpass12!")
        self.assertEqual(result, "Welcome Back")
    def test_invalid_password(self):
        result = self.user.login("goodexample123", "wrongpas")
        self.assertEqual(result, "Incorrect Username or Password")

    def test_invalid_username(self):
        result = self.user.login("incorrectusername", "gpass12!")
        self.assertEqual(result, "Incorrect Username or Password")

    def test_invalid_type(self):
        result = self.user.login(3, "gpass12!")
        self.assertEqual(result, "Incorrect Username or Password")
    def test_logout_success(self):
        self.user.login("goodexample123", "gpass12!")
        result = self.user.logout()
        self.assertEqual(result, "Successfully logged out")

    def test_logout_no_session(self):
        result = self.user.logout()
        self.assertEqual(result, "No active session to logout")


class TestCalorieTracker(unittest.TestCase):

    def setUp(self):
        self.tracker = CalorieTracker()

    def test_valid_calorie_input(self):
        result = self.tracker.add_calories(35)
        self.assertEqual(result, "Total Daily Calories: 35")

    def test_invalid_decimal(self):
        result = self.tracker.add_calories(42.65)
        self.assertEqual(result, "Please input an integer value")

    def test_invalid_string(self):
        result = self.tracker.add_calories("-45qw")
        self.assertEqual(result, "Only numeric characters are allowed")


class TestRecipeStorage(unittest.TestCase):

    def setUp(self):
        self.store = RecipeStorage()
    def test_valid_recipe_add(self):
        result = self.store.add_recipe("Omelette", 250)
        self.assertEqual(result, "Recipe 'Omelette' stored successfully")

    def test_invalid_name(self):
        result = self.store.add_recipe(123, 250)
        self.assertEqual(result, "Invalid recipe name")

    def test_invalid_calorie_value(self):
        result = self.store.add_recipe("Pasta", "500")
        self.assertEqual(result, "Calorie count must be integer")

    def test_recipe_retrieval(self):
        self.store.add_recipe("Salad", 120)
        self.assertEqual(self.store.get_recipe("Salad"), 120)
    def test_recipe_not_found(self):
        self.assertEqual(self.store.get_recipe("Pizza"), "Recipe not found")


if __name__ == "__main__":
    unittest.main()
