"use client"

import AreaForm from "./area/form"
import AreaTable from "./area/table"


export default function AreaManager() {
  return (
    <div className="space-y-2">
        <AreaForm />
        <AreaTable />
    </div>
  )
}
