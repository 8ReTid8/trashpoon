import Controller from "@/components/controller/controller";
import prisma from "@/utils/prisma";

export default async function ControllerPage() {
  const nodes = await prisma.node.findMany();
  const areas = await prisma.area.findMany();

  return (
    <div>
      <Controller data={{
        Node: nodes,
        Area: areas
      }} />
    </div>
  )
}
