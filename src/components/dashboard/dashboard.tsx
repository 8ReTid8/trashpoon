"use client"

import Toggler from './toggler';
import { AreaWithNode } from '@/types/type';
import { DashboardContext } from '@/utils/context/dashboardContext';


export default function Dashboard({ data }: { data: AreaWithNode[] }) {
	return (
		<div>
			<DashboardContext.Provider value={data}>
				<Toggler />
			</DashboardContext.Provider>
		</div>
	)
}
