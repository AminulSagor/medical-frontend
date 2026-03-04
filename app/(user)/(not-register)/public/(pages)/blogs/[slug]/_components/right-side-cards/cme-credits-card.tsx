import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";

export default function CmeCreditsCard() {
  return (
    <Card className="relative p-6 rounded-[24px] border border-light-slate/20 bg-[#F3F6F9] shadow-sm">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">
          CME Credits Available
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed">
          This article is eligible for{" "}
          <span className="font-semibold text-slate-900">
            0.5 AMA PRA Category 1 Credits™
          </span>{" "}
          upon completion of the post-test.
        </p>
      </div>

      <div className="mt-6">
        <Button
          size="md"
          variant="primary"
          shape="pill"
          className="w-full justify-center bg-sky-500 hover:bg-sky-600"
        >
          Earn Credits
        </Button>
      </div>
    </Card>
  );
}