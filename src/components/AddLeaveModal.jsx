import { useState } from "react";

function AddLeaveModal({
  date,
  onClose,
  onSave
}) {

  const [type, setType] = useState("CP");
  const [duree, setDuree] = useState(1);
  const [moment, setMoment] = useState("journee");


  function enregistrer() {

    onSave({
      date,
      type,
      duree,
      moment
    });

  }


  return (

    <div className="modal-overlay">

      <div className="modal">

        <h2>
          📅 Nouveau congé
        </h2>


        <p>
          Date sélectionnée
        </p>

        <h3>
          {date}
        </h3>


        <label>

          Type

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

        </label>


        <br />
        <br />


        <label>

          Durée

          <br />

          <select
            value={duree}
            onChange={(e) => {

              const valeur =
                Number(e.target.value);

              setDuree(valeur);

              if(valeur === 1){
                setMoment("journee");
              }

            }}
          >

            <option value={1}>
              Journée entière
            </option>

            <option value={0.5}>
              Demi-journée
            </option>

          </select>

        </label>


        {duree === 0.5 && (

          <>

            <br />
            <br />

            <label>

              Moment

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

            </label>

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