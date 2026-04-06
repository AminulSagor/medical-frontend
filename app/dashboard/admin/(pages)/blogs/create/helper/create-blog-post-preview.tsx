type Props = {
  disabled?: boolean;
  onClick?: () => void;
};

export default function CreateBlogPostPreview({ disabled, onClick }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
    >
      Preview Article
    </button>
  );
}
