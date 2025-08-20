import {useEffect, useState} from "react";

const Armes = () => {

    const [cardData, setCardData] = useState([]);
    const BACK_URI = import.meta.env.VITE_BACK_URI;

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await fetch(BACK_URI+"/weapon/getWeapons");
                const data = await response.json();

                setCardData(data);
            } catch (err) {
                console.error("Erreur lors du fetch :", err);
            }
        };

        fetchCards();
    }, []);


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const totalPages = Math.ceil(cardData.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCards = cardData.slice(indexOfFirstItem, indexOfLastItem);


    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    function color(result) {
        return result === 5 ? "#ffbb00" :
            result === 4 ? "#8400B0" :
                result === 3 ? "#007dff" :
                    result === 2 ? "#00ff00" :
                        "#CCCCCC";
    }

    return (
        <>
            <div id="content">
                <div id="textTopPage">
                    <div className="line"/>
                    <h1>Armes</h1>
                    <div className="line"/>
                </div>

                <div id="listingItems">
                    {currentCards.map((result) => (
                        <a href={`./Arme/${result.id}`} id="parentLight" key={result.id}>
                            <div>
                                <img src={`../weaponsIcon/${result.name}.webp`} alt={result.name}
                                     style={{width: "100%"}}/>
                                <div id="lightListing" style={{background:`linear-gradient(155deg, rgba(255, 255, 255, 0) 70%, ${color(result.rarity)} 110%)`}}></div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Pagination */}
                <div className="btnPagination">
                    {/* Précédent */}
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Précédent</button>

                    {/* Page 1 */}
                    {currentPage > 3 && (
                        <><button onClick={() => goToPage(1)}>1</button><span>...</span></>
                    )}

                    {/* Page précédente */}
                    {currentPage > 1 && (
                        <button onClick={() => goToPage(currentPage - 1)}>{currentPage - 1}</button>
                    )}

                    {/*Page actuelle */}
                    <button style={{fontWeight: "bold"}}>{currentPage}</button>

                    {/* Deux pages suivantes */}
                    {currentPage + 1 <= totalPages && (
                        <button onClick={() => goToPage(currentPage + 1)}>{currentPage + 1}</button>
                    )}
                    {currentPage + 2 <= totalPages && (
                        <button onClick={() => goToPage(currentPage + 2)}>{currentPage + 2}</button>
                    )}

                    {/* Dernière page */}
                    {currentPage + 2 < totalPages && (
                        <><span>...</span><button onClick={() => goToPage(totalPages)}>{totalPages}</button></>
                    )}

                    {/* Suivant */}
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Suivant</button>
                </div>

            </div>
        </>
    )
}

export default Armes