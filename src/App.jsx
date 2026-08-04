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


  const bulletin =
    settings.dernierBulletin;


  const dateFinBulletin =
    new Date(bulletin.dateFin);


  /*
   * On ne déduit que les congés explicitement
   * marqués comme devant être déduits.
   */

  const congesADeduire =
    conges.filter(conge =>
      conge.deduireDuSolde === true
    );


  const cpPris =
    congesADeduire
      .filter(conge => conge.type === "CP")
      .reduce(
        (total, conge) =>
          total + Number(conge.jours),
        0
      );


  const rttPris =
    congesADeduire
      .filter(conge => conge.type === "RTT")
      .reduce(
        (total, conge) =>
          total + Number(conge.jours),
        0
      );


  /*
   * Les soldes du bulletin de juillet
   * constituent notre point de départ.
   *
   * Les anciens congés déjà présents dans
   * le bulletin ne doivent pas être déduits.
   *
   * Pour un congé oublié que l'on ajoute
   * manuellement, la case permet de le
   * déduire malgré sa date ancienne.
   */


  const congesApresBulletin =
    congesADeduire.filter(conge =>
      new Date(conge.debut) > dateFinBulletin
    );


  const congesAvantOuDansBulletin =
    congesADeduire.filter(conge =>
      new Date(conge.debut) <= dateFinBulletin
    );


  /*
   * Pour les congés antérieurs au bulletin,
   * on ne déduit que ceux ajoutés après coup.
   *
   * Pour éviter de déduire tes anciens congés
   * déjà connus, on reconnaît les congés
   * initiaux comme déjà pris en compte.
   */


  const clesCongesInitiaux =
    new Set(
      congesInitiaux.map(conge =>
        `${conge.debut}-${conge.type}-${conge.jours}`
      )
    );


  const cpOublies =
    congesAvantOuDansBulletin
      .filter(conge =>
        conge.deduireDuSolde === true &&
        !clesCongesInitiaux.has(
          `${conge.debut}-${conge.type}-${conge.jours}`
        )
      )
      .filter(conge => conge.type === "CP")
      .reduce(
        (total, conge) =>
          total + Number(conge.jours),
        0
      );


  const rttOublies =
    congesAvantOuDansBulletin
      .filter(conge =>
        conge.deduireDuSolde === true &&
        !clesCongesInitiaux.has(
          `${conge.debut}-${conge.type}-${conge.jours}`
        )
      )
      .filter(conge => conge.type === "RTT")
      .reduce(
        (total, conge) =>
          total + Number(conge.jours),
        0
      );


  const cpDepuisBulletin =
    congesApresBulletin
      .filter(conge => conge.type === "CP")
      .reduce(
        (total, conge) =>
          total + Number(conge.jours),
        0
      );


  const rttDepuisBulletin =
    congesApresBulletin
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


  /*
   * CP N-1 est consommé en premier.
   */

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
