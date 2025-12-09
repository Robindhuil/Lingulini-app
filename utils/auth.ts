export function isAdmin(session: any): boolean {
    // ...bezpečné overenie, ak session alebo user nie sú dostupné...
    if (!session || !session.user) return false;

    const user = session.user;

    // 1) priama string property 'role' alebo 'roles'
    if (typeof user.role === "string" && user.role.toUpperCase() === "ADMIN") return true;
    if (Array.isArray(user.roles) && user.roles.some((r: string) => String(r).toUpperCase() === "ADMIN")) return true;

    // 2) boolean flag (napr. isAdmin)
    if (user.isAdmin === true) return true;

    // 3) nested claim (napr. user.roles.map... alebo custom claim)
    // Pokús sa nájsť kľúč obsahujúci 'role' alebo 'roles'
    for (const key of Object.keys(user)) {
        const val = (user as any)[key];
        if (typeof val === "string" && val.toUpperCase() === "ADMIN") return true;
        if (Array.isArray(val) && val.some((r: any) => String(r).toUpperCase() === "ADMIN")) return true;
    }

    return false;
}
