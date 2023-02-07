import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Pessoa from 'App/Models/Pessoa'

export default class PessoasController {
  public async index({ view }: HttpContextContract) {
    const objPessoa = { id: 0, name: '',  email: '', telefone: '', cargo: '', ativo: 'N', password:'' }
    const pessoas = await Pessoa.query().orderBy('name', 'asc')

    console.log('retorno.', objPessoa)
   
    return view.render('pessoas', { objPessoa, pessoas })

  }

  public async edit({ view, params }: HttpContextContract) {
    const objPessoa = await Pessoa.findOrFail(params.id)
    const pessoas = await Pessoa.query().orderBy('id', 'asc')

    return view.render('pessoas', { objPessoa, pessoas })
  }

  public async create({ request, response, session }: HttpContextContract) {

    const validationSchema = schema.create({
      name: schema.string(),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.maxLength(255),
        rules.unique({ table: 'pessoas', column: 'email' }),
      ]),
      telefone: schema.string(),
      cargo: schema.string(),
      ativo: schema.string(),
      password: schema.string({ trim: true }, [rules.confirmed()]),
    })

    const validateData = await request.validate({
      schema: validationSchema,
      /*
      messages: {
        'name.required': 'Informe o Nome',
        'email': 'informe o email',
        'telefone': 'informe o telefone',
        'cargo': 'informe o cargo',
        'ativo': '',
        'password.required': 'informe a senha',
      },
      */
    })

    try {
      console.log("Inserindo")
      if (request.input('id') === '0') {
        await Pessoa.create({
          name: validateData.name,
          email: validateData.email,
          telefone: validateData.telefone,
          cargo: validateData.cargo,
          ativo: validateData.ativo,
          password: validateData.password,
        })
        session.flash('notification', 'Pessoa adicionado com sucesso!')
      } else {
        console.log("Segue ",  request.input('ativo'))

        const pessoas = await Pessoa.findOrFail(request.input('id'))
        pessoas.name = request.input('name'),
        pessoas.email= request.input('email'),
        pessoas.telefone = request.input('telefone'),
        pessoas.cargo = request.input('cargo'),
        pessoas.ativo = request.input ('ativo'),
        pessoas.password = request.input('password'),
        await pessoas.save()
        session.flash('notification', 'Pessoa alterado com sucesso!')
      }

    } catch (error) {
      let msg: string = "";
      if (error.code === 'ER_DUP_ENTRY') {
        msg = `Nome ${validateData.name} Está em branco.`
      }
      session.flash('notification', msg)
    }
    console.log("saindo")
    return response.redirect('back')
  }

  public async delete({ response, session, params }: HttpContextContract) {
    const pessoa = await Pessoa.findOrFail(params.id)

    await pessoa.delete()

    session.flash('notification', 'Pessoa excluída com sucesso!')

    return response.redirect('back')
  }

}
