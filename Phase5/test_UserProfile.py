import os
import unittest
import json
from contextlib import contextmanager

from UserProfile import UserProfile

# written for phase 5


# Helpers
kill = lambda filepath :  os.remove(filepath)


# Wrapper to set up & tear down for UserProfile tests
@contextmanager
def UserProfile_wrapper(test_vars):
    # Get test vars
    test_username       = test_vars["test_username"]
    test_user_file_path = test_vars["test_user_file_path"]
    test_user_object    = test_vars["test_user_object"]

    # Prepare filepath for test file
    try:
        kill(test_user_file_path)
        print(f"The file {test_user_file_path} has been eliminated.")
    except:
        pass
    
    os.makedirs("stored_user_data", exist_ok=True)

    # Create test json
    with open(test_user_file_path, "xt") as mf:
        json.dump(test_user_object, mf, indent=4)

    try:
        # Run test
        yield
    finally:
        # Clean up
        kill(test_user_file_path)

# testcases for UserProfile class
class TestUserProfile(unittest.TestCase):
    test_vars = {
        "test_username": "tasty",
        "test_user_file_path": f"./stored_user_data/tasty.json",
        "test_user_object": {
            "username": "username",
            "description": "description",
            "weight": 3.0,
            "height": 50.0,
            "activity": "activity",
            "allergies": ["peanut", "milk"],
            "calories": 800.0
        }
    }

    # Individual testcases for UserProfile functions

    @UserProfile_wrapper(test_vars)
    def test_from_json(self):
        user_from_json = UserProfile.from_json(self.test_vars["test_username"])
        user_from_constructor = UserProfile(
            username=self.test_vars["test_user_object"]["username"], 
            description=self.test_vars["test_user_object"]["description"], 
            weight=self.test_vars["test_user_object"]["weight"], 
            height=self.test_vars["test_user_object"]["height"], 
            activity=self.test_vars["test_user_object"]["activity"], 
            allergies=self.test_vars["test_user_object"]["allergies"], 
            calories=self.test_vars["test_user_object"]["calories"]
        )
        self.assertEqual(user_from_json, user_from_constructor)

    # username validation
    def test_valid_username(self):
        result = UserProfile.validate_username("John_D4")
        self.assertEqual(result, True)

    def test_invalid_username(self):
        self.assertRaises(ValueError, UserProfile.validate_username, "J0hn!4")
        
    # description validation
    def test_valid_description(self):
        result = UserProfile.validate_description("Student who enjoys fitness and cooking")
        self.assertEqual(result, True)

    def test_invalid_description(self):
        self.assertRaises(ValueError, UserProfile.validate_description, "Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo. The quick brown fox ran and then jumped over the lazy dog. Crazy? I was crazy once. They locked me in a room. A rubber room. A rubber room with rats. And rats make me crazy. Crazy? I was crazy once")

    # weight validation
    def test_valid_weight(self):
        result = UserProfile.validate_weight(55.0)
        self.assertEqual(result, True)

    def test_invalid_weight(self):
        self.assertRaises(ValueError, UserProfile.validate_weight, -20)

    # height validation
    def test_valid_height(self):
        result = UserProfile.validate_height(165.0)
        self.assertEqual(result, True)

    def test_invalid_height(self):
        self.assertRaises(ValueError, UserProfile.validate_height, 255)

    # allergies validation
    def test_valid_allergies(self):
        result = UserProfile.validate_allergies(["Vegetarian"])
        self.assertEqual(result, True)

    def test_invalid_allergies(self):
        self.assertRaises(ValueError, UserProfile.validate_allergies, "")

    # calories validation
    def test_valid_calories(self):
        result = UserProfile.validate_calories(2000.0)
        self.assertEqual(result, True)

    def test_invalid_calories(self):
        self.assertRaises(ValueError, UserProfile.validate_calories, 700)


if __name__ == "__main__":
    unittest.main()
