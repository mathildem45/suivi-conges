function LeaveHistory({
  conges,
  onDelete
}) {


  function formaterDate(date) {

    return new Date(date)
      .toLocaleDateString("fr-FR");

  }



  function regrouperConges() {

    const groupes = [];


    const tries =
      conges
        .slice()
        .sort(
          (a,b) =>
            new Date(a.debut) - new Date(b.debut)
        );



    tries.forEach(conge => {

      const dernier =
        groupes[groupes.length - 1];



      if (
        dernier &&
        dernier.type === conge.type &&
        dernier.jours === conge.jours &&
        new Date(conge.debut) -
        new Date(dernier.fin) === 86400000
      ) {

        dernier.fin = conge.fin;
        dernier.total += conge.jours;

      } else {

        groupes.push({

          ...conge,

          fin: conge.fin,

          total: conge.jours

        });

      }

    });


    return groupes;

  }




  const groupes = regrouperConges();



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


              ⏱️ {conge.total} jour
              {conge.total > 1 ? "s" : ""}


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