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
      .join("departamentos", "departamentos.id", "=", "tarefas.dep_destino")
      .select("tarefas.*")
      .select("empresas.razao_social")
      .select("pessoas.name")
      .select("departamentos.nome")
      .whereNot("status_tarefa", "Completo" )
      .andWhereNot("status_tarefa", "Cancelado" )
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
    const dataInicial = request.input("dataInicial");
    const dataFinal = request.input("dataFinal");
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
        if (dataInicial !== null && dataFinal !== null) {
          query.andWhereBetween("dataOrigem", [
            dataInicial + " 00:00:00",
            dataFinal + " 23:59:59",
          ] );
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
