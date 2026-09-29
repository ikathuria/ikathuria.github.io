/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';

// Flat, ink-outlined stickers. Color is the only thing that varies.
export const STICKER_PALETTE = {
    yellow: '#FFD84D',
    coral:  '#FF9B8A',
    mint:   '#6EE7A0',
    indigo: '#A5B4FC',
    purple: '#C4A3F5',
    lime:   '#B8F04A',
} as const;
export type StickerColor = keyof typeof STICKER_PALETTE;

export const Sticker: React.FC<{
    children: React.ReactNode;
    color?: StickerColor;
    rotation?: number;
    className?: string;
    /** Makes the sticker draggable within the given container ref. */
    dragConstraints?: React.RefObject<Element | null>;
}> = ({ children, color = 'indigo', rotation = 0, className = '', dragConstraints }) => (
    <motion.div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border-[1.5px] border-ink text-[13px] font-semibold text-ink whitespace-nowrap select-none ${dragConstraints ? 'cursor-grab touch-none' : 'cursor-default'} ${className}`}
        style={{ background: STICKER_PALETTE[color], boxShadow: '0 2px 0 0 #1C1A17', rotate: rotation }}
        drag={!!dragConstraints}
        dragConstraints={dragConstraints}
        dragMomentum={false}
        dragElastic={0.12}
        whileHover={{ rotate: 0, y: -2, transition: { duration: 0.15 } }}
        whileDrag={{ rotate: 0, cursor: 'grabbing' }}
    >
        {children}
    </motion.div>
);
