import  { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, DollarSign, Award, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();
  
  // Sets a class on the body for the landing page
  useEffect(() => {
    document.body.classList.add('landing-page');
    
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1709540238059-98b31404ef64?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxwbGF5aW5nJTIwY2FyZCUyMGdhbWUlMjB0b25rfGVufDB8fHx8MTc0OTU2OTY2NXww&ixlib=rb-4.1.0&fit=fillmax&h=600&w=800" 
            alt="Person holding playing cards" 
            className="w-full h-screen object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 relative z-10">
          <div className="text-center md:text-left md:max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              <span className="text-accent">Reem Team Tonk</span> <br />
              Real Money Card Games
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Experience the thrill of competitive Tonk with real cash stakes.
              Join tables, challenge players, and cash out your winnings instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              {user ? (
                <Link 
                  to="/lobby" 
                  className="btn btn-accent py-3 px-8 text-lg flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  Play Now
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="btn btn-accent py-3 px-8 text-lg flex items-center justify-center gap-2"
                  >
                    <Play size={20} />
                    Get Started
                  </Link>
                  <Link 
                    to="/login" 
                    className="btn btn-primary py-3 px-8 text-lg"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Play With Reem Team?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/20 text-accent mb-4">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Real Money Stakes</h3>
              <p className="text-gray-400">
                Play with real money and cash out your winnings instantly via CashApp. Tables available from $1 to $50 stakes.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/20 text-accent mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Skill-Based Gameplay</h3>
              <p className="text-gray-400">
                Tonk rewards strategy and skill. Our 40-card deck removes 8s, 9s, and 10s for faster, more tactical play.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/20 text-accent mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Fair</h3>
              <p className="text-gray-400">
                Our platform ensures secure transactions and fair gameplay with advanced encryption and anti-cheating measures.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How to Play Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">How to Play Tonk</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Tonk is a fast-paced card game that combines elements of rummy and poker.
            Learn the basics in minutes and master the strategy over time.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold border-b border-gray-700 pb-3 mb-4">Game Rules</h3>
              <ol className="space-y-4 list-decimal list-inside text-gray-300">
                <li>Each player is dealt 5 cards from a 40-card deck (standard deck minus 8s, 9s, and 10s).</li>
                <li>On your turn, draw a card from the deck or discard pile, then discard one card.</li>
                <li>The goal is to form sets (3+ cards of the same rank) or runs (3+ consecutive cards of the same suit).</li>
                <li>If your hand value is 50 points or less, you can declare "Tonk" to end the round.</li>
                <li>Face cards count as 10 points, Aces as 1, and number cards as their face value.</li>
              </ol>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold border-b border-gray-700 pb-3 mb-4">Winning Strategies</h3>
              <ul className="space-y-4 list-disc list-inside text-gray-300">
                <li>Pay attention to which cards other players are picking up and discarding.</li>
                <li>Try to keep your hand value low while working toward sets and runs.</li>
                <li>Be strategic about when to declare Tonk - it's a risk that can pay off big.</li>
                <li>When deciding what to discard, consider what might help your opponents.</li>
                <li>Practice calculating hand values quickly to make better decisions.</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to={user ? "/lobby" : "/register"} 
              className="btn btn-accent py-3 px-8 text-lg"
            >
              Start Playing Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-accent/10 border-t border-accent/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join the Reem Team?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Create your account today and get 100 free chips to start playing!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link 
                to="/lobby" 
                className="btn btn-accent py-3 px-8 text-lg"
              >
                Enter Game Lobby
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="btn btn-accent py-3 px-8 text-lg"
                >
                  Sign Up Now
                </Link>
                <Link 
                  to="/login" 
                  className="btn btn-primary py-3 px-8 text-lg"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
 