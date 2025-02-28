import Dashboard from "@/components/management/dashboard";
import prisma from "@/utils/prisma";

export default async function Management() {
    const nodes = await prisma.node.findMany();
    const areas = await prisma.area.findMany();

    return (
        <div>
            <Dashboard data={{
                Node: nodes,
                Area: areas
            }} />
        </div>
    )
}
