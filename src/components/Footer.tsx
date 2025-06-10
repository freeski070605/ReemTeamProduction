import  { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-light py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Reem Team Tonk. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-accent">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-accent">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-accent">
              <Github size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
 