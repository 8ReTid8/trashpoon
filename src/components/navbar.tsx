"use client"

import { LayoutDashboard, SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Navbar() {
    const [active, setActive] = useState('')
    const router = useRouter();
    useEffect(() => {
        const currentPath = window.location.pathname
        if (currentPath === '/dashboard') {
            setActive('dashboard')
        } else {
            setActive('management')
        }
    }, [])

    const handleChangeTab = (tab: string)=> {
        setActive(tab);
        router.push(`/${tab}`)
    } 

    return (
        <div className="btm-nav z-50">
            <button onClick={()=> handleChangeTab("dashboard")} className={active === 'dashboard' ? 'active' : ''}>
                <LayoutDashboard />
            </button>
            <button onClick={()=> handleChangeTab("management")} className={active === 'management' ? 'active' : ''}>
                <SlidersHorizontal />
            </button>
        </div>
    )
}
