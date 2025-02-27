"use client"

import MQTTComponent from '@/utils/mqtt';
import React, { useEffect } from 'react'

const CLIENT_ID = "415a8219-61af-490e-90b2-d425200b36e3";
const TOKEN = "96epEXMcVSXXnVpSwkyJZ8vrUNqmA72m";

export default function Dashboard() {
	useEffect(()=> {
		const fetchData = async ()=> {
			try {
				const res = await fetch("https://api.netpie.io/v2/device/shadow/data", {
					method: "GET",
					headers: {
						"Authorization": `Device ${CLIENT_ID}:${TOKEN}`
					},

				})
				const result = await res.json();
				console.log(result.data);
			} catch (error) {
				console.log(error);
			}
		}
		fetchData();
	}, [])
	return (
		<div>
			<button className="btn">Button</button>
			<MQTTComponent />
		</div>
	)
}