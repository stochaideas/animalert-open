import { ComplaintTemplateService } from "./complaintTemplate.service";

export class ComplaintTemplateController {
  private complaintTemplateService: ComplaintTemplateService;
  constructor() {
    this.complaintTemplateService = new ComplaintTemplateService();
  }

  async getTemplate(id: number) {
    return this.complaintTemplateService.getTemplate(id);
  }

  async getTemplateTypes() {
    return this.complaintTemplateService.getTemplateTypes();
  }
}
