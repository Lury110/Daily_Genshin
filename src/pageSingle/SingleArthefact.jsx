import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const SingleArthefact = () => {
    const [cardData, setCardData] = useState([]);
    const {id} = useParams();
    const BACK_URI = import.meta.env.VITE_BACK_URI;

    useEffect(() => {

        const fetchCards = async () => {
            try {
                const responseArtefact = await fetch(BACK_URI+`/artefact/findById/${id}`);
                const dataArtefact = await responseArtefact.json();

                const responseCharacters = await fetch(BACK_URI+`/character/findByIdArtefact/${id}`);
                const dataCharacters = await responseCharacters.json();

                const alldata = [
                    dataArtefact[0],
                    dataCharacters
                ]

                setCardData(alldata);

            } catch (err) {
                console.error("Erreur lors du fetch :", err);
            }
        };


        fetchCards();
    }, []);
    //

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
                        <img src={`../artefactIcon/${cardData[0]?.name}.webp`} alt={`${cardData[0]?.name}`} style={{minHeight:"100px", minWidth:"200px"}}/>
                    </div>
                    <div className="description" style={{display:"flex", flexDirection:"column", width:"69%"}}>
                        <p style={{marginBottom:"1rem"}}>Bonus 2 pièces: {cardData[0]?.bonus2}</p>
                        <p>Bonus 4 pièces: {cardData[0]?.bonus4}</p>
                    </div>
                </div>
                <div className="itemsUpdate" style={{display:"flex", flexFlow:"row wrap", justifyContent:"center", alignItems:"center", gap:"1rem", margin:"1rem 0", padding:"1rem", border:"2px solid white", borderRadius:"2rem"}}>
                    <p style={{width:"100%", textAlign:"center", fontSize:"24px"}}>Exemple d'utilisateur</p>
                    {cardData[1]?.map((result) => (
                        <a href={`../Personnage/${result.id}`} key={result.id} style={{textAlign:"center", width:"23%"}}>
                            <div>
                                <img src={`../cardCharacter/${result.name}.png`} alt="" style={{width:"50%", height:"100%"}}/>
                                <p>{result.name?.replace(/_/g, " ")}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SingleArthefact

