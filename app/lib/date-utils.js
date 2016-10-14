import moment from "lib/moment";

export default function getLastUpdate (date) {
    moment.updateLocale("en", {
        relativeTime : {
            future: "in %s",
            past:   "%s",
            s:  "qualche secondo fa",
            m:  "un minuto fa",
            mm: "%d minuti fa",
            h:  "un' ora fa",
            hh: "%d ore fa",
            d:  "ieri",
            dd: "%d giorni fa",
            M:  "un mese fa",
            MM: "%d mesi fa",
            y:  "un anno fa",
            yy: "%d anni fa"
        }
    });

    const momentDate = moment(date);
    if (date) {
        return momentDate.fromNow();
    }
    return "formato data errato";
}
