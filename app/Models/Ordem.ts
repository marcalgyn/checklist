import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Ordem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public empOrigem: string

  @column()
  public usuOrigem: string

  @column()
  public empDestino: string

  @column()
  public usuDestino: string

  @column()
  public dataOrigem: DateTime

  @column()
  public dataPrevisao: DateTime

  @column()
  public dataConclusao: DateTime

  @column()
  public descricaoProblema: string

  @column()
  public planoAcao: string

  @column()
  public estatus: string

  @column()
  public urlOrigem: string

  @column()
  public urlFinal: string

  @column.dateTime({ autoCreate: true })
  public createdAt?: DateTime

}
