"use client"

import { ManagementContext, managementType } from '@/utils/managementContext';
import React, { useEffect } from 'react'
import Toggler from './toggler';

const CLIENT_ID = "ce0cf211-6af5-4492-b1c4-a2477b0aea16";
const TOKEN = "i8i9mPNJ37fUo75ZHHs3yieEXQ1bezLB";

export default function Controller({ data }: { data: managementType }) {
	// useEffect(()=> {
	// 	const fetchData = async ()=> {
	// 		try {
	// 			const res = await fetch("https://api.netpie.io/v2/device/shadow/data", {
	// 				method: "GET",
	// 				headers: {
	// 					"Authorization": `Device ${CLIENT_ID}:${TOKEN}`
	// 				},

	// 			})
	// 			const result = await res.json();
	// 			console.log(result.data);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	}
	// 	fetchData();
	// }, [])
	return (
		<div>
			<ManagementContext.Provider value={data}>
				<Toggler />
			</ManagementContext.Provider>
		</div>
	)
}