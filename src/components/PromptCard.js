// client/src/components/PromptCard.js
'use client';

import { motion } from 'framer-motion';
import { IoCopyOutline, IoBookmarkOutline } from 'react-icons/io5';
import Link from 'next/link';

const PromptCard = ({ prompt }) => {
    const { _id, title, description, category, aiTool, priceType, creatorName } = prompt;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 p-6 flex flex-col justify-between h-full transition-all"
        >
            <div>
                {/* Badges */}
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100">
                        {aiTool}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${priceType === 'Premium' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                        {priceType}
                    </span>
                </div>

                {/* Title & Desc */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{description}</p>
            </div>

            {/* Footer / Actions */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>By <span className="font-medium text-gray-700">{creatorName || 'Anonymous'}</span></span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">{category}</span>
                </div>

                <div className="flex gap-2 mt-1">
                    <Link href={`/prompt/${_id}`} className="flex-grow text-center bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded-lg text-sm transition">
                        View Details
                    </Link>
                    <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition" title="Bookmark">
                        <IoBookmarkOutline size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default PromptCard;