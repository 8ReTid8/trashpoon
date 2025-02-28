import Controller from "@/components/controller/controller";
import prisma from "@/utils/prisma";

export default async function ControllerPage() {
  const areas = await prisma.area.findMany({
    include: {
      Node: true
    }
  });
  return (
    <div>
      <Controller data={areas} />
    </div>
  )
}
