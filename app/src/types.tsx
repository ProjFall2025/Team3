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

export type Sheet = {
    id: number;
    title: string;
    artist: string;
    description: string;
    instrument: string;
    genre: string;
    visibility: 'public' | 'private';
    created_at: string;
    updated_at: string;
    created_by: number;
    comments_enabled: boolean;
    musicxml: string;
    num_downloads: number;
    deleted: boolean;
}

