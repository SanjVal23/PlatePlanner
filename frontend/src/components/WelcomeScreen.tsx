import { Logo } from './Logo';

interface WelcomeScreenProps {
  onNavigate: (screen: any) => void;
}

export function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="relative">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
            <Logo size="lg" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-gray-900">Plate Planner</h1>
          <p className="text-gray-500">Your personal meal planning assistant</p>
        </div>
        
        <div className="w-full space-y-3 pt-4">
          <button
            onClick={() => onNavigate('login')}
            className="w-full py-6 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => onNavigate('create-account')}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white py-6 rounded-xl shadow-lg transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}