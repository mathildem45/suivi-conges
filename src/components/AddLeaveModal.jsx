import { useState } from "react";

function AddLeaveModal({
  date,
  onClose,
  onSave
}) {

  const [dateDebut, setDateDebut] = useState(date);
  const [dateFin, setDateFin] = useState(date);

  const [type, setType] = useState("CP");
  const [duree, setDuree] = useState("1");
  const [moment, setMoment] = useState("matin");

  function enregistrer() {

    onSave({

      debut: dateDebut,
      fin: dateFin,
      type,
      jours: Number(duree),
      moment:
        duree === "0.5"
          ? moment
          : null

    });

    onClose();

  }

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h2>📅 Ajouter un congé</h2>

        <label>
          Date de début
        </label>

        <br />

        <input
          type="date"
          value={dateDebut}
          onChange={(e) =>
            setDateDebut(e.target.value)
          }
        />

        <br />
        <br />

        <label>
          Date de fin
        </label>

        <br />

        <input
          type="date"
          value={dateFin}
          onChange={(e) =>
            setDateFin(e.target.value)
          }
        />

        <br />
        <br />

        <label>
          Type
        </label>

        <br />

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >

          <option value="CP">
            🏖️ Congé payé
          </option>

          <option value="RTT">
            ⏰ RTT
          </option>

        </select>

        <br />
        <br />

        <label>
          Durée
        </label>

        <br />

        <select
          value={duree}
          onChange={(e) =>
            setDuree(e.target.value)
          }
        >

          <option value="1">
            Journée complète
          </option>

          <option value="0.5">
            Demi-journée
          </option>

        </select>

        {duree === "0.5" && (
          <>
            <br />
            <br />

            <label>
              Moment
            </label>

            <br />

            <select
              value={moment}
              onChange={(e) =>
                setMoment(e.target.value)
              }
            >
              <option value="matin">
                🌅 Matin
              </option>

              <option value="apres-midi">
                🌇 Après-midi
              </option>
            </select>
          </>
        )}

        <br />
        <br />

        <button onClick={onClose}>
          Annuler
        </button>

        {" "}

        <button onClick={enregistrer}>
          Enregistrer
        </button>

      </div>

    </div>

  );

}

export default AddLeaveModal;