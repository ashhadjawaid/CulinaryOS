import { User } from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Using any for now to avoid extensive type mapping, or could match User interface
        }
    }
}
