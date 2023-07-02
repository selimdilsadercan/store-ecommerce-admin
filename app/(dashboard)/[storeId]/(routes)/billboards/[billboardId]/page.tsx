import db from "@/lib/db";
import BillboardForm from "./components/BillboardForm";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  //methods
  const billboard = await db.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  ////

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
