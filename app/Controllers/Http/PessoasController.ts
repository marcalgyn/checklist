import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Pessoa from "App/Models/Pessoa";

export default class PessoasController {
  public async index({ view }: HttpContextContract) {
    const objPessoa = {
      id: 0,
      name: "",
      email: "",
      telefone: "",
      cargo: 0,
      ativo: 0,
      password: "",
    };
    const pessoas = await Pessoa.query().orderBy("name", "asc");

    return view.render("pessoas", { objPessoa, pessoas });
  }

  public async edit({ view, params }: HttpContextContract) {
    const objPessoa = await Pessoa.findOrFail(params.id);
    const pessoas = await Pessoa.query().orderBy("id", "asc");

    return view.render("pessoas", { objPessoa, pessoas });
  }

  public async create({ request, response, session }: HttpContextContract) {
    try {
      if (request.input("id") === "0") {
        const validationSchema = schema.create({
          name: schema.string(),
          email: schema.string({ trim: true }, [
            rules.email(),
            rules.maxLength(180),
            rules.unique({ table: "pessoas", column: "email" }),
          ]),
          telefone: schema.string(),
          cargo: schema.string(),
          password: schema.string({ trim: true }, [rules.confirmed()]),
        });
        console.log("validationSchema Pessoa", validationSchema);

        const validateData = await request.validate({
          schema: validationSchema,
          messages: {
            "name.required": "Informe o nome",
            "email.required": "Informe o email",
            "telefone.required": "Informe o telefone",
            "cargo.required": "Informe o cargo",
            "password.required": "Informe a senha",
          },
        });

        console.log("Validate Pessoa", validateData);

        await Pessoa.create({
          name: validateData.name,
          email: validateData.email,
          telefone: validateData.telefone,
          cargo: Number(validateData.cargo),
          ativo: !!request.input("ativo"),
          password: validateData.password,
        });
        session.flash("notification", "Pessoa adicionado com sucesso!");
      } else {
        console.log("Ativo", !!request.input("ativo"));
        const pessoa = await Pessoa.findOrFail(request.input("id"));
        pessoa.name = request.input("name");
        pessoa.email = request.input("email");
        pessoa.telefone = request.input("telefone");
        pessoa.cargo = request.input("cargo");
        pessoa.ativo = !!request.input("ativo");
        pessoa.password = request.input("password");
        await pessoa.save();
        session.flash("notification", "Pessoa alterado com sucesso!");
      }
    } catch (error) {
      console.log("Erro Pessoa", error);
      let msg: string = "";
      if (error.code === "ER_DUP_ENTRY") {
        msg = `Erro na operação solicitada!`;
      }
      session.flash("notification", msg);
    }
    return response.redirect("back");
  }

  public async delete({ response, session, params }: HttpContextContract) {
    const pessoa = await Pessoa.findOrFail(params.id);

    await pessoa.delete();

    session.flash("notification", "Pessoa excluída com sucesso!");

    return response.redirect("back");
  }
}
