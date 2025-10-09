import { Code, Smartphone, Cloud, BarChart3, Shield, Headphones } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Code,
      title: "Phát triển Web",
      description: "Xây dựng website và ứng dụng web hiện đại, tối ưu hiệu suất và trải nghiệm người dùng.",
      features: ["React/Vue.js", "Node.js/Python", "Database Design", "API Development"]
    },
    {
      icon: Smartphone,
      title: "Ứng dụng Mobile",
      description: "Phát triển ứng dụng iOS và Android với công nghệ React Native và Flutter.",
      features: ["Cross-platform", "Native Performance", "App Store Optimization", "Push Notifications"]
    },
    {
      icon: Cloud,
      title: "Cloud Solutions",
      description: "Triển khai và quản lý hạ tầng cloud, đảm bảo khả năng mở rộng và bảo mật.",
      features: ["AWS/Azure/GCP", "DevOps", "Microservices", "Auto Scaling"]
    },
    {
      icon: BarChart3,
      title: "Phân tích dữ liệu",
      description: "Phân tích và trực quan hóa dữ liệu để hỗ trợ ra quyết định kinh doanh.",
      features: ["Business Intelligence", "Machine Learning", "Data Visualization", "Predictive Analytics"]
    },
    {
      icon: Shield,
      title: "Bảo mật",
      description: "Bảo vệ hệ thống và dữ liệu khỏi các mối đe dọa an ninh mạng.",
      features: ["Security Audit", "Penetration Testing", "Compliance", "24/7 Monitoring"]
    },
    {
      icon: Headphones,
      title: "Hỗ trợ 24/7",
      description: "Dịch vụ hỗ trợ kỹ thuật chuyên nghiệp, đảm bảo hệ thống hoạt động ổn định.",
      features: ["Technical Support", "System Maintenance", "Performance Optimization", "Emergency Response"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Dịch vụ của chúng tôi</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cung cấp đa dạng các dịch vụ công nghệ để đáp ứng mọi nhu cầu của doanh nghiệp.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="text-white" size={28} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;