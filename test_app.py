import unittest

from main import User, CalorieTracker, RecipeStorage

# testcases for Login function
class TestLogin(unittest.TestCase):

    # initialising User object for testing
    def setUp(self):
        self.user = User("goodexample123", "gpass12!")

    # testcase for valid username and password
    def test_valid_login(self):
        result = self.user.login("goodexample123", "gpass12!")
        self.assertEqual(result, "Welcome Back")

    # testcase for valid username and invalid password
    def test_invalid_password(self):
        result = self.user.login("goodexample123", "wrongpas")
        self.assertEqual(result, "Incorrect Username or Password")

    # testcase for long password (exceeding 8 characters)
    def test_long_password(self):
        result = self.user.login("goodexample123", "worstpassword2long")
        self.assertEqual(result, "Incorrect Username or Password")

    # testcase for invalid username and valid password
    def test_invalid_username(self):
        result = self.user.login("incorrectusername", "gpass12!")
        self.assertEqual(result, "Incorrect Username or Password")

    # testcase for invalid username and password
    def test_invalid_type(self):
        result = self.user.login(3, "gpass12!")
        self.assertEqual(result, "Incorrect Username or Password")

# testcases for Logout function
class TestLogout(unittest.TestCase):
    
    # initialising User object for testing
    def setUp(self):
        self.user = User("goodexample123", "gpass12!")

    # testcase for a active session where logout is requested
    def test_valid_logout(self):
        result = self.user.logout(True, True)
        self.assertEqual(result, "Logout successful")

    # testcase for active session where no logout is requested
    def test_no_logout_action(self):
        result = self.user.logout(True, False)
        self.assertEqual(result, "No logout action, user remains logged in")

    # testcase for an inactive session (not logged in) where logout is requested
    def test_invalid_session_login(self):
        result = self.user.logout(False, True)
        self.assertEqual(result, "Invalid session please login")

    # testcase for an inactive session where logout is not requested
    def test_invalid_session_no_action(self):
        result = self.user.logout(False, False)
        self.assertEqual(result, "Invalid session")

    # testcase for a active session where an invalid logout is requested (string)
    def test_exception_case(self):
        result = self.user.logout(True, "network issue")
        self.assertEqual(result, "Logout failed please try again")

# testcases for Calorie tracker function
class TestCalorieTracker(unittest.TestCase):
    
    # initialising CalorieTracker object for testing
    def setUp(self):
        self.tracker = CalorieTracker()

    # test case for valid calorie input (integer)
    def test_valid_calories(self):
        result = self.tracker.add_calories(35)
        self.assertEqual(result, "Total Daily Calories: 35")

    # test case for invalid calorie input (decimal/float value)
    def test_invalid_decimal(self):
        result = self.tracker.add_calories(42.65)
        self.assertEqual(result, "Please input an integer value")

    # test case for invalid calorie input (non-numeric value)
    def test_invalid_non_numeric(self):
        result = self.tracker.add_calories("-45qw")
        self.assertEqual(result, "Only numeric characters are allowed")

# testcases for Recipe Storage function
class TestRecipeStorage(unittest.TestCase):

    # initialising RecipeStorage object for testing
    def setUp(self):
        self.store = RecipeStorage()

    # test case for all valid inputs
    def test_valid_recipe(self):
        result = self.store.add_recipe(
            "Baked Chicken Tacos",
            "Preheat oven, fill taco shells with chicken, taco ingredients, bake 10 min",
            "tacos.jpg",
            "Main Course"
        )
        self.assertEqual(result, "Recipe saved successfully")

    # test case for invalid (empty) title
    def test_empty_title(self):
        result = self.store.add_recipe(
            "",
            "Preheat oven, fill taco shells …",
            "tacos.jpg",
            "Main Course"
        )
        self.assertEqual(result, "Please enter recipe title")

    # test case for invalid (empty) instructions
    def test_empty_instructions(self):
        result = self.store.add_recipe(
            "Baked Chicken Tacos",
            "",
            "tacos.jpg",
            "Main Course"
        )
        self.assertEqual(result, "Please add instructions")

    # test case for invalid image format
    def test_invalid_image_format(self):
        result = self.store.add_recipe(
            "Baked Chicken Tacos",
            "Preheat oven, fill taco shells with chicken, taco ingredients, bake 10 min",
            "tacos.txt",
            "Main Course"
        )
        self.assertEqual(result, "Invalid image format")

    # test case for invalid food category
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

