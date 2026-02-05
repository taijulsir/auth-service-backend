import allowedOrigins from './allowedOrigins';
import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // Allow all origins in non-production to avoid CORS problems during local development
        // and when running seed scripts or curl from localhost. In production we enforce allowedOrigins.
        if (process.env.NODE_ENV !== 'production') {
            callback(null, true);
            return;
        }

        if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

export default corsOptions;
