export class Env {
    public static API_URL = "http://localhost:8080/api/";

    public static AUTH = this.API_URL + "auth/";

    public static LOGIN = this.AUTH + "connexion-admin";

    public static ADMIN = this.API_URL + "admin/";

    public static CHANGE_MDP = this.AUTH + "change-password";

    public static INSCRIPTION = this.AUTH + "inscription";

    public static USER = this.ADMIN + "utilisateurs";

    public static STATISTIQUE = this.ADMIN + "stats";

    public static MISSION = this.ADMIN + "missions";

    public static PAIEMENT = this.ADMIN + "paiements";

}
