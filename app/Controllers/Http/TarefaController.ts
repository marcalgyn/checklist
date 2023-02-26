import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Empresa from "App/Models/Empresa";
import Pessoa from "App/Models/Pessoa";
import Tarefa from "App/Models/Tarefa";

export default class TarefaController {
  public async index({ view }: HttpContextContract) {
    const empresas = await Empresa.all();
    const pessoas = await Pessoa.query()
      .where({ ativo: true, desligado: false })
      .orderBy("name");

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
      prioridade: 1,
      statusTarefa: "Novo",
      urlOrigem: "",
      urlFinal: "",
    };

    return view.render("tarefa", { objTarefa, empresas, pessoas });
  }

  public async edit({ view, params }: HttpContextContract) {
    const objTarefa = await Tarefa.findOrFail(params.id);
    console.log("Tarefa", objTarefa.$attributes);

    return view.render("tarefa", { objTarefa });
  }

  public async create({ request, response, session }: HttpContextContract) {
    try {
      const validationSchema = schema.create({
        prioridade: schema.number(),
        empOrigem: schema.number(),
        empDestino: schema.number(),
        usuOrigem: schema.number(),
        usuDestino: schema.number(),
        descricao: schema.string({ trim: true }),
        dataOrigem: schema.date(),
        dataPrevisao: schema.date(),
        statusTarefa: schema.string({ trim: true }),
      });

      const validateData = await request.validate({ schema: validationSchema });
      console.log("ValidateData", validateData);

      if (request.input("id") === "0") {
        await Tarefa.create(validateData);
        session.flash("notification", "Tarefa adicionada com sucesso!");
      } else {
        const tarefa = await Tarefa.findOrFail(request.input("id"));
        tarefa.empOrigem = request.input("empOrigem");
        tarefa.usuOrigem = request.input("usuDestino");
        tarefa.empDestino = request.input("empDestino");
        tarefa.usuDestino = request.input("usuDestino");
        tarefa.descricao = request.input("descricao");
        tarefa.urlOrigem = request.input("urlOrigem");
        tarefa.urlFinal = request.input("urlFinal");
        tarefa.dataOrigem = request.input("dataOrigem");
        tarefa.dataPrevisao = request.input("dataPrevisao");
        tarefa.dataConclusao = request.input("dataConclusao");
        tarefa.statusTarefa = request.input("statusTarefa");

        await tarefa.save();

        session.flash("notification", "Tarefa alterada com sucesso!");
      }
    } catch (error) {
      console.log("Error:", error);
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
