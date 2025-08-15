import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css'

import Layout from "./component/Layout.jsx";

import Accueil from "./pages/Accueil.jsx";
import Personnages from "./pages/Personnages.jsx";
import Armes from "./pages/Armes.jsx";
import Arthefacts from "./pages/Arthefacts.jsx";
import SinglePersonnage from "./pageSingle/SinglePersonnage.jsx";
import SingleArme from "./pageSingle/SingleArme.jsx";
import SingleArthefact from "./pageSingle/SingleArthefact.jsx";
import Objets from "./pages/Objets.jsx";
import SingleObjet from "./pageSingle/SingleObjet.jsx";
import Bosses from "./pages/Bosses.jsx";
import SingleBoss from "./pageSingle/SingleBoss.jsx";

function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>

                    <Route index element={<Accueil/>}/>
                    <Route path="/Personnages" element={<Personnages/>}/>
                    <Route path="/Personnage/:id" element={<SinglePersonnage/>}/>
                    <Route path="/Armes" element={<Armes/>}/>
                    <Route path="/Arme/:id" element={<SingleArme/>}/>
                    <Route path="/Arthefacts" element={<Arthefacts/>}/>
                    <Route path="/Arthefact/:id" element={<SingleArthefact/>}/>
                    <Route path="/Objets" element={<Objets/>}/>
                    <Route path="/Objet/:id" element={<SingleObjet/>}/>
                    <Route path="/bosses" element={<Bosses/>}/>
                    <Route path="/boss/:id" element={<SingleBoss/>}/>

                </Route>

                <Route path="*" element={<Accueil/>}/>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
