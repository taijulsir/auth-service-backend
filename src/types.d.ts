import { IUser } from '#models/User';

declare global {
    namespace Express {
        interface User extends IUser {}
        interface Request {
            user?: User | any; // Allow both passport user object and the email string used in verifyJWT
            roles?: number[];
        }
    }
}
