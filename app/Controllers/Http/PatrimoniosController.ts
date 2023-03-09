import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Empresa from "App/Models/Empresa";
import Pessoa from "App/Models/Pessoa";
import Departamento from "App/Models/Departamento";
import Patrimonio from "App/Models/Patrimonio";
import { DateTime } from "luxon";
import moment from "moment";

export default class TarefaController {
  public async index({ view }: HttpContextContract) {
    const empresas = await Empresa.all();
    const departamentos = await Departamento.all();
    const pessoas = await Pessoa.query()
      .where({ ativo: true, desligado: false })
      .orderBy("name");

    const objPatrimonio = {
      id: 0,
      idEmpresa: 0,
      idUsuario: 0,
      idDepartamento: 0,
      dataCompra: DateTime.now(),
      dataGarantia: null,
      dataBaixa: null,
      descricao: "",
      statusPatrimonio: 0,
      urlDocumento: "",
      urlGarantia: "",
    };

    return view.render("patrimonio", { objPatrimonio, empresas, pessoas, departamentos });
  }

  public async edit({ view, params } : HttpContextContract) {
    const empresas = await Empresa.all();
    const departamentos = await Departamento.all();
    const pessoas = await Pessoa.query()
      .where({ ativo: true, desligado: false })
      .orderBy("name");

    const objPatrimonio = await Patrimonio.findOrFail(params.id);

    return view.render("patrimonio", { objPatrimonio, empresas, pessoas, departamentos });
  }


  public async create({ request, response, session }: HttpContextContract) {
    try {
      const validationSchema = schema.create({
        idEmpresa: schema.number(),
        idUsuario: schema.number(),
        idDepartamento: schema.number(),
        dataCompra: schema.date(),
        dataGarantia: schema.date(),
        dataBaixa: schema.date(),
        descricao: schema.string({ trim: true }),
        statusPatrimonio: schema.number(),
        urlDocumento: schema.string({trim: true}),
        urlGarantia: schema.string({trim: true}),

      });

      const validateData = await request.validate({ schema: validationSchema });

      let imagemDocumento: string = "";
      let imagemGarantia: string = "";
      const fileDocumento = request.file("imagemDocumento");
      if (fileDocumento) {
        const nomeImagem = this.normalizaNomeImagem(fileDocumento.clientName);
        imagemDocumento = `/assets/img_patrimonio/${nomeImagem}`;
        await fileDocumento.move("public/assets/img_patrimonio", {
          name: nomeImagem,
          overwrite: true,
        });
      }

      const fileGarantia = request.file("imagemConclusao");
      if (fileGarantia) {
        const nomeImagem = this.normalizaNomeImagem(fileGarantia.clientName);
        imagemGarantia = `/assets/img_patrimonio/${nomeImagem}`;
        await fileGarantia.move("public/assets/img_patrimonio", {
          name: nomeImagem,
          overwrite: true,
        });
      }

      if (request.input("id") === "0") {
          await Patrimonio.create({
          idEmpresa: validateData.idEmpresa,
          idUsuario: validateData.idUsuario,
          idDepartamento: validateData.idDepartamento,
          dataCompra: validateData.dataCompra,
          dataGarantia: validateData.dataGarantia,
          dataBaixa: validateData.dataBaixa,
          descricao: validateData.descricao,
          urlDocumento: validateData.urlDocumento,
          urlGarantia: validateData.urlGarantia,

        });
        session.flash("notification", "Patrimonio adicionado com sucesso!");
      } else {
        const patrimonio = await Patrimonio.findOrFail(request.input("id"));
        patrimonio.idEmpresa = request.input("empresa");
        patrimonio.idUsuario = request.input("usuario");
        patrimonio.idDepartamento = request.input("departamento");
        patrimonio.dataCompra = request.input("dataCompra");
        patrimonio.dataGarantia = request.input("dataGarantia");
        patrimonio.dataBaixa = request.input("dataBaixa")
        patrimonio.descricao = request.input("descricao");


        if (imagemDocumento !== "") {
          patrimonio.urlDocumento = imagemDocumento;
        }
        if (imagemGarantia !== "") {
          patrimonio.urlGarantia = imagemGarantia;
        }

        await patrimonio.save();

        session.flash("notification", "Patrimonio alterado com sucesso!");
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
    const tarefa = await Patrimonio.findOrFail(params.id);

    tarefa.statusPatrimonio = "1";
    //tarefa.dataConclusao = DateTime.now();
    await tarefa.save();

   // await tarefa.delete();

    session.flash("notification", "Patrimonio Cancelada com sucesso!");

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
