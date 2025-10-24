"use client";
import * as React from "react"
import './Charts.css'
export default function Charts({ title = "" , total= [], label = "Totale", categories = []  }) {
 
  return(
    <div className="chart_container" >
            <div className="info">
                <div className="info_left">
                    <h3> {label} {title}</h3>
                    <h2>{total}</h2>
                </div>
                <div className="info_right">
                    {categories.length > 0 && (
                    <ul>
                        {categories.map((cat, i) => (
                            <li key={i}>
                            {cat.name}: {cat.value} ({cat.percentage}%)
                            </li>
                        ))}
                    </ul>
                )}
                </div>
            </div>
    </div>

  )
}
