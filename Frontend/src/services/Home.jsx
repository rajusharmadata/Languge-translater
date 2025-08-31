import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import About from './About';
import image from '../assets/image.png';

import Price from './Price';

const Home = () => {
  return (
    <div
      className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-hidden'

    >
      {/* Navbar */}
      <Navbar />

      {/* Hero / Intro */}
      <div>
        <section className='text-center py-16 px-6'>
          <h1 className='text-5xl font-bold text-white mb-6'>
            Welcome to <span className='text-indigo-400'>TransLingo</span>
          </h1>
          <p className='text-gray-300 max-w-2xl mx-auto'>
            TransLingo is a simple and powerful language translator platform. Translate words,
            sentences, and documents quickly with a clean and user-friendly interface.
          </p>
        </section>
      </div>

      {/* Preview Section */}
      <section className='py-16 '>
        <h2 className='text-3xl font-semibold text-center text-white mb-8'>
          See How It Work and Look
        </h2>
        <div className='max-w-4xl mx-auto max-sm:mx-3'>
          <img
            src={image}
            alt='TransLingo Translation Page Preview'
            className='w-full rounded-sm shadow-2xl border border-gray-700  object-cover'
          />
        </div>
      </section>

      {/* About */}
      <div id='about' className='py-16'>
        <About />
      </div>

      {/* Pricing */}
      <div id='price' className='py-16'>
        <Price />
      </div>
    </div>
  );
};

export default Home;
