import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Empresa from "App/Models/Empresa";
import Pessoa from "App/Models/Pessoa";
import Tarefa from "App/Models/Tarefa";
import { DateTime } from "luxon";

export default class TarefaController {
  public async index({ view }: HttpContextContract) {
    const empresas = await Empresa.all();
    const pessoas = await Pessoa.query()
      .where({ ativo: true, desligado: false })
      .orderBy("name");

    const objTarefa = {
      id: 0,
      empOrigem: 0,
      usuOrigem: 0,
      empDestino: 0,
      usuDestino: 0,
      dataOrigem: DateTime.now(),
      dataPrevisao: DateTime.now(),
      dataConclusao: null,
      descricao: "",
      prioridade: 2,
      statusTarefa: "Novo",
      urlOrigem: "",
      urlFinal: "",
    };

    return view.render("tarefa", { objTarefa, empresas, pessoas });
  }

  public async edit({ view, params }: HttpContextContract) {
    const empresas = await Empresa.all();
    const pessoas = await Pessoa.query()
      .where({ ativo: true, desligado: false })
      .orderBy("name");

    const objTarefa = await Tarefa.findOrFail(params.id);

    return view.render("tarefa", { objTarefa, empresas, pessoas });
  }

  public async finalize({ response, session, params }: HttpContextContract) {
    const tarefa = await Tarefa.findOrFail(params.id);

    tarefa.statusTarefa = "Completo";
    tarefa.dataConclusao = DateTime.now();

    await tarefa.save();

    session.flash("notification", "Tarefa finalizada com sucesso!!");

    return response.redirect("back");
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

      if (request.input("id") === "0") {
        this.convertStrToDateTime(
          request.input("dataOrigem"),
          request.input("horaOrigem")
        );
        await Tarefa.create({
          prioridade: validateData.prioridade,
          empOrigem: validateData.empOrigem,
          empDestino: validateData.empDestino,
          usuOrigem: validateData.usuOrigem,
          usuDestino: validateData.usuDestino,
          descricao: validateData.descricao,
          dataOrigem: this.convertStrToDateTime(
            request.input("dataOrigem"),
            request.input("horaOrigem")
          ),
          dataPrevisao: this.convertStrToDateTime(
            request.input("dataPrevisao"),
            request.input("horaPrevisao")
          ),
          statusTarefa: validateData.statusTarefa,
          urlOrigem: request.input("urlOrigem"),
          urlFinal: request.input("urlFinal"),
          dataConclusao:
            request.input("dataConclusao") !== null
              ? this.convertStrToDateTime(
                  request.input("dataConclusao"),
                  request.input("horaConclusao")
                )
              : null,
        });
        session.flash("notification", "Tarefa adicionada com sucesso!");
      } else {
        const tarefa = await Tarefa.findOrFail(request.input("id"));
        tarefa.prioridade = request.input("prioridade");
        tarefa.empOrigem = request.input("empOrigem");
        tarefa.usuOrigem = request.input("usuDestino");
        tarefa.empDestino = request.input("empDestino");
        tarefa.usuDestino = request.input("usuDestino");
        tarefa.descricao = request.input("descricao");
        tarefa.dataOrigem = this.convertStrToDateTime(
          request.input("dataOrigem"),
          request.input("horaOrigem")
        );
        tarefa.dataPrevisao = this.convertStrToDateTime(
          request.input("dataPrevisao"),
          request.input("horaPrevisao")
        );
        tarefa.dataConclusao =
          request.input("dataConclusao") !== null
            ? this.convertStrToDateTime(
                request.input("dataConclusao"),
                request.input("horaConclusao")
              )
            : null;
        tarefa.statusTarefa = request.input("statusTarefa");
        tarefa.urlOrigem = request.input("urlOrigem");
        tarefa.urlFinal = request.input("urlFinal");

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

  public async delete({ response, session, params }: HttpContextContract) {
    const tarefa = await Tarefa.findOrFail(params.id);

    await tarefa.delete();

    session.flash("notification", "Tarefa excluída com sucesso!");

    return response.redirect("back");
  }

  /**
   * Retorna um DateTime Luxon
   */
  public convertStrToDateTime(dataInput: string, horaInput: string): any {
    const dataLuxon = DateTime.fromISO(
      dataInput.concat("T").concat(horaInput).concat(":00.000")
    );

    return dataLuxon;
  }
}
