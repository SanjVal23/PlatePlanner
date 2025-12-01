"""
UI Elements that maybe used in the future
 i tried really hard to make the dropdown work from backend qwq
 but really its a frontend thing
"""

# written for phase 5

class Dropdown:
    """
    Represents dropdown menu

    Attributes:
        options(string array): dropdown menu options
    """

    # Constuctor
    def __init__(self, options=[]):
        self.set_options(options)
        self._selection = None

    # Getters & Setters
    
    def get_option(self, index):
        return self._options[index]
    
    def get_options(self):
        return self._options
    
    def set_options(self, options):
        for o in options:
            if type(o) is not str:
                raise KeyError("Dropdown menu options can only be strings")
        self._options = options

    def get_selection(self):
        if self._selection is not None:
            return self.get_option(self._selection)
        else:
            return None
    
    def select_option(self, selecton_index):
        if self._selection is not None:
            _ = self.get_option(selecton_index)
            self._selection = selecton_index
        else:
            return None


class MultiSelectDropdown:
    """
    Represents multi-select dropdown menu

    Attributes:
        options(string array): multi-select dropdown menu options
    """

    # Constuctor
    def __init__(self, options=[]):
        self.set_options(options)
        self._selections = []

    # Getters & Setters
    
    def get_option(self, index):
        return self._options[index]
    
    def get_options(self):
        return self._options
    
    def set_options(self, options):
        for o in options:
            if type(o) is not str:
                raise KeyError("Dropdown menu options can only be strings")
        self._options = options

    def get_selections(self):
        if self._selection is not []:
            results = []
            for i in self._selections:
                results.append(self.get_option(i))
            return results
        else:
            return None
    
    def select_option(self, selecton_index):
        if self._selection is not []:
            _ = self.get_option(selecton_index)
            if selecton_index not in self._selections:
                self._selections.append(selecton_index)
        else:
            return None
