
import Dashboard from "@/components/dashboard/dashboard";
import prisma from "@/utils/prisma";

export default async function DashboardPage() {
  const areas = await prisma.area.findMany({
    include: {
      Node: true
    }
  });
  return (
    <div>
      <Dashboard data={areas} />
    </div>
  )
}
