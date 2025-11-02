export type User = {
    id: number;
    username: string;
    email: string;
    bio: string;
    password: string;
    is_admin: boolean;
    num_failed_attempts: number;
    is_locked: boolean;
    created_at: string;
};

