import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TechCorp
            </div>
            <p className="text-gray-400 leading-relaxed">
              Chúng tôi cam kết mang đến những giải pháp công nghệ tốt nhất 
              để giúp doanh nghiệp của bạn phát triển và thành công.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-blue-700 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-pink-600 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Dịch vụ</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Phát triển Web</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ứng dụng Mobile</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cloud Solutions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Phân tích dữ liệu</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bảo mật</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Công ty</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Đội ngũ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tin tức</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Liên hệ</h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-center space-x-3">
                <Mail size={18} />
                <span>contact@techcorp.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="mt-1" />
                <span>123 Đường ABC, Quận 1<br />TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} TechCorp. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;