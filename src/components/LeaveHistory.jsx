
function LeaveHistory({
  conges,
  onDelete
}) {

  function formaterDate(date) {

    return new Date(date)
      .toLocaleDateString("fr-FR");

  }


  function afficherMoment(conge) {

    if (!conge.moment) {
      return "";
    }

    if (conge.moment === "matin") {
      return "🌅 Matin";
    }

    if (conge.moment === "apres-midi") {
      return "🌇 Après-midi";
    }

    return "";

  }


  function regrouperConges() {

    const groupes = [];


    const tries =
      conges
        .slice()
        .sort(
          (a, b) =>
            new Date(a.debut) -
            new Date(b.debut)
        );


    tries.forEach(conge => {

      const dernier =
        groupes[groupes.length - 1];


      const datesConsecutives =
        dernier &&
        new Date(conge.debut) -
        new Date(dernier.fin) === 86400000;


      const memeType =
        dernier &&
        dernier.type === conge.type;


      const memeMoment =
        dernier &&
        dernier.moment === conge.moment;


      if (
        dernier &&
        memeType &&
        memeMoment &&
        datesConsecutives
      ) {

        dernier.fin = conge.fin;

        dernier.total =
          Number(dernier.total) +
          Number(conge.jours);

      } else {

        groupes.push({

          ...conge,

          fin: conge.fin,

          total: Number(conge.jours)

        });

      }

    });


    return groupes;

  }


  const groupes =
    regrouperConges();


  return (

    <div className="card">

      <h2>
        📋 Historique des congés
      </h2>


      {groupes.length === 0 ? (

        <p>
          Aucun congé enregistré
        </p>

      ) : (

        groupes.map((conge, index) => (

          <div
            key={index}
            className="history-item"
          >

            <span>

              {conge.type === "CP"
                ? "🏖️ Congé payé"
                : "⏰ RTT"
              }


              <br />


              📅 Du{" "}
              {formaterDate(conge.debut)}


              {" au "}


              {formaterDate(conge.fin)}


              <br />


              ⏱️{" "}
              {conge.total}{" "}
              {conge.total > 1
                ? "jours"
                : "jour"
              }


              {afficherMoment(conge) && (

                <>
                  {" • "}
                  {afficherMoment(conge)}
                </>

              )}

            </span>


            <button
              onClick={() =>
                onDelete(conge)
              }
            >
              🗑️
            </button>

          </div>

        ))

      )}

    </div>

  );

}


export default LeaveHistory;
