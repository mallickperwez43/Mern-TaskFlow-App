import React from 'react'
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const BentoCard = ({ children, className, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay }}
            className={cn(
                'relative group overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md',
                className
            )}
        >

            <div className='pointer-events-none  absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-radial-[at_50%_0%] from-primary/5 to-transparent' />
            {children}
        </motion.div>
    )
}

export default BentoCard;