import { useEffect, useState } from "react";

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import LeaveHistory from "./components/LeaveHistory";
import AddLeaveModal from "./components/AddLeaveModal";
import MonthlySummary from "./components/MonthlySummary";
import Bulletin from "./components/Bulletin";
import MonthStatus from "./components/MonthStatus";
import OptimizeLeaves from "./components/OptimizeLeaves";
import Backup from "./components/Backup";
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


  /*
   * ============================================================
   * SAUVEGARDE
   * ============================================================
   */

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


  /*
   * ============================================================
   * AJOUT D'UN CONGÉ CLASSIQUE
   * ============================================================
   */

  function ajouterConge(nouveauConge) {

    const dates = getDatesBetween(
      nouveauConge.debut,
      nouveauConge.fin
    );


    const nouveauxConges =
      dates.map(date => ({

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


  /*
   * ============================================================
   * AJOUT D'UNE OPTIMISATION
   * ============================================================
   *
   * Cette fonction reçoit une proposition de
   * l'optimiseur et ajoute uniquement les jours
   * qui doivent réellement être posés.
   */

  function ajouterOptimisation(
    proposition,
    type
  ) {

    if (
      !proposition ||
      !proposition.joursAPoser ||
      proposition.joursAPoser.length === 0
    ) {

      return;

    }


    /*
     * Vérification du solde disponible.
     */

    const nombreJours =
      proposition.nombreJoursAPoser;


    const cpDisponible =
      Number(cpN1Disponible) +
      Number(cpNDisponible);


    const rttDisponibleActuel =
      Number(rttDisponible);


    if (
      type === "CP" &&
      nombreJours > cpDisponible
    ) {

      window.alert(
        "Tu n'as pas assez de CP disponibles pour cette période."
      );

      return;

    }


    if (
      type === "RTT" &&
      nombreJours > rttDisponibleActuel
    ) {

      window.alert(
        "Tu n'as pas assez de RTT disponibles pour cette période."
      );

      return;

    }


    /*
     * Vérification des doublons.
     */

    const joursExistants =
      proposition.joursAPoser.filter(
        date => {

          const iso =
            typeof date === "string"
              ? date
              : date.toISOString().slice(0, 10);

          return conges.some(
            conge =>
              conge.debut === iso
          );

        }
      );


    if (
      joursExistants.length > 0
    ) {

      window.alert(
        "Certains jours de cette période sont déjà posés."
      );

      return;

    }


    /*
     * Création des congés.
     */

    const nouveauxConges =
      proposition.joursAPoser.map(
        date => {

          const iso =
            typeof date === "string"
              ? date
              : `${date.getFullYear()}-${String(
                  date.getMonth() + 1
                ).padStart(2, "0")}-${String(
                  date.getDate()
                ).padStart(2, "0")}`;


          return {

            debut: iso,

            fin: iso,

            type,

            jours: 1,

            moment: null,

            deduireDuSolde: true

          };

        }
      );


    setConges([
      ...conges,
      ...nouveauxConges
    ]);


    window.alert(
      `${nombreJours} jour${
        nombreJours > 1 ? "s" : ""
      } ajouté${
        nombreJours > 1 ? "s" : ""
      } au calendrier.`
    );

  }


  /*
   * ============================================================
   * SUPPRESSION D'UN CONGÉ
   * ============================================================
   */

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
   * ============================================================
   * BULLETIN
   * ============================================================
   */

  function enregistrerBulletin(
    nouveauBulletin
  ) {

    setBulletin(nouveauBulletin);

  }


  /*
   * ============================================================
   * DATE DU BULLETIN
   * ============================================================
   */

  const dateFinBulletin =
    new Date(
      `${bulletin.mois}-01`
    );


  dateFinBulletin.setMonth(
    dateFinBulletin.getMonth() + 1
  );

  dateFinBulletin.setDate(0);


  /*
   * ============================================================
   * CONGÉS À DÉDUIRE
   * ============================================================
   */

  const congesADeduire =
    conges.filter(
      conge =>
        conge.deduireDuSolde === true
    );


  const clesCongesInitiaux =
    new Set(
      congesInitiaux.map(
        conge =>
          `${conge.debut}-${conge.type}-${conge.jours}`
      )
    );


  const congesADeduireAvantBulletin =
    congesADeduire.filter(
      conge => {

        const cle =
          `${conge.debut}-${conge.type}-${conge.jours}`;


        return (
          new Date(conge.debut) <=
            dateFinBulletin &&
          !clesCongesInitiaux.has(cle)
        );

      }
    );


  const congesADeduireApresBulletin =
    congesADeduire.filter(
      conge =>
        new Date(conge.debut) >
        dateFinBulletin
    );


  /*
   * ============================================================
   * CALCUL CP / RTT
   * ============================================================
   */

  const cpOublies =
    congesADeduireAvantBulletin
      .filter(
        conge =>
          conge.type === "CP"
      )
      .reduce(
        (total, conge) =>
          total + Number(conge.jours),
        0
      );


  const rttOublies =
    congesADeduireAvantBulletin
      .filter(
        conge =>
          conge.type === "RTT"
      )
      .reduce(
        (total, conge) =>
          total + Number(conge.jours),
        0
      );


  const cpDepuisBulletin =
    congesADeduireApresBulletin
      .filter(
        conge =>
          conge.type === "CP"
      )
      .reduce(
        (total, conge) =>
          total + Number(conge.jours),
        0
      );


  const rttDepuisBulletin =
    congesADeduireApresBulletin
      .filter(
        conge =>
          conge.type === "RTT"
      )
      .reduce(
        (total, conge) =>
          total + Number(conge.jours),
        0
      );


  const cpTotalADeduire =
    cpOublies +
    cpDepuisBulletin;


  const rttTotalADeduire =
    rttOublies +
    rttDepuisBulletin;


  /*
   * ============================================================
   * SOLDES INITIAUX
   * ============================================================
   */

  const cpN1Depart =
    Number(
      bulletin.cpN1Disponible
    );


  const cpNDepart =
    Number(
      bulletin.cpNDisponible
    );


  const rttDepart =
    Number(
      bulletin.rttDisponible
    );


  /*
   * ============================================================
   * SOLDES ACTUELS
   * ============================================================
   */

  const cpN1Disponible =
    Math.max(
      0,
      cpN1Depart -
      cpTotalADeduire
    );


  const surplusCP =
    Math.max(
      0,
      cpTotalADeduire -
      cpN1Depart
    );


  const cpNDisponible =
    Math.max(
      0,
      cpNDepart -
      surplusCP
    );


  const rttDisponible =
    Math.max(
      0,
      rttDepart -
      rttTotalADeduire
    );


  /*
   * ============================================================
   * AFFICHAGE
   * ============================================================
   */
function ajouterOptimisation(proposition, type) {

  const nouveauxConges =
    proposition.joursAPoser.map(date => ({

      debut: date.toISOString().split("T")[0],
      fin: date.toISOString().split("T")[0],

      type,

      jours: 1,

      moment: null,

      deduireDuSolde: true

    }));


  setConges([
    ...conges,
    ...nouveauxConges
  ]);

}

  return (

    <div className="app">

      <Header />


      <MonthStatus
        bulletin={bulletin}
      />


      <Bulletin

        bulletin={bulletin}

        onSave={
          enregistrerBulletin
        }

      />


      <Dashboard

        cpN1Disponible={
          cpN1Disponible
        }

        cpNDisponible={
          cpNDisponible
        }

        rttDisponible={
          rttDisponible
        }

        cpN1Pris={
          Math.min(
            cpN1Depart,
            cpTotalADeduire
          )
        }

        cpNPris={
          Math.max(
            0,
            cpTotalADeduire -
            cpN1Depart
          )
        }

        rttPris={
          rttTotalADeduire
        }

        conges={
          conges
        }

      />


      <OptimizeLeaves

        cpN1Disponible={
          cpN1Disponible
        }

        cpNDisponible={
          cpNDisponible
        }

        rttDisponible={
          rttDisponible
        }

        conges={
          conges
        }

        onAddOptimization={
          ajouterOptimisation
        }

      />
<Backup
  conges={conges}
  bulletin={bulletin}
/>

      <MonthlySummary

        bulletin={
          bulletin
        }

        cpDepuisBulletin={
          cpDepuisBulletin
        }

        rttDepuisBulletin={
          rttDepuisBulletin
        }

      />


      <Calendar

        conges={
          conges
        }

        setConges={
          setConges
        }

        onSelectDate={
          setDateSelectionnee
        }

      />


      <LeaveHistory

        conges={
          conges
        }

        onDelete={
          supprimerConge
        }

      />


      {dateSelectionnee && (

        <AddLeaveModal

          date={
            dateSelectionnee
          }

          onClose={() =>
            setDateSelectionnee(null)
          }

          onSave={
            ajouterConge
          }

        />

      )}

    </div>

  );

}


export default App;