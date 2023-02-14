import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

export default class Tarefa extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public empOrigem: string;

  @column()
  public usuOrigem: string;

  @column()
  public empDestino: string;

  @column()
  public usuDestino: string;

  @column()
  public dataOrigem: Date;

  @column()
  public dataPrevisao: Date;

  @column()
  public dataConclusao: Date;

  @column()
  public descricao: string;

  @column()
  public planoAcao: string;

  @column()
  public estatus: string;

  @column()
  public urlOrigem: string;

  @column()
  public urlFinal: string;

  @column.dateTime({ autoCreate: true })
  public createdAt?: DateTime;
}
