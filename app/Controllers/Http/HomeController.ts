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
    const limit = 10;

    const tarefas = await Tarefa.query()
      .join("empresas", "empresas.id", "=", "tarefas.emp_destino")
      .join("pessoas", "pessoas.id", "=", "tarefas.usu_destino")
      .select("tarefas.*")
      .select("empresas.razao_social")
      .select("pessoas.name")
      .orderBy("dataConclusao", "asc")
      .orderBy("prioridade", "asc")
      .orderBy("dataPrevisao", "asc")
      .paginate(page, limit);

    const addPessoas = await Pessoa.query()
      .where({ ativo: false, desligado: false })
      .orderBy("name");

    tarefas.baseUrl("/home");

    return view.render("home/index", {
      tarefas,
      addPessoas,
      pessoas,
      empresas,
    });
  }

  public async filter({ request, view }: HttpContextContract) {
    const empresas = await Empresa.all();

    const pessoas = await Pessoa.query()
      .where({ ativo: true, desligado: false })
      .orderBy("name");

    const page = request.input("page", 1);
    const limit = 10;

    const empDestino = request.input("empDestino");
    const usuDestino = request.input("usuDestino");
    const dataOrigem = request.input("dataOrigem");
    const dataConclusao = request.input("dataConclusao");
    const statusTarefa = request.input("statusTarefa");

    const tarefas = await Tarefa.query()
      .join("empresas", "empresas.id", "=", "tarefas.emp_destino")
      .join("pessoas", "pessoas.id", "=", "tarefas.usu_destino")
      .where((query) => {
        if (empDestino !== null) {
          query.andWhere("empDestino", empDestino);
        }
        if (usuDestino !== null) {
          query.andWhere("usuDestino", usuDestino);
        }
        if (dataOrigem !== null) {
          query.andWhereBetween("dataOrigem", [
            dataOrigem + " 00:00:00",
            dataOrigem + " 23:59:59",
          ]);
        }
        if (dataConclusao !== null) {
          query.andWhereBetween("dataConclusao", [
            dataConclusao + " 00:00:00",
            dataConclusao + " 23:59:59",
          ]);
        }
        if (statusTarefa !== null) {
          query.andWhere("statusTarefa", statusTarefa);
        }
      })
      .select("tarefas.*")
      .select("empresas.razao_social")
      .select("pessoas.name")
      .orderBy("dataConclusao", "asc")
      .orderBy("prioridade", "asc")
      .orderBy("dataPrevisao", "asc")
      .paginate(page, limit);

    const addPessoas = await Pessoa.query()
      .where({ ativo: false, desligado: false })
      .orderBy("name");

    tarefas.baseUrl("/home");

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
