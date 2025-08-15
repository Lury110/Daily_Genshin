import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const SingleArme = () => {
    const [cardData, setCardData] = useState([]);
    const {id} = useParams();
    const BACK_URI = import.meta.env.VITE_BACK_URI;
    
    useEffect(() => {

        const fetchCards = async () => {
            try {
                const responseWeapon = await fetch(BACK_URI+`/weapon/findById/${id}`)
                const dataWeapon = await responseWeapon.json();

                const responseMaterial = await fetch(BACK_URI+`/material/findByIdWeapon/${id}`);
                const dataMaterial = await responseMaterial.json();

                const alldata = [
                    dataWeapon[0],
                    dataMaterial[0]
                ]

                setCardData(alldata);

            } catch (err) {
                console.error("Erreur lors du fetch :", err);
            }
        };

        fetchCards();
    }, []);


    if (!cardData) return <p style={{color: "black"}}>Chargement...</p>;

    return (
        <>
            <div id="content">
                <div id="textTopPage">
                    <div className="line"/>
                    <h1>{cardData[0]?.name}</h1>
                    <div className="line"/>
                </div>
                <div className="TopPerso" style={{display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                    <div className="splashArt" style={{width:"29%"}}>
                        <img src={`../weaponsIcon/${cardData[0]?.name}.webp`} alt={`${cardData[0]?.name}`} style={{minHeight:"100px", minWidth:"200px"}}/>
                    </div>
                    <div className="description" style={{display:"flex", flexDirection:"column", width:"69%"}}>
                        <p style={{marginBottom:"1rem"}}>Description: {cardData[0]?.description}</p>
                        <p style={{marginBottom:"1rem"}}>Stat principale: {cardData[0]?.seg_stat}</p>
                        <p>Passif: {cardData[0]?.passif}</p>
                    </div>
                </div>
                <div className="itemsUpdate" style={{display:"flex", justifyContent:"center", alignItems:"center", gap:"1rem", margin:"1rem 0", padding:"1rem", border:"2px solid white", borderRadius:"2rem"}}>
                    <div className="updateLevel" style={{textAlign:"center", width:"24%"}}>
                        {/*<img src={`https://genshin.jmp.blue/materials/weapon-ascension/${cardData.ascensionMaterial}`} alt="" style={{width:"50%"}}/>*/}
                        <p>Obtention: {cardData[0]?.obtain}</p>
                    </div>
                    <div className="updateLevel" style={{textAlign:"center", width:"24%"}}>
                        {/*<img src={`https://genshin.jmp.blue/materials/weapon-ascension/${cardData.ascensionMaterial}`} alt="" style={{width:"50%"}}/>*/}
                        <p>Type: {cardData[0]?.type}</p>
                    </div>
                    <div className="updateLevel" style={{textAlign:"center", width:"24%"}}>
                        {/*<img src={`https://genshin.jmp.blue/materials/weapon-ascension/${cardData.ascensionMaterial}`} alt="" style={{width:"50%"}}/>*/}
                        <p>{cardData[1]?.name}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SingleArme