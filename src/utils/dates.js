export function formatDate(date) {

  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");

  return `${annee}-${mois}-${jour}`;

}



export function isWeekend(date) {

  const jour = date.getDay();

  return jour === 0 || jour === 6;

}



export function getDatesBetween(dateDebut, dateFin) {

  const dates = [];

  const courant = new Date(dateDebut);
  const fin = new Date(dateFin);


  while (courant <= fin) {


    if (!isWeekend(courant)) {

      dates.push(
        formatDate(courant)
      );

    }


    courant.setDate(
      courant.getDate() + 1
    );

  }


  return dates;

}