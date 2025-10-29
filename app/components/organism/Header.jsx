"use client";

import './Header.css';
import NavLinks from '@/app/components/molecules/NavLinks';
import Link from 'next/link';

export default function  Header(){
    return(
        <header className="header" >
            <div className="logo"><Link href='/' ><h1>WineWorld</h1></Link> </div>
            <NavLinks/>
        </header>
    )
}