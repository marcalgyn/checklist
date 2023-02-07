import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Ordem from 'App/Models/Ordem'

export default class OrdemsController {
  public async index({ request, view }: HttpContextContract) {

    const page = request.input('page', 1)
    const limit = 5

    const objOrdem = { id: 0, emp_origem: 0 }
    const ordens = await Ordem.query()
      .orderBy('id', 'asc')
      .paginate(page, limit)

    ordens.baseUrl('/ordems')

    return view.render('ordem', { objOrdem, ordens })
  }

  public async edit({ request, view, params }: HttpContextContract) {

    const page = request.input('page', 1)
    const limit = 11

    const objOrdem = await Ordem.findOrFail(params.id)
    const ordens = await Ordem.query()
      .orderBy('emp_origem', 'asc')
      .paginate(page, limit)

    ordens.baseUrl('/ordems')

    return view.render('ordem', { objOrdem, ordens })
  }

  public async create({ request, response, session }: HttpContextContract) {

    const validationSchema = schema.create({
      id: schema.number(),
    })


    try {

      if (request.input('id') === '0') {
        await Ordem.create({
          id,
     //     aliquota: request.input('aliquota')
        })
        session.flash('notification', 'NCM adicionado com sucesso!')
      } else {
        const ncm = await Ncm.findOrFail(request.input('id'))
        ncm.codigo = request.input('codigo')
        ncm.aliquota = request.input('aliquota')
        await ncm.save()
        session.flash('notification', 'NCM alterado com sucesso!')
      }
    } catch (error) {
      let msg: string = "";
      if (error.code === 'ER_DUP_ENTRY') {
        msg = `NCM ${validateData.codigo} já foi cadastrado.`
      }
      session.flash('notification', msg)
    }

    return response.redirect('back')
  }

  public async delete({ response, session, params }: HttpContextContract) {
    const ncm = await Ncm.findOrFail(params.id)

    await ncm.delete()

    session.flash('notification', 'NCM excluído com sucesso!')

    return response.redirect('back')
  }

}
