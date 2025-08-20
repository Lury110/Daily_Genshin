import {useEffect, useState} from "react";
import {data, useParams} from "react-router-dom";

const SingleObjet = () => {

    const [cardData, setCardData] = useState([]);

    const {id} = useParams();
    const BACK_URI = import.meta.env.VITE_BACK_URI;


    useEffect(() => {

        const fetchCards = async () => {
            try {
                const responseMaterial = await fetch(BACK_URI+`/material/findById/${id}`);
                const dataMaterial = await responseMaterial.json();

                if (dataMaterial[0]?.type === "Matériau d'aptitude de personnage"){
                    const responseCharacters = await fetch(BACK_URI+`/material/findCharactersById/${id}`);
                    var dataCharacters = await responseCharacters.json();

                } else if (dataMaterial[0]?.type === "Matériau d'élévation d'arme"){
                    const responseCharacters = await fetch(BACK_URI+`/material/findWeaponById/${id}`);
                    var dataCharacters = await responseCharacters.json();

                }

                const alldata = [
                    dataMaterial[0],
                    dataCharacters[0]
                ]

                setCardData(alldata);

            } catch (err) {
                console.error("Erreur lors du fetch :", err);
            }
        };

        fetchCards();
    }, []);
    console.log(cardData)

    if (!cardData) return <p style={{color: "black"}}>Chargement...</p>;

    return (
        <>
            <div id="content">
                <div id="textTopPage">
                    <div className="line"/>
                    <h1>{cardData[0]?.name}</h1>
                    <div className="line"/>
                </div>
                <div className="TopPerso" style={{display:"flex", justifyContent:"space-around", alignItems:"center", width:"100%"}}>
                    <div className="splashArt" style={{width:"22%"}}>
                        <img src={`../updateApt/${cardData[0]?.name}.webp`} alt={`${cardData[0]?.name}`} style={{minHeight:"100px", minWidth:"200px"}}/>
                    </div>
                    <div className="description" style={{display:"flex", flexDirection:"column", width:"69%"}}>
                        <p style={{marginBottom:"1rem"}}>Dispo: {cardData[0]?.time}</p>
                        <p style={{marginBottom:"1rem"}}>Type: {cardData[0]?.type}</p>
                    </div>
                </div>
                <div className="itemsUpdate" style={{display:"flex", flexFlow:"row wrap", justifyContent:"center", alignItems:"center", gap:"1rem", margin:"1rem 0", padding:"1rem", border:"2px solid white", borderRadius:"2rem"}}>
                    <p style={{width:"100%", textAlign:"center", fontSize:"24px"}}>Exemple d'utilisateur</p>
                    <div className="updateLevel" style={{textAlign:"center", width:"24%"}}>
                        <img src={`../cardCharacter/${cardData[1]?.name}.png`} alt="" style={{width:"50%"}}/>
                        <p>{cardData[1]?.name}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SingleObjet