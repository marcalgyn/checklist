import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Tarefa from "App/Models/Tarefa";

export default class HomeController {
  public async index({ request, view }: HttpContextContract) {
    const page = request.input("page", 1);
    const limit = 2;

    const tarefas = await Tarefa.query()
      .orderBy("dataOrigem", "desc")
      .paginate(page, limit);

    tarefas.baseUrl("/home");

    return view.render("home/index", { tarefas });
  }
}
