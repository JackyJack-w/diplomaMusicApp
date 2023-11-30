/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname:  'usbdoqvxpsecmwmbujzs.supabase.co',
            },
        ],
    },
}

module.exports = nextConfig
