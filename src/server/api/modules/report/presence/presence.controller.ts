import { PresenceService } from "./presence.service";
import { ReportController } from "../report.controller";

export class PresenceController extends ReportController {
  constructor() {
    super(new PresenceService());
  }
}
