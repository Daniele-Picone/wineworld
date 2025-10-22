"use client";

import './Header.css';
import NavLinks from '@/app/components/molecules/NavLinks';

export default function  Header(){
    return(
        <header className="header" >
            <div className="logo"><h1>WineWorld</h1> </div>
            <NavLinks/>
        </header>
    )
}