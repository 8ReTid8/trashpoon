import LogTable from "@/components/logs/table";
import prisma from "@/utils/prisma";


export default async function LogsPage() {
    const data = await prisma.log.findMany(({
        include: {
            node: {
                include: {
                    area: true
                }
            }
        }
    }))
  return (
    <div>
        <LogTable data={data} />
    </div>
  )
}
