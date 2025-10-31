
import unittest

from main import User, CalorieTracker, RecipeStorage

class TestLogin(unittest.TestCase):
    def setUp(self):
        self.user = User("goodexample123", "gpass12!")

    def test_valid_login(self):
        result = self.user.login("goodexample123", "gpass12!")
        self.assertEqual(result, "Welcome Back")

    def test_invalid_password(self):
        result = self.user.login("goodexample123", "wrongpas")
        self.assertEqual(result, "Incorrect Username or Password")

    def test_long_password(self):
        result = self.user.login("goodexample123", "worstpassword2long")
        self.assertEqual(result, "Incorrect Username or Password")

    def test_invalid_username(self):
        result = self.user.login("incorrectusername", "gpass12!")
        self.assertEqual(result, "Incorrect Username or Password")

    def test_invalid_type(self):
        result = self.user.login(3, "gpass12!")
        self.assertEqual(result, "Incorrect Username or Password")


class TestLogout(unittest.TestCase):
    def setUp(self):
        self.user = User("goodexample123", "gpass12!")

    def test_valid_logout(self):
        result = self.user.logout(True, True)
        self.assertEqual(result, "Logout successful")

    def test_no_logout_action(self):
        result = self.user.logout(True, False)
        self.assertEqual(result, "No logout action, user remains logged in")

    def test_invalid_session_login(self):
        result = self.user.logout(False, True)
        self.assertEqual(result, "Invalid session please login")

    def test_invalid_session_no_action(self):
        result = self.user.logout(False, False)
        self.assertEqual(result, "Invalid session")

    def test_exception_case(self):
        result = self.user.logout(True, "network issue")

        self.assertEqual(result, "Logout failed please try again")


class TestCalorieTracker(unittest.TestCase):
    def setUp(self):
        self.tracker = CalorieTracker()

    def test_valid_calories(self):
        result = self.tracker.add_calories(35)
        self.assertEqual(result, "Total Daily Calories: 35")

    def test_invalid_decimal(self):
        result = self.tracker.add_calories(42.65)
        self.assertEqual(result, "Please input an integer value")

    def test_invalid_non_numeric(self):
        result = self.tracker.add_calories("-45qw")
        self.assertEqual(result, "Only numeric characters are allowed")


class TestRecipeStorage(unittest.TestCase):
    def setUp(self):
        self.store = RecipeStorage()

    def test_valid_recipe(self):
        result = self.store.add_recipe(
            "Baked Chicken Tacos",
            "Preheat oven, fill taco shells with chicken, taco ingredients, bake 10 min",
            "tacos.jpg",
            "Main Course"
        )
        self.assertEqual(result, "Recipe saved successfully")

    def test_empty_title(self):
        result = self.store.add_recipe(
            "",
            "Preheat oven, fill taco shells …",
            "tacos.jpg",
            "Main Course"
        )
        self.assertEqual(result, "Please enter recipe title")

    def test_empty_instructions(self):
        result = self.store.add_recipe(
            "Baked Chicken Tacos",
            "",
            "tacos.jpg",
            "Main Course"
        )
        self.assertEqual(result, "Please add instructions")

    def test_invalid_image_format(self):
        result = self.store.add_recipe(
            "Baked Chicken Tacos",
            "Preheat oven, fill taco shells with chicken, taco ingredients, bake 10 min",
            "tacos.txt",
            "Main Course"
        )
        self.assertEqual(result, "Invalid image format")

    def test_invalid_category(self):
        result = self.store.add_recipe(
            "Baked Chicken Tacos",
            "Preheat oven, fill taco shells with chicken, taco ingredients, bake 10 min",
            "tacos.jpg",
            "Snacky food"
        )
        self.assertEqual(result, "Please select a category")

    def test_failed_save(self):
        result = self.store.add_recipe(
            "Baked Chicken Tacos",
            "Preheat oven, fill taco shells with chicken, taco ingredients, bake 10 min",
            "tacos.jpg",
            "Main Course"
        )
        self.assertEqual(result, "Recipe saved successfully")


if __name__ == "__main__":
    unittest.main()

