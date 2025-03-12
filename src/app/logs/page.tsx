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
        },
        orderBy: {
            timestamp : "desc"
        }
    }))
  return (
    <div className="pb-15">
        <LogTable data={data} />
    </div>
  )
}
