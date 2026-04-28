"use client";

import { motion } from "motion/react";
import { FOOTER_INSTITUTE } from "@/app/public/data/footer.data";
import FooterBrandColumn from "@/components/layout/footer/_components/footer-brand-column";
import FooterLinksColumn from "@/components/layout/footer/_components/footer-links-column";
import FooterNewsletterColumn from "@/components/layout/footer/_components/footer-newsletter-column";
import FooterBottomBar from "@/components/layout/footer/_components/footer-bottom-bar";
import NewsletterProfileModal from "@/components/layout/footer/_components/newsletter-profile-modal";
import { useFooterPrograms } from "@/components/layout/footer/_hooks/use-footer-programs";
import { useNewsletterSubscription } from "@/components/layout/footer/_hooks/use-newsletter-subscription";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Footer() {
  const { footerPrograms, hasMorePrograms } = useFooterPrograms();
  const newsletter = useNewsletterSubscription();

  return (
    <>
      <footer className="overflow-hidden bg-[#f1f4f8]">
        <div className="mx-auto padding px-6 py-14">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.15 }}
            variants={containerVariants}
            className="grid gap-10 md:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div variants={itemVariants}>
              <FooterBrandColumn />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FooterLinksColumn
                title="Programs"
                links={footerPrograms}
                emptyText="No programs available right now."
                showMore={hasMorePrograms}
                moreHref="/public/courses"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FooterLinksColumn title="Institute" links={FOOTER_INSTITUTE} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FooterNewsletterColumn
                email={newsletter.email}
                errorMessage={newsletter.errorMessage}
                isSubmitting={newsletter.isSubmitting}
                onEmailChange={newsletter.setEmail}
                onSubmit={newsletter.handleSubscribe}
                onClearError={newsletter.clearError}
              />
            </motion.div>
          </motion.div>

          <FooterBottomBar />
        </div>
      </footer>

      <NewsletterProfileModal
        open={newsletter.isProfileModalOpen}
        form={newsletter.profileForm}
        errorMessage={newsletter.profileErrorMessage}
        isSubmitting={newsletter.isProfileSubmitting}
        onClose={newsletter.closeProfileModal}
        onSubmit={newsletter.handleProfileSubmit}
        onFormChange={newsletter.updateProfileField}
      />
    </>
  );
}