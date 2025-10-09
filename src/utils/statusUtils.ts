// filepath: d:\JSproject\TTTT\src\utils\statusUtils.ts
export const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'new': 'bg-blue-100 text-blue-800',
      'screening': 'bg-yellow-100 text-yellow-800',
      'interview': 'bg-purple-100 text-purple-800',
      'offer': 'bg-green-100 text-green-800',
      'hired': 'bg-emerald-100 text-emerald-800',
      'rejected': 'bg-red-100 text-red-800',
      'active': 'bg-green-100 text-green-800',
      'paused': 'bg-yellow-100 text-yellow-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      'new': 'Mới',
      'screening': 'Sàng lọc',
      'interview': 'Phỏng vấn',
      'offer': 'Chào giá',
      'hired': 'Đã tuyển',
      'rejected': 'Từ chối',
      'active': 'Đang tuyển',
      'paused': 'Tạm dừng',
      'closed': 'Đã đóng'
    };
    return texts[status] || status;
};