import { Loader2 } from 'lucide-react';

const LoadingOverlay = () => (
    <div className='fixed inset-0 z-100 flex flex-col items-center justify-center bg-background'>
        <div className='relative flex items-center justify-center'>
            <div className='absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse' />
            <Loader2 className='h-10 w-10 text-primary animate-spin relative' />
        </div>
        <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
            Syncing TaskFlow...
        </p>
    </div >
);

export default LoadingOverlay;