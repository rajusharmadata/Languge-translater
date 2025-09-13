import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import About from './About';
import image from '../assets/image.png';
import Price from './Price';

const Home = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-tl from-black via-gray-800 to-gray-900

 overflow-hidden relative"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative z-10">
        <section className="text-center py-20 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Main Title with Gradient Text */}
            <div className="mb-8 space-y-4">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full border border-indigo-500/30 backdrop-blur-sm mb-6">
                <span className="text-indigo-300 text-sm font-medium">
                  🚀 Breaking Language Barriers
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-300 leading-tight">
                Welcome to{' '}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    TransLingo
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                </span>
              </h1>
            </div>

            {/* Subtitle with Typing Animation */}
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-12">
              Experience the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-semibold">
                future of translation
              </span>{' '}
              with our AI-powered platform. Translate words, sentences, and
              documents instantly with stunning accuracy and a mesmerizing
              interface.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105">
                <span className="relative z-10">Start Translating Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
              <button className="px-8 py-4 border-2 border-indigo-500/50 rounded-full text-indigo-300 font-semibold text-lg transition-all duration-300 hover:border-indigo-400 hover:text-white hover:bg-indigo-500/10 hover:scale-105">
                Watch Demo
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { number: '100+', label: 'Languages Supported' },
                { number: '1M+', label: 'Translations Daily' },
                { number: '99.9%', label: 'Accuracy Rate' },
              ].map((stat, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:from-indigo-500/10 hover:to-purple-500/10 hover:border-indigo-400/30 hover:scale-105">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-300 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Preview Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 mb-6">
              See the Magic in Action
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience our intuitive interface that makes translation feel
              effortless and beautiful
            </p>
          </div>

          {/* Image Container with Advanced Styling */}
          <div className="relative group">
            {/* Glowing Border Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500"></div>

            {/* Main Image Container */}
            <div className="relative bg-gradient-to-br from-gray-900/50 to-black/50 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
              <img
                src={image}
                alt="TransLingo Translation Interface"
                className="w-full rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-[1.02] object-cover"
              />

              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-bounce">
                AI
              </div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-pulse">
                ⚡
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
                <div className="text-sm font-semibold">
                  Real-time Translation
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg">
                <div className="text-sm font-semibold">99.9% Accurate</div>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {[
              {
                icon: '🌍',
                title: 'Global Reach',
                desc: 'Connect with the world in 100+ languages',
              },
              {
                icon: '⚡',
                title: 'Lightning Fast',
                desc: 'Get translations in milliseconds',
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                desc: 'Your data is encrypted and protected',
              },
            ].map((feature, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-black/20 backdrop-blur-sm border border-gray-700/30 transition-all duration-300 hover:from-gray-800/10 hover:to-black/30 hover:border-gray-600/50 hover:scale-105">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <div id="about" className="py-20 relative z-10">
        <About />
      </div>

      {/* Pricing Section */}
      <div id="price" className="py-20 relative z-10">
        <Price />
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
