# python classes

class User:
    
    # initialising User objects
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.logged_in = False

    def login(self, username, password):
        
        # check if any of the inputs are not string
        if not isinstance(username, str) or not isinstance(password, str):
            return "Incorrect Username or Password"

        # check if password length is greater than 8
        if len(password) > 8:
            return "Incorrect Username or Password"

        # validating username and password
        if username == self.username and password == self.password:
            
            # setting status to logged in
            self.logged_in = True
            return "Welcome Back"
        
        return "Incorrect Username or Password"

    def logout(self, session_active, logout_request):

        # checking if session_active and logout_request are not bool
        if not isinstance(session_active, bool):
            return "Unexpected error"

        if not isinstance(logout_request, bool):
            return "Logout failed please try again"

        # logging out if user is logged in and requests to log out
        if session_active and logout_request:
             # setting status to logged out
            self.logged_in = False
            return "Logout successful"
        
        # not logging out if user is logged in and has not request to log out
        elif session_active and not logout_request:
            return "No logout action, user remains logged in"

        # error message if user user requests to log out without being logged in
        elif not session_active and logout_request:
            return "Invalid session please login"
        
        else:
            return "Invalid session"


class CalorieTracker:
    def __init__(self):
        self.total_calories = 0

    def add_calories(self, calorie_amount):
        # check for if input value is anything other than an integer
        if not isinstance(calorie_amount, int):
            
            # check for if input value is float
            if isinstance(calorie_amount, float):
                return "Please input an integer value"
            
            return "Only numeric characters are allowed"

        # updating calorie count
        self.total_calories += calorie_amount

        # returning updated calorie count
        return f"Total Daily Calories: {self.total_calories}"


class RecipeStorage:

    # defining valid image format and food categories
    VALID_IMAGE_FORMATS = ('.jpg', '.jpeg', '.png')
    VALID_CATEGORIES = ["Main Course", "Dessert", "Appetizer"]

    def __init__(self):
        # initiallising an empty dictionary to store recipies
        self.recipes = {}

    def add_recipe(self, title, instructions, image, category):

        # check if input is non-empty string
        if not isinstance(title, str) or title.strip() == "":
            return "Please enter recipe title"
        
        if not isinstance(instructions, str) or instructions.strip() == "":
            return "Please add instructions"

        # check if input is valid according to the vaid format and categories
        if not isinstance(image, str) or not image.lower().endswith(self.VALID_IMAGE_FORMATS):
            return "Invalid image format"
        
        if category not in self.VALID_CATEGORIES:
            return "Please select a category"
        
        # adding recipie to dictionary
        self.recipes[title] = {
            "instructions": instructions,
            "image": image,
            "category": category
        }

        # returning sucess message
        return "Recipe saved successfully"
