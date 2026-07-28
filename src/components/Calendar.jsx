function Calendar({ conges = [], onSelectDate, onDeleteConge }) {
  const mois = [
    { nom: "Juin 2026", m: 5, a: 2026 },
    { nom: "Juillet 2026", m: 6, a: 2026 },
    { nom: "Août 2026", m: 7, a: 2026 },
    { nom: "Septembre 2026", m: 8, a: 2026 },
    { nom: "Octobre 2026", m: 9, a: 2026 },
    { nom: "Novembre 2026", m: 10, a: 2026 },
    { nom: "Décembre 2026", m: 11, a: 2026 },
    { nom: "Janvier 2027", m: 0, a: 2027 },
    { nom: "Février 2027", m: 1, a: 2027 },
    { nom: "Mars 2027", m: 2, a: 2027 },
    { nom: "Avril 2027", m: 3, a: 2027 },
    { nom: "Mai 2027", m: 4, a: 2027 }
  ];

  function creerCalendrier(mois, annee) {
    const jours = [];

    const premierJour = new Date(annee, mois, 1).getDay();
    const decalage = premierJour === 0 ? 6 : premierJour - 1;

    for (let i = 0; i < decalage; i++) {
      jours.push(null);
    }

    const nombreJours = new Date(annee, mois + 1, 0).getDate();

    for (let i = 1; i <= nombreJours; i++) {
      jours.push(i);
    }

    return jours;
  }

  function trouverConge(jour, mois, annee) {
    if (!jour) return null;

    const date =
      `${annee}-${String(mois + 1).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;

    return conges.find(c => c.debut === date);
  }

  function afficherDate(jour, mois, annee) {
    return `${String(jour).padStart(2, "0")}-${String(mois + 1).padStart(2, "0")}-${annee}`;
  }

  return (
    <div className="card">

      <h2>📅 Calendrier des congés</h2>

      <div className="legend">
        <span className="legend-cp">🏖️ CP</span>
        <span className="legend-rtt">⏰ RTT</span>
      </div>

      {mois.map((periode) => (

        <div
          className="calendar-month"
          key={periode.nom}
        >

          <h3>{periode.nom}</h3>

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

            {creerCalendrier(periode.m, periode.a).map((jour, index) => {

              const conge =
                trouverConge(jour, periode.m, periode.a);

              return (

                <div
                  key={index}
                  className={
                    !jour
                      ? "empty-day"
                      : conge?.type === "CP"
                      ? "day vacation cp"
                      : conge?.type === "RTT"
                      ? "day vacation rtt"
                      : "day"
                  }
                  onClick={() => {

  if (!jour) return;


  if (conge) {

    onDeleteConge(conge);

  } else {

    onSelectDate(
      afficherDate(
        jour,
        periode.m,
        periode.a
      )
    );

  }

}}
                >

                  {jour}
                  {conge && (
  <small>
    {conge.jours === 1
      ? "Journée"
      : conge.moment === "matin"
      ? "Matin"
      : "Après-midi"
    }
  </small>
)}

                  {conge && (
  <small>

    {conge.type === "CP"
      ? "🏖️"
      : "⏰"
    }

    {" "}

    {conge.jours === 0.5 && (
      <>
        {conge.moment?.toLowerCase().trim() === "matin"
  ? "🌅"
  : "🌇"
}
      </>
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