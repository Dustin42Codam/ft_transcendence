export {};

declare global {
    namespace Express {
        interface Request {
            session: {
                logged_in: boolean;
                user_id: number;
                jwt: any;
                token: any;
            };
        }
    }
}