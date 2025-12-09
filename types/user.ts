export type User = {
    id: number;
    email: string;
    name: string | null;
    role: "USER" | "ADMIN";
    nativeLanguage: string | null;
    learningLanguages: string[];
    createdAt: Date;
    updatedAt: Date;
};
