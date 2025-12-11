interface ValidationErrors {
    [key: string]: string;
}

interface LoginFormData {
    username: string;
    password: string;
}

export const validateLoginForm = (data: LoginFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!data.username.trim()) {
        errors.username = 'login.emailRequired';
    } 

    if (!data.password) {
        errors.password = 'login.passwordRequired';
    } 

    return errors;
};
