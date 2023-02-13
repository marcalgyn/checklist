import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Pessoa from "App/Models/Pessoa";

export default class AuthController {
  public showRegister({ view }: HttpContextContract) {
    return view.render("auth/register");
  }

  public async register({ request, auth, response }: HttpContextContract) {
    const validationSchema = schema.create({
      ativo: schema.boolean(),
      name: schema.string({ trim: true }),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.maxLength(255),
        rules.unique({ table: "pessoas", column: "email" }),
      ]),
      password: schema.string({ trim: true }, [rules.confirmed()]),
    });

    const validateData = await request.validate({
      schema: validationSchema,
    });

    const pessoa = await Pessoa.create(validateData);

    await auth.login(pessoa);

    return response.redirect("/home");
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout();

    return response.redirect("/login");
  }

  public async showLogin({ view }: HttpContextContract) {
    return view.render("auth/login");
  }

  public async login({
    request,
    auth,
    session,
    response,
  }: HttpContextContract) {
    const { email, password } = request.all();

    try {
      await auth.attempt(email, password);
      return response.redirect("/home");
    } catch (error) {
      session.flash(
        "notification",
        "Não foi possível verificar suas credenciais"
      );
      return response.redirect("back");
    }
  }
}
