import axios from 'axios';

// ১. এক্সিওস ইনস্ট্যান্স তৈরি
const axiosSecure = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// ২. ইন্টারসেপ্টর সরাসরি ইনস্ট্যান্সের সাথে যুক্ত করা (useEffect-এর বাইরে)
axiosSecure.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access-token');
            if (token) {
                config.headers.authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosSecure.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error('Matrix authorization breached. Token cleared.', error.response.data);
            
            // ⚡ রিডাইরেক্ট সাময়িকভাবে বন্ধ করা হলো যেন ড্যাশবোর্ড স্ক্রিন থেকে বের করে না দেয়
            if (typeof window !== 'undefined') {
                // localStorage.removeItem('access-token'); // আপাতত এটাও বন্ধ রাখলাম টেস্টিং-এর জন্য
                // window.location.href = '/'; // 👈 এই লাইনটি কমেন্ট আউট করে দেওয়া হলো
            }
        }
        return Promise.reject(error);
    }
);

// ৩. কাস্টম হুক যা সরাসরি এই সিকিউরড ইনস্ট্যান্সটি রিটার্ন করবে
const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;