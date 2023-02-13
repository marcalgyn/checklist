import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Ordem from "App/Models/Ordem";

export default class OrdensController {
  public async index({ request, view }: HttpContextContract) {
    const page = request.input("page", 1);
    const limit = 5;

    const objOrdem = { id: 0, emp_origem: 0 };
    const ordens = await Ordem.query()
      .orderBy("id", "asc")
      .paginate(page, limit);

    ordens.baseUrl("/ordens");

    return view.render("ordem", { objOrdem, ordens });
  }

  public async edit({ request, view, params }: HttpContextContract) {
    const page = request.input("page", 1);
    const limit = 11;

    const objOrdem = await Ordem.findOrFail(params.id);
    const ordens = await Ordem.query()
      .orderBy("emp_origem", "asc")
      .paginate(page, limit);

    ordens.baseUrl("/ordens");

    return view.render("ordem", { objOrdem, ordens });
  }

  public async create({}: HttpContextContract) {}

  public async delete({ response, session, params }: HttpContextContract) {
    const ordem = await Ordem.findOrFail(params.id);

    await ordem.delete();

    session.flash("notification", "Ordem de Serviço excluída com sucesso!");

    return response.redirect("back");
  }
}
