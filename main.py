#python classes

class User:
    def __init__(self, username, password):
        self.username = username

        self.password = password
        self.logged_in = False

    def login(self, username, password):
        if not isinstance(username, str) or not isinstance(password, str):
            return "Incorrect Username or Password"
        
        if len(password) > 8:
            return "Incorrect Username or Password"
        
        if username == self.username and password == self.password:
            self.logged_in = True
            return "Welcome Back"
        
        return "Incorrect Username or Password"

    def logout(self, session_active, logout_request):
        if not isinstance(session_active, bool):
            return "Unexpected error"
        

        if not isinstance(logout_request, bool):
            return "Logout failed please try again"

        if session_active and logout_request:
            self.logged_in = False
            return "Logout successful"
        

        elif session_active and not logout_request:
            return "No logout action, user remains logged in"
        
        elif not session_active and logout_request:
            return "Invalid session please login"
        

        else:
            return "Invalid session"


class CalorieTracker:
    def __init__(self):
        self.total_calories = 0

    def add_calories(self, calorie_amount):

        if not isinstance(calorie_amount, int):

            if isinstance(calorie_amount, float):
                return "Please input an integer value"
            
            return "Only numeric characters are allowed"
        
        self.total_calories += calorie_amount

        return f"Total Daily Calories: {self.total_calories}"


class RecipeStorage:

    VALID_IMAGE_FORMATS = ('.jpg', '.jpeg', '.png')

    VALID_CATEGORIES = ["Main Course", "Dessert", "Appetizer"]

    def __init__(self):

        self.recipes = {}

    def add_recipe(self, title, instructions, image, category):

        if not isinstance(title, str) or title.strip() == "":
            return "Please enter recipe title"
        
        if not isinstance(instructions, str) or instructions.strip() == "":
            return "Please add instructions"
        
        if not isinstance(image, str) or not image.lower().endswith(self.VALID_IMAGE_FORMATS):
            return "Invalid image format"
        
        if category not in self.VALID_CATEGORIES:
            return "Please select a category"
        

        self.recipes[title] = {
            "instructions": instructions,
            "image": image,
            "category": category
        }
        return "Recipe saved successfully"
