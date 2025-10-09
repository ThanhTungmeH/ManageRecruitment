import { Award, Users, Target, TrendingUp } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Award, label: "Năm kinh nghiệm", value: "10+" },
    { icon: Users, label: "Chuyên gia", value: "50+" },
    { icon: Target, label: "Dự án thành công", value: "500+" },
    { icon: TrendingUp, label: "Tăng trưởng hàng năm", value: "150%" }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Về chúng tôi</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            TechCorp là công ty công nghệ hàng đầu với hơn 10 năm kinh nghiệm 
            trong việc phát triển các giải pháp số cho doanh nghiệp.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Sứ mệnh của chúng tôi
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Chúng tôi tin rằng công nghệ có thể thay đổi cách thức hoạt động của doanh nghiệp. 
              Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết mang đến những giải pháp 
              tối ưu nhất để giúp khách hàng đạt được mục tiêu kinh doanh.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Từ phát triển ứng dụng web, mobile đến tư vấn chuyển đổi số, 
              chúng tôi luôn đặt chất lượng và sự hài lòng của khách hàng lên hàng đầu.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                Innovation
              </span>
              <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                Quality
              </span>
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                Excellence
              </span>
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop"
              alt="Modern office building"
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="text-white" size={28} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;