import { useState } from "react";

function Calendar({
  conges = [],
  setConges,
  onSelectDate
}) {

  const mois = [
    { nom: "Juin 2026", mois: 5, annee: 2026 },
    { nom: "Juillet 2026", mois: 6, annee: 2026 },
    { nom: "Août 2026", mois: 7, annee: 2026 },
    { nom: "Septembre 2026", mois: 8, annee: 2026 },
    { nom: "Octobre 2026", mois: 9, annee: 2026 },
    { nom: "Novembre 2026", mois: 10, annee: 2026 },
    { nom: "Décembre 2026", mois: 11, annee: 2026 },
    { nom: "Janvier 2027", mois: 0, annee: 2027 },
    { nom: "Février 2027", mois: 1, annee: 2027 },
    { nom: "Mars 2027", mois: 2, annee: 2027 },
    { nom: "Avril 2027", mois: 3, annee: 2027 },
    { nom: "Mai 2027", mois: 4, annee: 2027 }
  ];


  const aujourdHui = new Date();

  const moisActuelIndex = Math.max(
    0,
    Math.min(
      mois.length - 1,
      mois.findIndex(
        periode =>
          periode.mois === aujourdHui.getMonth() &&
          periode.annee === aujourdHui.getFullYear()
      )
    )
  );


  const [moisActuel, setMoisActuel] =
    useState(
      moisActuelIndex === -1
        ? 0
        : moisActuelIndex
    );


  const periode = mois[moisActuel];


  function creerJours(mois, annee) {

    const jours = [];

    const premierJour =
      new Date(annee, mois, 1).getDay();

    const decalage =
      premierJour === 0
        ? 6
        : premierJour - 1;

    for (let i = 0; i < decalage; i++) {
      jours.push(null);
    }

    const nombreJours =
      new Date(
        annee,
        mois + 1,
        0
      ).getDate();

    for (let i = 1; i <= nombreJours; i++) {
      jours.push(i);
    }

    return jours;
  }


  function formatDate(jour, mois, annee) {

    return (
      `${annee}-${String(mois + 1).padStart(2, "0")}-${String(jour).padStart(2, "0")}`
    );

  }


  function trouverConge(date) {

    return conges.find(
      conge =>
        conge.debut === date
    );

  }


  function cliquerJour(date) {

    const conge =
      trouverConge(date);

    if (conge) {

      const confirmer =
        window.confirm(
          "Supprimer ce congé ?"
        );

      if (confirmer) {

        setConges(
          conges.filter(
            c =>
              c.debut !== date
          )
        );

      }

      return;
    }

    onSelectDate(date);
  }


  function allerAujourdHui() {

    const index =
      mois.findIndex(
        periode =>
          periode.mois === aujourdHui.getMonth() &&
          periode.annee === aujourdHui.getFullYear()
      );

    if (index !== -1) {
      setMoisActuel(index);
    }

  }


  return (

    <div className="calendar">


      <div className="calendar-title">

        <div>

          <h2>
            📅 Mes congés
          </h2>

          <p>
            Clique sur une journée pour ajouter un congé
          </p>

        </div>

        <button
          className="today-button"
          onClick={allerAujourdHui}
        >
          Aujourd'hui
        </button>

      </div>


      <div className="calendar-navigation">

        <button
          onClick={() =>
            setMoisActuel(
              Math.max(
                0,
                moisActuel - 1
              )
            )
          }
          disabled={moisActuel === 0}
          className="calendar-nav-button"
        >
          ‹
        </button>


        <h3>
          {periode.nom}
        </h3>


        <button
          onClick={() =>
            setMoisActuel(
              Math.min(
                mois.length - 1,
                moisActuel + 1
              )
            )
          }
          disabled={
            moisActuel === mois.length - 1
          }
          className="calendar-nav-button"
        >
          ›
        </button>

      </div>


      <div className="weekdays">

        <div>Lun</div>
        <div>Mar</div>
        <div>Mer</div>
        <div>Jeu</div>
        <div>Ven</div>
        <div>Sam</div>
        <div>Dim</div>

      </div>


      <div className="calendar-grid">

        {creerJours(
          periode.mois,
          periode.annee
        ).map(
          (jour, index) => {

            if (!jour) {

              return (
                <div
                  key={index}
                  className="empty-day"
                />
              );

            }


            const date =
              formatDate(
                jour,
                periode.mois,
                periode.annee
              );


            const conge =
              trouverConge(date);


            const dateObjet =
              new Date(
                periode.annee,
                periode.mois,
                jour
              );


            const jourSemaine =
              dateObjet.getDay();


            const weekEnd =
              jourSemaine === 0 ||
              jourSemaine === 6;


            const estAujourdHui =
              jour === aujourdHui.getDate() &&
              periode.mois === aujourdHui.getMonth() &&
              periode.annee === aujourdHui.getFullYear();


            return (

              <div
                key={index}
                className={`
                  day
                  ${weekEnd ? "weekend" : ""}
                  ${estAujourdHui ? "today" : ""}
                  ${
                    conge
                      ? conge.type === "CP"
                        ? "cp"
                        : "rtt"
                      : ""
                  }
                `}
                onClick={() =>
                  cliquerJour(date)
                }
              >

                <span className="day-number">
                  {jour}
                </span>


                {estAujourdHui && (
                  <span className="today-label">
                    Aujourd'hui
                  </span>
                )}


              
                  {conge && (
  <div className="leave-badge">

    <span className="leave-type">
      {conge.type === "CP"
        ? "🏖️ CP"
        : "⏰ RTT"
      }
    </span>

    {conge.jours === 0.5 && (
      <span className="leave-half">
        {conge.moment === "matin"
          ? "🌅 Matin"
          : "🌇 Après-midi"
        }
      </span>
    )}

  </div>
)}

              </div>

            );

          }
        )}

      </div>


      <div className="calendar-legend">

        <span>
          <i className="legend-cp"></i>
          Congé payé
        </span>

        <span>
          <i className="legend-rtt"></i>
          RTT
        </span>

        <span>
          <i className="legend-today"></i>
          Aujourd'hui
        </span>

      </div>


    </div>

  );

}


export default Calendar;
