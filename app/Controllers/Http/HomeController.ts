import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Empresa from "App/Models/Empresa";
import Pessoa from "App/Models/Pessoa";
import Tarefa from "App/Models/Tarefa";

export default class HomeController {
  public async index({ request, view }: HttpContextContract) {
    const empresas = await Empresa.all();
    const pessoas = await Pessoa.query()
      .where({ ativo: true, desligado: false })
      .orderBy("name");

    const page = request.input("page", 1);
    const limit = 2;

    const tarefas = await Tarefa.query()
      .orderBy("dataOrigem", "desc")
      .paginate(page, limit);

    console.log("Tarefas", tarefas);

    const addPessoas = await Pessoa.query()
      .where({ ativo: false, desligado: false })
      .orderBy("name");

    tarefas.baseUrl("/home");

    console.log("Tarefas", tarefas);

    return view.render("home/index", {
      tarefas,
      addPessoas,
      pessoas,
      empresas,
    });
  }

  public async welcome({ view }: HttpContextContract) {
    return view.render("welcome");
  }
}
