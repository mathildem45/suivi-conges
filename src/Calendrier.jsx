import "./App.css";


function Calendrier({ conges }) {


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


  const joursSemaine = [
    "Lun",
    "Mar",
    "Mer",
    "Jeu",
    "Ven",
    "Sam",
    "Dim"
  ];



  function estConge(date) {

    return conges.find(
      (c) =>
        c.debut === date
    );

  }



  function creerJours(mois, annee) {

    const jours = [];

    const premierJour =
      new Date(
        annee,
        mois,
        1
      ).getDay();


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



    for (
      let jour = 1;
      jour <= nombreJours;
      jour++
    ) {

      jours.push(jour);

    }


    return jours;

  }



  return (

    <div className="history">

      <h2>📅 Calendrier annuel</h2>


      {mois.map((m) => (

        <div
          className="calendar-month"
          key={m.nom}
        >


          <h3>
            {m.nom}
          </h3>



          <div className="weekdays">

            {joursSemaine.map((j) => (

              <div key={j}>
                {j}
              </div>

            ))}

          </div>



          <div className="calendar-grid">


            {creerJours(
              m.mois,
              m.annee
            ).map((jour, index) => {


              if (!jour) {

                return (
                  <div
                    key={index}
                    className="empty-day"
                  />
                );

              }



              const date =
                `${m.annee}-${String(m.mois + 1).padStart(2,"0")}-${String(jour).padStart(2,"0")}`;



              const conge =
                estConge(date);



              const jourSemaine =
                new Date(date).getDay();



              const weekEnd =
                jourSemaine === 0 ||
                jourSemaine === 6;



              return (

                <div
                  key={index}
                  className={

                    conge
                      ? "day vacation"
                      : weekEnd
                        ? "day weekend"
                        : "day"

                  }
                >

                  <span>
                    {jour}
                  </span>


                  {conge && (
                    <small>
                      {conge.type === "CP"
                        ? "🏖️"
                        : "⏰"}
                    </small>
                  )}


                </div>

              );


            })}


          </div>


        </div>

      ))}


    </div>

  );

}


export default Calendrier;