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
        errors.username = 'login.usernameRequired';
    } else if (data.username.length < 3) {
        errors.username = 'login.usernameMinLength';
    }

    if (!data.password) {
        errors.password = 'login.passwordRequired';
    } else if (data.password.length < 6) {
        errors.password = 'login.passwordMinLength';
    }

    return errors;
};
