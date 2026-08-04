import { useEffect, useState } from "react";

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import LeaveHistory from "./components/LeaveHistory";
import AddLeaveModal from "./components/AddLeaveModal";
import Bulletin from "./components/Bulletin";
import MonthStatus from "./components/MonthStatus";
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


  const [bulletin, setBulletin] = useState(() => {

    const sauvegarde =
      localStorage.getItem("dernierBulletin");

    return sauvegarde
      ? JSON.parse(sauvegarde)
      : settings.dernierBulletin;

  });


  const [dateSelectionnee, setDateSelectionnee] =
    useState(null);


  useEffect(() => {

    localStorage.setItem(
      "conges",
      JSON.stringify(conges)
    );

  }, [conges]);


  useEffect(() => {

    localStorage.setItem(
      "dernierBulletin",
      JSON.stringify(bulletin)
    );

  }, [bulletin]);


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

      moment: nouveauConge.moment,

      deduireDuSolde:
        nouveauConge.deduireDuSolde

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


  function enregistrerBulletin(nouveauBulletin) {

    setBulletin(nouveauBulletin);

  }


  const dateFinBulletin =
    new Date(
      `${bulletin.mois}-01`
    );


  dateFinBulletin.setMonth(
    dateFinBulletin.getMonth() + 1
  );

  dateFinBulletin.setDate(0);


  const congesADeduire =
    conges.filter(conge =>
      conge.deduireDuSolde === true
    );


  const clesCongesInitiaux =
    new Set(
      congesInitiaux.map(conge =>
        `${conge.debut}-${conge.type}-${conge.jours}`
      )
    );


  const congesADeduireAvantBulletin =
    congesADeduire.filter(conge => {

      const cle =
        `${conge.debut}-${conge.type}-${conge.jours}`;

      return (
        new Date(conge.debut) <= dateFinBulletin &&
        !clesCongesInitiaux.has(cle)
      );

    });


  const congesADeduireApresBulletin =
    congesADeduire.filter(conge =>
      new Date(conge.debut) > dateFinBulletin
    );


  const cpOublies =
    congesADeduireAvantBulletin
      .filter(conge => conge.type === "CP")
      .reduce(
        (total, conge) =>
          total + Number(conge.jours),
        0
      );


  const rttOublies =
    congesADeduireAvantBulletin
      .filter(conge => conge.type === "RTT")
      .reduce(
        (total, conge) =>
          total + Number(conge.jours),
        0
      );


  const cpDepuisBulletin =
    congesADeduireApresBulletin
      .filter(conge => conge.type === "CP")
      .reduce(
        (total, conge) =>
          total + Number(conge.jours),
        0
      );


  const rttDepuisBulletin =
    congesADeduireApresBulletin
      .filter(conge => conge.type === "RTT")
      .reduce(
        (total, conge) =>
          total + Number(conge.jours),
        0
      );


  const cpTotalADeduire =
    cpOublies + cpDepuisBulletin;


  const rttTotalADeduire =
    rttOublies + rttDepuisBulletin;


  const cpN1Depart =
    Number(bulletin.cpN1Disponible);


  const cpNDepart =
    Number(bulletin.cpNDisponible);


  const rttDepart =
    Number(bulletin.rttDisponible);


  const cpN1Disponible =
    Math.max(
      0,
      cpN1Depart - cpTotalADeduire
    );


  const surplusCP =
    Math.max(
      0,
      cpTotalADeduire - cpN1Depart
    );


  const cpNDisponible =
    Math.max(
      0,
      cpNDepart - surplusCP
    );


  const rttDisponible =
    Math.max(
      0,
      rttDepart - rttTotalADeduire
    );


  return (

    <div className="app">

      <Header />

<MonthStatus bulletin={bulletin} />

      <Bulletin

        bulletin={bulletin}

        onSave={enregistrerBulletin}

      />


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


