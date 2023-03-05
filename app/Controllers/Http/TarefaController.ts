import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Empresa from "App/Models/Empresa";
import Pessoa from "App/Models/Pessoa";
import Departamento from "App/Models/Departamento";
import Tarefa from "App/Models/Tarefa";
import { DateTime } from "luxon";
import moment from "moment";

export default class TarefaController {
  public async index({ view }: HttpContextContract) {
    const empresas = await Empresa.all();
    const departamentos = await Departamento.all();
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

    return view.render("tarefa", { objTarefa, empresas, pessoas, departamentos });
  }

  public async edit({ view, params } : HttpContextContract) {
    const empresas = await Empresa.all();
    const departamentos = await Departamento.all();
    const pessoas = await Pessoa.query()
      .where({ ativo: true, desligado: false })
      .orderBy("name");

    const objTarefa = await Tarefa.findOrFail(params.id);

    return view.render("tarefa", { objTarefa, empresas, pessoas, departamentos });
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
        depDestino: schema.number(),
        descricao: schema.string({ trim: true }),
        dataOrigem: schema.date(),
        dataPrevisao: schema.date(),
        statusTarefa: schema.string({ trim: true }),

      });

      const validateData = await request.validate({ schema: validationSchema });

      let imagemAbertura: string = "";
      let imagemConclusao: string = "";
      const fileAbertura = request.file("imagemAbertura");
      if (fileAbertura) {
        const nomeImagem = this.normalizaNomeImagem(fileAbertura.clientName);
        imagemAbertura = `/assets/img_tarefas/${nomeImagem}`;
        await fileAbertura.move("public/assets/img_tarefas", {
          name: nomeImagem,
          overwrite: true,
        });
      }

      const fileConclusao = request.file("imagemConclusao");
      if (fileConclusao) {
        const nomeImagem = this.normalizaNomeImagem(fileConclusao.clientName);
        imagemConclusao = `/assets/img_tarefas/${nomeImagem}`;
        await fileConclusao.move("public/assets/img_tarefas", {
          name: nomeImagem,
          overwrite: true,
        });
      }

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
          depDestino: validateData.depDestino,
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
          urlOrigem: imagemAbertura,
          urlFinal: imagemConclusao,
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
        tarefa.depDestino = request.input("depDestino")
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
        if (imagemAbertura !== "") {
          tarefa.urlOrigem = imagemAbertura;
        }
        if (imagemConclusao !== "") {
          tarefa.urlFinal = imagemConclusao;
        }

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

  public async cancela({ response, session, params }: HttpContextContract) {
    const tarefa = await Tarefa.findOrFail(params.id);

    tarefa.statusTarefa = "Cancelado";
    tarefa.dataConclusao = DateTime.now();
    await tarefa.save();

   // await tarefa.delete();

    session.flash("notification", "Tarefa Cancelada com sucesso!");

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

  public normalizaNomeImagem(value: string): string {
    return (
      moment().format("DDMMYYYYHHmmss") +
      "_" +
      value.normalize("NFD").split(" ").join("")
    );
  }
}
