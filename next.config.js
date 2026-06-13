/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 🎯 این بخش مسیر اصلی سایت را به صورت اجباری مپ می‌کند تا ارور ۴۰۴ دامین برطرف شود
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index',
      },
    ];
  },
};

module.exports = nextConfig;
