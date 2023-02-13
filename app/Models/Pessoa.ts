import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel, beforeSave, column
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class Pessoa extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public telefone: string

  @column()
  public cargo: number

  @column()
  public ativo: boolean


  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @beforeSave()
  public static async hashPassword(pessoa: Pessoa) {
    if (pessoa.$dirty.password) {
      pessoa.password = await Hash.make(pessoa.password)
    }
  }
}

