import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Giải pháp 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}công nghệ
                </span>
                <br />
                cho tương lai
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Chúng tôi mang đến những giải pháp công nghệ tiên tiến, 
                giúp doanh nghiệp của bạn phát triển và thành công trong kỷ nguyên số.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToSection('contact')}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Bắt đầu ngay
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2">
                <Play size={20} />
                Xem demo
              </button>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600">Dự án hoàn thành</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">50+</div>
                <div className="text-gray-600">Khách hàng tin tương</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">99%</div>
                <div className="text-gray-600">Hài lòng</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop"
                alt="Team working"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl transform -rotate-3 opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
