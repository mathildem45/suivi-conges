function MonthStatus({ bulletin }) {

  const aujourdHui = new Date();

  const moisActuel =
    aujourdHui.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric"
    });

  const dernierBulletin =
    new Date(`${bulletin.mois}-01`).toLocaleDateString(
      "fr-FR",
      {
        month: "long",
        year: "numeric"
      }
    );

  return (

    <div className="month-status">

      <strong>
        📅 Situation au{" "}
        {aujourdHui.toLocaleDateString("fr-FR")}
      </strong>

      <p>
        Dernier bulletin enregistré :{" "}
        <strong>{dernierBulletin}</strong>
      </p>

      <p>
        Mois actuel :{" "}
        <strong>{moisActuel}</strong>
      </p>

    </div>

  );

}

export default MonthStatus;
