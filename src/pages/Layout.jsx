import React from 'react'
import { Outlet } from "react-router"
import { Header } from "../components/Header.jsx"

export function Layout() {

    const [searchInput, setSearchInput] = React.useState('')

    return (
        <>
            <Header 
                searchInput={searchInput}
                setSearchInput={setSearchInput}
            />
            <main>
                <Outlet context={{searchInput: searchInput}}/>
            </main>
        </>
    )
}