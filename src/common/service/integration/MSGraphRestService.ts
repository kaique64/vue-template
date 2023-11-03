import { AbstractRestService } from "./AbstractRestService";
import AuthService from "./AuthService";

export class MSGraphRestService extends AbstractRestService {
  baseUrl = "https://graph.microsoft.com/v1.0/";

  getUserToken(): Promise<string | null | undefined> {
    return new AuthService().getTokenMSGraph();
  }
}
