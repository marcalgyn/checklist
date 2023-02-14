import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Tarefa from "App/Models/Tarefa";

export default class TarefaController {
  public async index({ view }: HttpContextContract) {
    const objTarefa = {
      id: 0,
      empOrigem: "",
      usuOrigem: "",
      empDestino: "",
      usuDestino: "",
      dataOrigem: new Date(),
      dataPrevisao: new Date(),
      dataConclusao: new Date(),
      descricao: "",
      planoAcao: "",
      estatus: "",
      urlOrigem: "",
      urlFinal: "",
    };
    const tarefas = await Tarefa.query().orderBy("descricao", "asc");

    return view.render("tarefa", { objTarefa, tarefas });
  }

  public async edit({ view, params }: HttpContextContract) {
    const objTarefa = await Tarefa.findOrFail(params.id);
    const tarefas = await Tarefa.query().orderBy("descricao", "asc");

    return view.render("tarefa", { objTarefa, tarefas });
  }

  public async create({}: HttpContextContract) {}

  public async delete({}: HttpContextContract) {}
}
