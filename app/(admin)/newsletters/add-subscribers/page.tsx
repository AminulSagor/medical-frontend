import AddSubscriberForm from "./_components/add-subscriber-form";
import AddSubscriberHeader from "./_components/add-subscriber-header";
import { AddSubscriberSelectData } from "./types/add-subscribers-type";


export const metadata = { title: "Add Subscriber" };

export default async function Page() {
  const selectData: AddSubscriberSelectData = {
    clinicalRoles: [
      "Anesthesiologist",
      "ER Nurse",
      "Emergency Physician",
      "Paramedic",
      "CRNA",
    ],
    designations: ["MD", "DO", "CRNA", "RN", "PA-C", "NP"],
    sources: ["Manual Entry", "Footer", "Popup", "Webinar", "Checkout"],
    recommendedTags: ["Trauma-Informed", "Airway Management", "ER-Staff"],
  };

  return (
    <div className="space-y-6">
      <AddSubscriberHeader />
      <AddSubscriberForm selectData={selectData} />
    </div>
  );
}