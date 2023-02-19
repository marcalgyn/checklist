import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Empresa from "App/Models/Empresa";
import Tarefa from "App/Models/Tarefa";

export default class TarefaController {
  public async index({ view }: HttpContextContract) {
    const empresas = await Empresa.all();

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

    return view.render("tarefa", { objTarefa, tarefas, empresas });
  }

  public async edit({ view, params }: HttpContextContract) {
    const objTarefa = await Tarefa.findOrFail(params.id);
    const tarefas = await Tarefa.query().orderBy("descricao", "asc");

    return view.render("tarefa", { objTarefa, tarefas });
  }

  public async create({ request, response, session }: HttpContextContract) {
    const validationSchema = schema.create({
      empDestino: schema.number(),
      usuDestino: schema.number(),
      descricao: schema.string(),
      urlOrigem: schema.string(),
      urlFinal: schema.string(),
      dataOrigem: schema.date({ format: "iso" }),
      dataPrevisao: schema.date({ format: "iso" }),
      dataConclusao: schema.date({ format: "iso" }),
      status: schema.string(),
    });

    const validateData = await request.validate({
      schema: validationSchema,
      messages: {
        "empOrigem.required": "Seleciona a empresa de origem",
        "usuDestino.required": "Selecione o reponsável pela tarefa",
        "descricao.required": "Informe a descrição da tarefa",
        "urlOrigem.required": "A imagem de abertura deve ser informada",
        "dataOrigem.required": "Informe a data de origem",
      },
    });

    try {
      if (request.input("id") === "0") {
        await Tarefa.create(validateData);
        session.flash("notification", "Tarefa adicionada com sucesso!");
      } else {
        const tarefa = await Tarefa.findOrFail(request.input("id"));
        (tarefa.empDestino = request.input("empDestino")),
          (tarefa.usuDestino = request.input("usuDestino")),
          (tarefa.descricao = request.input("descricao")),
          (tarefa.urlOrigem = request.input("urlOrigem")),
          (tarefa.urlFinal = request.input("urlFinal")),
          (tarefa.dataOrigem = request.input("dataOrigem")),
          (tarefa.dataPrevisao = request.input("dataPrevisao")),
          (tarefa.dataConclusao = request.input("dataConclusao")),
          (tarefa.status = request.input("status")),
          await tarefa.save();
        session.flash("notification", "Tarefa alterada com sucesso!");
      }
    } catch (error) {
      let msg: string = "";
      if (error.code === "ER_DUP_ENTRY") {
        msg = `Erro na operação solicitada!`;
      }
      session.flash("notification", msg);
    }
    return response.redirect("back");
  }

  public async delete({}: HttpContextContract) {}
}
