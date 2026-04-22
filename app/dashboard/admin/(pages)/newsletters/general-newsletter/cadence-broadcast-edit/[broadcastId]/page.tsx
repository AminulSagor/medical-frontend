import GeneralBroadcastFormPage from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_components/general-broadcast-form-page";

type Props = {
  params: Promise<{
    broadcastId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { broadcastId } = await params;

  return <GeneralBroadcastFormPage mode="edit" broadcastId={broadcastId} />;
}
