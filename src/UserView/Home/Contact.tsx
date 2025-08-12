import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Liên hệ với chúng tôi</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sẵn sàng bắt đầu dự án của bạn? Hãy liên hệ với chúng tôi để được tư vấn miễn phí.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Thông tin liên hệ</h3>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">contact@techcorp.com</p>
                  <p className="text-gray-600">support@techcorp.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 p-3 rounded-lg">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Điện thoại</h4>
                  <p className="text-gray-600">+84 123 456 789</p>
                  <p className="text-gray-600">+84 987 654 321</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-600 p-3 rounded-lg">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Địa chỉ</h4>
                  <p className="text-gray-600">123 Đường ABC, Quận 1</p>
                  <p className="text-gray-600">TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Giờ làm việc</h4>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Thứ 2 - Thứ 6:</span>
                  <span>8:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Thứ 7:</span>
                  <span>8:00 - 12:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Chủ nhật:</span>
                  <span>Nghỉ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Gửi tin nhắn</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Tin nhắn *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Nhập tin nhắn của bạn"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
