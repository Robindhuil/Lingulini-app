"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { format } from "date-fns";
import { User, Mail, Calendar, Edit, Shield } from "lucide-react";
import type { User as UserType } from "@/types/user";

export default function UsersTable() {
    const { t } = useTranslation();
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="w-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">{t("common.loading")}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full text-center py-12">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 sm:px-0">
                <h3 className="text-xl sm:text-2xl font-bold text-[#600000] dark:text-[#600000] flex items-center gap-2">
                    <User className="w-5 h-5 sm:w-6 sm:h-6" />
                    {t("adminPanel.usersList")}
                </h3>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {t("adminPanel.totalUsers")} {users.length}
                </span>
            </div>

            {users.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">{t("adminPanel.noUsers")}</p>
                </div>
            ) : (
                <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <table className="w-full min-w-[800px] divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t("adminPanel.table.id")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <Mail className="w-4 h-4 inline mr-1" />
                                    {t("adminPanel.table.email")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t("adminPanel.table.name")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <Shield className="w-4 h-4 inline mr-1" />
                                    {t("adminPanel.table.role")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    {t("adminPanel.table.created")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <Edit className="w-4 h-4 inline mr-1" />
                                    {t("adminPanel.table.updated")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        #{user.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        {user.name || (
                                            <span className="text-gray-400 dark:text-gray-600 italic">
                                                {t("adminPanel.table.noName")}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === "ADMIN"
                                                ? "bg-[#600000]/10 text-[#600000] dark:bg-[#600000]/20"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {format(new Date(user.createdAt), "dd.MM.yyyy HH:mm")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {format(new Date(user.updatedAt), "dd.MM.yyyy HH:mm")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}