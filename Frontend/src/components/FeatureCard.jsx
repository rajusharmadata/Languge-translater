import React from 'react';
import { Zap, Globe, Shield, Users } from 'lucide-react';

const FeatureCard = () => {
  const Feature = [
    {
      // Fast translation capability
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Get instant translations powered by advanced AI technology',
    },
    {
      // Wide language support
      icon: <Globe className="w-6 h-6" />,
      title: '120+ Languages',
      description: 'Translate between over 120 languages with high accuracy',
    },
    {
      // Emphasis on user privacy
      icon: <Shield className="w-6 h-6" />,
      title: 'Privacy First',
      description: 'Your text is never stored. Complete privacy guaranteed',
    },
    {
      // Collaboration feature
      icon: <Users className="w-6 h-6" />,
      title: 'Team Collaboration',
      description: 'Share translations with your team and work together',
    },
  ];

  // Exporting so it can be imported and rendered elsewhere

  return (
    <div>
      <div className="mt-12 sm:mt-16 lg:mt-20">
        <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12 px-4">
          Why Choose TransLingo?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4">
          {Feature.map((feature, index) => (
            <div key={index} className="text-center group">
              {/* Feature icon */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200 border border-white/20">
                <div className="text-white">
                  {React.cloneElement(feature.icon, {
                    className: 'w-5 h-5 sm:w-6 sm:h-6',
                  })}
                </div>
              </div>
              {/* Feature title */}
              <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">
                {feature.title}
              </h4>
              {/* Feature description */}
              <p className="text-sm sm:text-base text-white/70 px-2">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
