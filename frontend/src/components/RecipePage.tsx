import { ArrowLeft, Search, Clock, Flame, Home, Calendar, BookOpen, User, Heart, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ImageWithFallback } from './ImageWithFallback';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface RecipePageProps {
  onNavigate: (screen: any) => void;
}

export function RecipePage({ onNavigate }: RecipePageProps) {
  const { recipes, toggleFavorite, setSelectedRecipe, addRecipe, addActivity, rateRecipe } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDietaryFilter, setSelectedDietaryFilter] = useState<string | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    category: 'Breakfast' as 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks',
    calories: '',
    time: '',
    ingredients: '',
    instructions: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const handleAddRecipe = () => {
    if (!newRecipe.name || !newRecipe.calories) {
      toast.error('Please fill in at least name and calories');
      return;
    }

    const ingredientsList = newRecipe.ingredients.split('\n').filter(i => i.trim());
    const instructionsList = newRecipe.instructions.split('\n').filter(i => i.trim());

    addRecipe({
      id: recipes.length + 1,
      name: newRecipe.name,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      time: newRecipe.time || '30 min',
      calories: parseInt(newRecipe.calories),
      category: newRecipe.category,
      protein: newRecipe.protein ? parseInt(newRecipe.protein) : undefined,
      carbs: newRecipe.carbs ? parseInt(newRecipe.carbs) : undefined,
      fat: newRecipe.fat ? parseInt(newRecipe.fat) : undefined,
      ingredients: ingredientsList.length > 0 ? ingredientsList : undefined,
      instructions: instructionsList.length > 0 ? instructionsList : undefined,
      isFavorite: false
    });

    addActivity({
      type: 'recipe',
      description: `Added new recipe: ${newRecipe.name}`
    });

    toast.success('Recipe added successfully!');
    setShowAddRecipe(false);
    setNewRecipe({
      name: '',
      category: 'Breakfast',
      calories: '',
      time: '',
      ingredients: '',
      instructions: '',
      protein: '',
      carbs: '',
      fat: ''
    });
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDietaryFilter = !selectedDietaryFilter || 
      (recipe.dietaryTags && recipe.dietaryTags.includes(selectedDietaryFilter as any));
    const matchesCuisine = !selectedCuisine || 
      (recipe.cuisine && recipe.cuisine.includes(selectedCuisine as any));
    return matchesCategory && matchesSearch && matchesDietaryFilter && matchesCuisine;
  });

  const handleRecipeClick = (recipe: any) => {
    setSelectedRecipe(recipe);
    onNavigate('recipe-detail');
  };

  const handleToggleFavorite = (e: React.MouseEvent, recipeId: number) => {
    e.stopPropagation();
    toggleFavorite(recipeId);
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe && !recipe.isFavorite) {
      addActivity({
        type: 'favorite',
        description: `Favorited ${recipe.name}`
      });
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[800px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-6 text-white">
        <button 
          onClick={() => onNavigate('home')}
          className="mb-4 flex items-center text-white/90 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        
        <h2 className="text-white mb-2">Recipe Collection</h2>
        <p className="text-purple-100 text-sm mb-4">Discover delicious meals</p>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 space-y-4 border-b border-gray-200">
        {/* Category Filter */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Categories</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm transition-colors ${
                  cat === selectedCategory
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Filter */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Dietary Restrictions</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'High-Protein'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedDietaryFilter(selectedDietaryFilter === filter ? null : filter)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs transition-colors ${
                  filter === selectedDietaryFilter
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Cuisine Filter */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Cuisine</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['Italian', 'Mexican', 'Asian', 'American', 'Mediterranean', 'Indian', 'French', 'Japanese', 'Thai', 'Greek'].map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(selectedCuisine === cuisine ? null : cuisine)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs transition-colors ${
                  cuisine === selectedCuisine
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                onClick={() => handleRecipeClick(recipe)}
                className="border-2 border-gray-200 hover:border-purple-300 transition-all cursor-pointer overflow-hidden group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <ImageWithFallback 
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <button 
                    onClick={(e) => handleToggleFavorite(e, recipe.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart 
                      className={`w-4 h-4 ${recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                    />
                  </button>
                </div>
                
                <div className="p-3 space-y-2">
                  <h3 className="text-sm text-gray-900 line-clamp-1">{recipe.name}</h3>
                  
                  {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {recipe.dietaryTags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {recipe.dietaryTags.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                          +{recipe.dietaryTags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {recipe.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {recipe.calories}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      size="sm"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleRecipeClick(recipe);
                      }}
                      className="w-full h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs"
                    >
                      View Recipe
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-1">No recipes found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Add Recipe Dialog */}
      <Dialog open={showAddRecipe} onOpenChange={setShowAddRecipe}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Custom Recipe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipeName">Recipe Name*</Label>
              <Input
                id="recipeName"
                value={newRecipe.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRecipe({...newRecipe, name: e.target.value})}
                placeholder="e.g., Chicken Salad"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category*</Label>
                <select
                  id="category"
                  value={newRecipe.category}
                  onChange={(e) => setNewRecipe({...newRecipe, category: e.target.value as any})}
                  className="w-full h-10 rounded-md border border-gray-300 px-3"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Calories*</Label>
                <Input
                  id="calories"
                  type="number"
                  value={newRecipe.calories}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRecipe({...newRecipe, calories: e.target.value})}
                  placeholder="300"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={newRecipe.time}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRecipe({...newRecipe, time: e.target.value})}
                  placeholder="30 min"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={newRecipe.protein}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRecipe({...newRecipe, protein: e.target.value})}
                  placeholder="20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={newRecipe.carbs}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRecipe({...newRecipe, carbs: e.target.value})}
                  placeholder="30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={newRecipe.fat}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRecipe({...newRecipe, fat: e.target.value})}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients (one per line)</Label>
              <Textarea
                id="ingredients"
                value={newRecipe.ingredients}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewRecipe({...newRecipe, ingredients: e.target.value})}
                placeholder="1 cup rice&#10;2 chicken breasts&#10;1 tbsp olive oil"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions (one step per line)</Label>
              <Textarea
                id="instructions"
                value={newRecipe.instructions}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewRecipe({...newRecipe, instructions: e.target.value})}
                placeholder="Cook rice according to package&#10;Season and grill chicken&#10;Combine and serve"
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddRecipe(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddRecipe}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Add Recipe
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <div className="flex justify-around items-center">
          <button 
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600"
            onClick={() => onNavigate('home')}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600"
            onClick={() => onNavigate('track-meals')}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Track</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 text-purple-600"
            onClick={() => onNavigate('recipe')}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">Recipes</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600"
            onClick={() => onNavigate('profile')}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}