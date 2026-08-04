


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


  



  function creerJours(mois, annee) {

    const jours = [];

    const premierJour =
      new Date(annee, mois, 1).getDay();


    const decalage =
      premierJour === 0
        ? 6
        : premierJour - 1;


    for(let i = 0; i < decalage; i++) {
      jours.push(null);
    }


    const nombreJours =
      new Date(
        annee,
        mois + 1,
        0
      ).getDate();


    for(let i = 1; i <= nombreJours; i++) {
      jours.push(i);
    }


    return jours;

  }



  function formatDate(jour, mois, annee) {

    return (
      `${annee}-${String(mois + 1).padStart(2,"0")}-${String(jour).padStart(2,"0")}`
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


    if(conge) {

      const confirmer =
        window.confirm(
          "Supprimer ce congé ?"
        );


      if(confirmer) {

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



  return (

    <div className="card">

      <h2>
        📅 Calendrier des congés
      </h2>


      {mois.map(
        periode => (

        <div
          key={periode.nom}
          className="calendar-month"
        >

          <h3>
            {periode.nom}
          </h3>


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
            )
            .map(
              (jour,index)=> {


              if(!jour) {

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



              return (

                <div
                  key={index}
                  className={
                    conge
                    ? conge.type === "CP"
                      ? "day cp"
                      : "day rtt"
                    : "day"
                  }

                  onClick={() =>
                    cliquerJour(date)
                  }

                >

                  {jour}


                  {conge && (
  <small>
    {conge.type === "CP"
      ? "🏖️"
      : "⏰"
    }

    {conge.jours === 0.5 && (
      conge.moment === "matin"
        ? " 🌅"
        : " 🌇"
    )}

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


export default Calendar;