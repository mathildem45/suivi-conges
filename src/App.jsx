import { useEffect, useState } from "react";

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import LeaveHistory from "./components/LeaveHistory";
import AddLeaveModal from "./components/AddLeaveModal";

import { getDatesBetween } from "./utils/dates";
import { settings } from "./data/settings";
import { congesInitiaux } from "./data/conges";

import "./App.css";


function App() {

  const [conges, setConges] = useState(() => {

    const sauvegarde =
      localStorage.getItem("conges");

    return sauvegarde
      ? JSON.parse(sauvegarde)
      : congesInitiaux;

  });


  const [dateSelectionnee, setDateSelectionnee] =
    useState(null);


  useEffect(() => {

    localStorage.setItem(
      "conges",
      JSON.stringify(conges)
    );

  }, [conges]);


  function ajouterConge(nouveauConge) {

    const dates = getDatesBetween(
      nouveauConge.debut,
      nouveauConge.fin
    );


    const nouveauxConges = dates.map(date => ({

      debut: date,
      fin: date,

      type: nouveauConge.type,

      jours: nouveauConge.jours,

      moment: nouveauConge.moment

    }));


    setConges([
      ...conges,
      ...nouveauxConges
    ]);

  }


  function supprimerConge(congeASupprimer) {

    const confirmation =
      window.confirm(
        "Supprimer cette période de congé ?"
      );


    if (!confirmation) {
      return;
    }


    setConges(
      conges.filter(
        c =>
          !(
            c.type === congeASupprimer.type &&
            new Date(c.debut) >=
              new Date(congeASupprimer.debut) &&
            new Date(c.debut) <=
              new Date(congeASupprimer.fin)
          )
      )
    );

  }


  /*
   * ==========================================
   * DERNIER BULLETIN CONNU
   * ==========================================
   */

  const bulletin =
    settings.dernierBulletin;


  /*
   * CP N-1
   *
   * 9 acquis - 6 pris = 3 disponibles
   */

  const cpN1Disponible =
    Number(bulletin.cpN1Acquis) -
    Number(bulletin.cpN1Pris);


  /*
   * CP N
   *
   * Le bulletin de juillet indique 4,17.
   *
   * On ne retire PAS les anciens congés,
   * car ils sont déjà pris en compte
   * dans le bulletin.
   */

  const cpNDisponible =
    Number(bulletin.cpNAcquis);


  /*
   * RTT
   *
   * Le bulletin indique 2,95.
   */

  const rttDisponible =
    Number(bulletin.rttAcquis);


  return (

    <div className="app">

      <Header />


      <Dashboard

        cpN1Disponible={cpN1Disponible}

        cpNDisponible={cpNDisponible}

        rttDisponible={rttDisponible}

      />


      <Calendar

        conges={conges}

        setConges={setConges}

        onSelectDate={setDateSelectionnee}

      />


      <LeaveHistory

        conges={conges}

        onDelete={supprimerConge}

      />


      {dateSelectionnee && (

        <AddLeaveModal

          date={dateSelectionnee}

          onClose={() =>
            setDateSelectionnee(null)
          }

          onSave={ajouterConge}

        />

      )}

    </div>

  );

}


export default App;