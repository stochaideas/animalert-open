import { ConflictService } from "./conflict.service";
import { ReportController } from "../report.controller";

export class ConflictController extends ReportController {
  constructor() {
    super(new ConflictService());
  }
}
