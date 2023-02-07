import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Empresa from 'App/Models/Empresa'

export default class EmpresasController {
  public async index({ view }: HttpContextContract) {
    const objEmpresa = { id: 0, cnpj: '', razaosocial: '', email:'' }
    const empresas = await Empresa.query().orderBy('razaosocial', 'asc')
    
    return view.render('empresa', { objEmpresa, empresas })
  }

  public async edit({ view, params }: HttpContextContract) {
    const objEmpresa = await Empresa.findOrFail(params.id)
    const empresas = await Empresa.query().orderBy('razaosocial', 'asc')

    return view.render('empresa', { objEmpresa, empresas })
  }

  public async create({ request, response, session }: HttpContextContract) {

    const validationSchema = schema.create({
      cnpj: schema.string({ trim: true }, [rules.maxLength(18)]),
      razaosocial: schema.string({ trim: true }, [rules.maxLength(255)]),
      email: schema.string(),
    })

    const validateData = await request.validate({
      schema: validationSchema,
      messages: {
        'cnpj': 'Informe o CNPJ da Empresa',
        'razaosocial': 'Informe a Razão Social da Empresa',
        'email': 'Informe um email',
      },
    })
//required
    try {
      
      if (request.input('id') === '0') {
        await Empresa.create({
          cnpj: validateData.cnpj,
          razaosocial: validateData.razaosocial,
          email: validateData.email

        })
        session.flash('notification', 'Empresa adicionada com sucesso!')
      } else {
        const empresa = await Empresa.findOrFail(request.input('id'))
        empresa.cnpj = request.input('cnpj')
        empresa.razaosocial = request.input('razaosocial')
        empresa.email = request.input('email')
        await empresa.save()
        session.flash('notification', 'Empresa alterada com sucesso!')
      }
    } catch (error) {
      let msg: string = "";
      if (error.code === 'ER_DUP_ENTRY') {
        msg = `Empresa com o CNPJ ${validateData.cnpj} já foi cadastrada.`
      }
      session.flash('notification', msg)
    }

    return response.redirect('back')
  }

  public async delete({ response, session, params }: HttpContextContract) {
    const empresa = await Empresa.findOrFail(params.id)

    await empresa.delete()

    session.flash('notification', 'Empresa excluída com sucesso!')

    return response.redirect('back')
  }
}
