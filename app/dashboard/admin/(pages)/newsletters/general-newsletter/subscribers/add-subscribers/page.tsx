import AddSubscriberController from "@/app/dashboard/admin/(pages)/newsletters/add-subscribers/_components/add-subscriber-controller";
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

  return <AddSubscriberController selectData={selectData} />;
}
