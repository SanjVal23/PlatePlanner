import json
import re

# written for phase 5


# python classes

class UserProfile:
    
    # initialising User objects
    def __init__(self, username, description, weight, height, allergies, calories, activity=None):

        # Validate inputs
        UserProfile.validate_username(username)
        UserProfile.validate_description(description)
        UserProfile.validate_weight(weight)
        UserProfile.validate_height(height)
        UserProfile.validate_allergies(allergies)
        UserProfile.validate_calories(calories)


        # Set data
        self.data = {
            "username": username,
            "description": description,
            "weight": weight,
            "height": height,
            "allergies": allergies,
            "calories": calories,
            "activity": activity
        }

    def __eq__(self, other):
        """Implements equality operator i.e. =="""

        # Compare keys
        if self.data.keys() != other.data.keys():
            return False

        # Compare contents of each key
        for key in self.data.keys():
            if self.data[key] != other.data[key]:
                return False
            
        return True

    def from_json(username):
        # TODO replace this and instead load from DB in the __init__ constructor
        filepath = f".\\stored_user_data\\{username}.json"

        with open(filepath, "+rt") as mf:
            data = json.load(mf)

        return UserProfile(
            username=data["username"], 
            description=data["description"], 
            weight=data["weight"], 
            height=data["height"], 
            activity=data["activity"], 
            allergies=data["allergies"], 
            calories=data["calories"]
        )

    def store_to_json(self):
        # TODO update this to store to DB
        filepath = f".\\stored_user_data\\{self.data['username']}.json"

        with open(filepath, "+xt") as mf:
            json.dump(self.data, mf, indent=4)


    def validate_username(username):
        if type(username) is not str:
            raise ValueError(f"Username can only be string, got type {type(username)}")
        
        if len(username) < 3 or len(username) > 20:
            raise ValueError(f"Username length has to be greater than 3 and smaller than 20")
        
        if not re.match(r'^[A-Za-z0-9_]+$', username):
            raise ValueError(f"Username should contain only alphanumeric and underscore characters")
        
        return True
    
    def validate_description(description):
        if type(description) is not str:
            raise ValueError(f"Description can only be string, got type {type(description)}")
        
        if len(description) > 200:
            raise ValueError(f"Description exeeding 200 character limit")

        for c in description:
            if ord(c)<32 or ord(c) > 126:
                raise ValueError(f"Description can only contain Unicode Basic Latin characters (i.e. alphanumeric, space, !\"#$%&'()*+,-./:;<=>?@[\\]^_`{{|}}~ )")
        
        return True
    
    def validate_weight(weight):
        if type(weight) is not float:
            raise ValueError(f"Weight can only be float, got type {type(weight)}")
        
        if weight < 3.0 or weight > 300.0:
            raise ValueError(f"Weight must be between 3 and 300 kg")
        
        return True
    
    def validate_height(height):
        if type(height) is not float:
            raise ValueError(f"Height can only be float, got type {type(height)}")
        
        if height < 50.0 or height > 250.0:
            raise ValueError(f"Height must be between 50 and 250 cm")
        
        return True
    
    def validate_allergies(allergies):
        if (type(allergies) is not list or not all(
            map(lambda e : type(e) == str, allergies)
        )):
            raise ValueError(f"Allergies should a string array")

        return True

    def validate_calories(calories):
        if type(calories) is not float:
            raise ValueError(f"Calories can only be float, got type {type(calories)}")
        
        if calories < 800.0 or calories > 5000.0:
            raise ValueError(f"Calories must be between 800 and 5000")
        
        return True




    
