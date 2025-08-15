import { Outlet, Link } from "react-router-dom";
import AuthModals from "./AuthModals.jsx";

const Layout = () => {
    const BACK_URI = import.meta.env.VITE_BACK_URI;

    const links = [
        { id: 1, lien: "/", text: "Accueil" },
        { id: 2, lien: "/Personnages", text: "Personnages" },
        { id: 3, lien: "/Armes", text: "Armes" },
        { id: 4, lien: "/Objets", text: "Objets" },
        { id: 5, lien: "/Arthefacts", text: "Artéfacts" }, // vérifie l'orthographe/route
        { id: 6, lien: "/Bosses", text: "Boss" },
    ];

    return (
        <>
            <div id="layout">
                <nav className="link">
                    {links.map(link => (
                        <Link key={link.id} to={link.lien}>
                            {link.text}
                        </Link>
                    ))}
                </nav>

                <div className="btnUser">
                    <AuthModals apiBase={BACK_URI+"/api/auth"} />
                </div>
            </div>

            <Outlet />
        </>
    );
};

export default Layout;
