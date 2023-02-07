import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Ordem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public emp_origem: string

  @column()
  public usu_origem: string

  @column()
  public emp_destino: string

  @column()
  public usu_destino: string

  @column()
  public data_origem: DateTime

  @column()
  public data_previsao: DateTime
  
  @column()
  public data_conclusao: DateTime

  @column()
  public descricaoProblema: string

  @column()
  public planoAcao: string

  @column()
  public estatus: string

  @column()
  public url_origem: string

  @column()
  public url_final: string

  @column.dateTime({ autoCreate: true })
  public createdAt?: DateTime

}
