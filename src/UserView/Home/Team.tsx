import { Linkedin, Twitter, Github } from 'lucide-react';

const Team = () => {
  const team = [
    {
      name: "Trần Ngọc Thanh Tùng",
      role: "CEO & Founder",
      image: "https://res.cloudinary.com/do46eak3c/image/upload/v1752802930/tntt_uypvpn.jpg",
      bio: "Hơn 15 năm kinh nghiệm trong lĩnh vực công nghệ và quản lý doanh nghiệp.",
      social: { linkedin: "#", twitter: "#", github: "#" }
    },
    {
      name: "Hồ Thị Hồng Nhung",
      role: "CTO",
      image: "https://res.cloudinary.com/do46eak3c/image/upload/v1756522392/Screenshot_2025-08-30_095211_srefwp.png",
      bio: "Chuyên gia về kiến trúc hệ thống và phát triển sản phẩm công nghệ.",
      social: { linkedin: "#", twitter: "#", github: "#" }
    },
    {
      name: ".....",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Fullstack developer với chuyên môn sâu về React, Node.js và cloud technologies.",
      social: { linkedin: "#", twitter: "#", github: "#" }
    },
    {
      name: "......",
      role: "Design Lead",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Chuyên gia UX/UI với hơn 8 năm kinh nghiệm thiết kế sản phẩm số.",
      social: { linkedin: "#", twitter: "#", github: "#" }
    }
  ];

  return (
    <section id="team" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Đội ngũ của chúng tôi</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gặp gỡ những chuyên gia tài năng đang làm việc không ngừng để mang đến 
            những giải pháp công nghệ tốt nhất cho khách hàng.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="group">
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-3">
                    <a href={member.social.linkedin} className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors">
                      <Linkedin size={20} className="text-white" />
                    </a>
                    <a href={member.social.twitter} className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors">
                      <Twitter size={20} className="text-white" />
                    </a>
                    <a href={member.social.github} className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors">
                      <Github size={20} className="text-white" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;