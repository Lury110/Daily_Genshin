import {useEffect, useState} from "react";

const Accueil = () => {

    return (
        <>
            <div id="content">
                <div id="textTopPage">
                    <div className="line"/>
                    <h1>Accueil</h1>
                    <div className="line"/>
                </div>
                <div className="calendar" style={{textAlign:"center", color:"white", padding:"30% 0"}}>
                    Vous devez être connecté
                </div>
            </div>
        </>
    )
}

export default Accueil