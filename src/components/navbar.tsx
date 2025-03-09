"use client"

import { LayoutDashboard, Logs, SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Navbar() {
    const [active, setActive] = useState('')
    const router = useRouter();
    useEffect(() => {
        const currentPath = window.location.pathname
        if (currentPath === '/') {
            setActive('')
        } else {
            setActive('management')
        }
    }, [])

    const handleChangeTab = (tab: string) => {
        setActive(tab);
        router.push(`/${tab}`)
    }

    return (
        <div className="btm-nav z-50">
            <button onClick={() => handleChangeTab("")} className={active === '' ? 'active' : ''}>
                <LayoutDashboard />
            </button>
            <button onClick={() => handleChangeTab("management")} className={active === 'management' ? 'active' : ''}>
                <SlidersHorizontal />
            </button>
            <button onClick={() => handleChangeTab("logs")} className={active === 'logs' ? 'active' : ''}>
                <Logs />
            </button>
        </div>
    )
}
