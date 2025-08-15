import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const SinglePersonnage = () => {

    const [cardData, setCardData] = useState([]);

    const {id} = useParams();
    const BACK_URI = import.meta.env.VITE_BACK_URI;


    useEffect(() => {

        const fetchCards = async () => {
            try {
                const responseCharacter = await fetch(BACK_URI+`/character/findById/${id}`);
                const dataCharacter = await responseCharacter.json();

                const responseWeapon = await fetch(BACK_URI+`/weapon/findById/${dataCharacter[0]?.weapon_id}`);
                const dataWeapon = await responseWeapon.json();

                const responseArtefact = await fetch(BACK_URI+`/artefact/findById/${dataCharacter[0]?.artefact_id}`);
                const dataArtefact = await responseArtefact.json();

                const responseMaterial = await fetch(BACK_URI+`/material/findByIdCharacter/${id}`);
                const dataMaterial = await responseMaterial.json();

                const responseBoss = await fetch(BACK_URI+`/boss/findBossByIdCharacter/${id}`);
                const dataBoss = await responseBoss.json();

                const responseWBoss = await fetch(BACK_URI+`/boss/findWBossByIdCharacter/${id}`);
                const dataWBoss = await responseWBoss.json();

                const allData =
                    [
                        dataCharacter[0],
                        dataWeapon[0],
                        dataArtefact[0],
                        dataMaterial[0],
                        dataBoss[0],
                        dataWBoss[0]
                    ]

                setCardData(allData);

            } catch (err) {
                console.error("Erreur lors du fetch :", err);
            }
        };

        fetchCards();
    }, []);

    if (!cardData) return <p style={{color: "black"}}>Chargement...</p>;

    var materialUpdate = cardData?.ascension_materials?.level_80?.find(talent => talent.value === 20).name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')


    return (
        <>
            <div id="content">
                <div id="textTopPage">
                    <div className="line"/>
                    <h1>{cardData[0]?.name?.replace(/_/g, " ")}</h1>
                    <div className="line"/>
                </div>

                <div className="TopPerso" style={{display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                    <div className="splashArt" style={{width:"29%"}}>
                        <img src={`../splashArt/${cardData[0]?.name}.webp`} alt={`${cardData[0]?.name}`} style={{minHeight:"100px", minWidth:"200px"}}/>
                    </div>
                    <div className="description" style={{display:"flex", flexDirection:"column", width:"69%"}}>
                        <p style={{marginBottom:"1rem"}}>{cardData[0]?.description}</p>
                    </div>
                </div>

                <div className="itemsUpdate" style={{display:"flex", alignItems:"center", gap:"1rem", margin:"1rem 0", padding:"1rem", border:"2px solid white", borderRadius:"2rem"}}>
                    <a href={`../Arme/${cardData[1]?.id}`} className="signatureWeapon" style={{textAlign:"center", width:"24%"}}>
                        <img src={`../weaponsIcon/${cardData[1]?.name}.webp`} alt="" style={{width:"50%"}}/>
                        <p>{cardData[1]?.name}</p>
                    </a>
                    <div className="updateLevel" style={{textAlign:"center", width:"24%"}}>
                        {/*<img src={``} alt="" style={{width:"50%"}}/>*/}
                        <p>{cardData[4]?.item_name}</p>
                    </div>
                    <div className="updateSkils" style={{textAlign:"center", width:"24%"}}>
                        {/*<img src={``} alt="" style={{width:"50%"}}/>*/}
                        <p>{cardData[3]?.name}</p>
                    </div>
                    <div className="bossSkils" style={{textAlign:"center", width:"24%"}}>
                        {/*<img src={``} alt="" style={{width:"50%"}}/>*/}
                        <p>{cardData[5]?.item_name}</p>
                    </div>
                    <a href={`../Arthefact/${cardData[2]?.id}`} className="artefact" style={{textAlign:"center", width:"24%"}}>
                        {/*<img src={``} alt="" style={{width:"50%"}}/>*/}
                        <p>{cardData[2]?.name}</p>
                    </a>
                </div>
            </div>
        </>
    )
}

export default SinglePersonnage