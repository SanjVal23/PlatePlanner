#python classes
class User:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.logged_in = False

    def login(self, username, password):
        if not isinstance(username, str) or not isinstance(password, str):
            return "Incorrect Username or Password"
        if username == self.username and password == self.password:
            self.logged_in = True
            return "Welcome Back"
        return "Incorrect Username or Password"

    def logout(self):
        if self.logged_in:
            self.logged_in = False
            return "Successfully logged out"
        return "No active session to logout"

class CalorieTracker:
    def __init__(self):
        self.total_calories = 0

    def add_calories(self, calorie_amount):
        if not isinstance(calorie_amount, int):
            if isinstance(calorie_amount, float):
                return "Please input an integer value"
            else:
                return "Only numeric characters are allowed"

        self.total_calories += calorie_amount
        return f"Total Daily Calories: {self.total_calories}"


class RecipeStorage:
    def __init__(self):
        self.recipes = {}

    def add_recipe(self, name, calories):
        if not isinstance(name, str):
            return "Invalid recipe name"
        if not isinstance(calories, int):
            return "Calorie count must be integer"
        self.recipes[name] = calories
        return f"Recipe '{name}' stored successfully"

    def get_recipe(self, name):
        return self.recipes.get(name, "Recipe not found")
