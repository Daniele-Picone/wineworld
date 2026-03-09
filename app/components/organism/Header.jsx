"use client";

import './Header.css';
import NavLinks from '@/app/components/molecules/NavLinks';
import Link from 'next/link';

export default function  Header(){
    return(
        <header className="header" >
            <div className="logo"><Link href='/' ><h2>WineWorld</h2></Link> </div>
            <NavLinks/>
        </header>
    )
}