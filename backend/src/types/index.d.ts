export {};

declare global {
    namespace Express {
        interface Request {
            session: {
                logged_in: boolean;
                visits: number;
                user_id: number;
                jwt: any
            };
        }
    }
}