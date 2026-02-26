import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4">
            {t('hero.subtitle')}
          </p>
          <p className="text-base md:text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              {tCommon('getStarted')}
            </Link>
            <Link
              href="/community"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
            >
              {tCommon('learnMore')}
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
            {t('howItWorks.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900">
                {t('howItWorks.step1.title')}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                {t('howItWorks.step1.description')}
              </p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900">
                {t('howItWorks.step2.title')}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                {t('howItWorks.step2.description')}
              </p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900">
                {t('howItWorks.step3.title')}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                {t('howItWorks.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
