"use client";
import './TopCreators.css'

import React from "react";

export default function TopCreators({creators} ){

    if(!creators.length){
        return( 

            <div className="top_creators">
                <h3>Top Creatori</h3>
                <p>Nessun Dato Disponibile</p>

            </div>
        )
    }

    return(
    <div className="top-creators">
            <div className="topCreators_title">
                <h3>Top Creatori</h3>
            </div>
            <div className="topCreators_info">
                <ul>

                {creators.map((creator, index) => (
                    <li key={index} className="creator-item">
                        <span className="rank">{index + 1}.</span>
                        <div className="creator-info">
                        <strong>{creator.name}</strong>
                        <span 
                            style={{'--progress-width': `${creator.percentage}%`}}
                            data-percentage={`${creator.percentage}%`}
                        >
                            {creator.count} post
                        </span>
                        </div>
                    </li>
                ))}
                </ul>
            </div>
    </div>

    )
    
}