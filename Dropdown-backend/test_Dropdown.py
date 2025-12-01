import os
import unittest
import json
from contextlib import contextmanager

from Dropdown import Dropdown, MultiSelectDropdown

# written for phase 5


# Helpers
kill = lambda filepath :  os.remove(filepath)


# Wrapper to set up & tear down for Dropdown tests
@contextmanager
def Dropdown_wrapper(test_vars):
    pass

# testcases for dropdown class
class TestDropdown(unittest.TestCase):
    test_vars = {
        "test_options": [
            "test 1",
            "test 2",
            "test 3",
        ]
    }
    
    # initialising dropdown object for testing
    @Dropdown_wrapper(test_vars)
    def test_create_dropdown(self):
        self.user = Dropdown(options=self.test_vars["test_options"])
        yield


if __name__ == "__main__":
    unittest.main()