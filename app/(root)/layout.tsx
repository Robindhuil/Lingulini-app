import 'flag-icons/css/flag-icons.min.css';
import Navbar from "@/components/Navbar";
import Footer from "../../components/Footer";
import { I18nProvider } from "@/app/i18n/I18nProvider";
import { ThemeProvider } from "@/app/theme/ThemeProvider";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="sk" className="h-full">
            <body className="h-full flex flex-col">
                <ThemeProvider>
                    <I18nProvider initial="sk">
                        <div className="min-h-screen flex flex-col">
                            <Navbar />
                            <main className="flex-1">{children}</main>
                            <Footer />
                        </div>
                    </I18nProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}