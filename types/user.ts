export type User = {
    id: number;
    username: string;
    email: string | null;
    name: string | null;
    role: "USER" | "ADMIN";
    createdAt: Date;
    updatedAt: Date;
};
