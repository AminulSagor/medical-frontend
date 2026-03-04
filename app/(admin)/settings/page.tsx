import ChangePasswordCard from "./_components/change-password-card";
import UpdateEmailCard from "./_components/update-email-card";
import PageTitle from "../_components/page-title";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <PageTitle
                title="Security, Access & SMTP Settings"
                subtitle="Administrative security and access settings with integrated SMTP configuration."
            />

            <div className="space-y-6">
                <UpdateEmailCard />
                <ChangePasswordCard />
            </div>
        </div>
    );
}