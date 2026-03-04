export type NewsletterTabKey = "newsletters" | "subscribers";

export type TabItem = {
  key: NewsletterTabKey;
  label: string;
  icon: React.ElementType;
};
