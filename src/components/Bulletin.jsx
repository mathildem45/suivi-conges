import { useState } from "react";

function Bulletin({ bulletin, onSave }) {
  const [mois, setMois] = useState(bulletin.mois);
  const [cpN1, setCpN1] = useState(bulletin.cpN1Disponible);
  const [cpN, setCpN] = useState(bulletin.cpNDisponible);
  const [rtt, setRtt] = useState(bulletin.rttDisponible);

  function enregistrer() {
    const dernierJour = new Date(
      Number(mois.substring(0, 4)),
      Number(mois.substring(5, 7)),
      0
    );

    const dateFin = `${dernierJour.getFullYear()}-${String(
      dernierJour.getMonth() + 1
    ).padStart(2, "0")}-${String(dernierJour.getDate()).padStart(2, "0")}`;

    onSave({
      mois,
      dateFin,
      cpN1Disponible: Number(cpN1),
      cpNDisponible: Number(cpN),
      rttDisponible: Number(rtt),
    });
  }

  return (
    <div className="bulletin">
      <h2>📄 Mon dernier bulletin</h2>

      <label>Mois du bulletin</label>

      <br />

      <select
        className="bulletin-month-select"
        value={mois}
        onChange={(e) => setMois(e.target.value)}
      >
        <option value="2026-01">Janvier 2026</option>
        <option value="2026-02">Février 2026</option>
        <option value="2026-03">Mars 2026</option>
        <option value="2026-04">Avril 2026</option>
        <option value="2026-05">Mai 2026</option>
        <option value="2026-06">Juin 2026</option>
        <option value="2026-07">Juillet 2026</option>
        <option value="2026-08">Août 2026</option>
        <option value="2026-09">Septembre 2026</option>
        <option value="2026-10">Octobre 2026</option>
        <option value="2026-11">Novembre 2026</option>
        <option value="2026-12">Décembre 2026</option>

        <option value="2027-01">Janvier 2027</option>
        <option value="2027-02">Février 2027</option>
        <option value="2027-03">Mars 2027</option>
        <option value="2027-04">Avril 2027</option>
        <option value="2027-05">Mai 2027</option>
        <option value="2027-06">Juin 2027</option>
        <option value="2027-07">Juillet 2027</option>
        <option value="2027-08">Août 2027</option>
        <option value="2027-09">Septembre 2027</option>
        <option value="2027-10">Octobre 2027</option>
        <option value="2027-11">Novembre 2027</option>
        <option value="2027-12">Décembre 2027</option>
      </select>

      <br />
      <br />

      <label>🏖️ CP N-1 disponibles</label>

      <br />

      <input
        type="number"
        step="0.01"
        value={cpN1}
        onChange={(e) => setCpN1(e.target.value)}
      />

      <br />
      <br />

      <label>🏖️ CP N disponibles</label>

      <br />

      <input
        type="number"
        step="0.01"
        value={cpN}
        onChange={(e) => setCpN(e.target.value)}
      />

      <br />
      <br />

      <label>⏰ RTT disponibles</label>

      <br />

      <input
        type="number"
        step="0.01"
        value={rtt}
        onChange={(e) => setRtt(e.target.value)}
      />

      <br />
      <br />

      <button onClick={enregistrer}>
        💾 Enregistrer le bulletin
      </button>
    </div>
  );
}

export default Bulletin;