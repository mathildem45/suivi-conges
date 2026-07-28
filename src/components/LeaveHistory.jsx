function LeaveHistory({
  conges,
  onDelete
}) {

  return (

    <div className="card">

      <h2>
        📋 Historique des congés
      </h2>


      {conges.length === 0 ? (

        <p>
          Aucun congé enregistré
        </p>

      ) : (

        conges
          .slice()
          .sort(
            (a,b) =>
              new Date(a.debut) - new Date(b.debut)
          )
          .map((conge, index) => (

            <div
              key={index}
              className="history-item"
            >

              <span>

                {new Date(conge.debut)
                  .toLocaleDateString("fr-FR")
                }

                {" - "}

                {conge.type === "CP"
                  ? "🏖️ CP"
                  : "⏰ RTT"
                }

                {" - "}

                {conge.jours}
                {" jour"}

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