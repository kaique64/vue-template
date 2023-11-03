import { NotifyService } from "../notify/NotifyService";
import { AbstractRestService } from "./AbstractRestService";
import AuthService from "./AuthService";

export class RestService extends AbstractRestService {
  baseUrl = import.meta.env.VITE_API_URI;

  getUserToken(): Promise<string | null | undefined> {
    return new AuthService().getToken();
  }

  notifyService = NotifyService();

}
