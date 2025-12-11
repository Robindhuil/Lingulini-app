import LoginForm from "@/components/LoginForm";
import { signIn } from "@/lib/auth";
import { executeAction } from "@/lib/executeAction";

export default function LoginPage() {
    const signInAction = async (formData: FormData) => {
        "use server";
        return await executeAction({
            actionFn: async () => {
                await signIn("credentials", {
                    username: formData.get("username"),
                    password: formData.get("password"),
                    redirect: false, // Handle redirect on client side
                });
            },
        });
    };

    const LoginFormAny = LoginForm as React.ComponentType<{ signInAction: typeof signInAction }>;

    return <LoginFormAny signInAction={signInAction} />;
}