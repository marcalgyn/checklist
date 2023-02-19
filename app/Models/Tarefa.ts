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
  public empDestino: number;

  @column()
  public usuDestino: number;

  @column()
  public dataOrigem: DateTime;

  @column()
  public dataPrevisao: DateTime;

  @column()
  public dataConclusao: DateTime;

  @column()
  public descricao: string;

  @column()
  public planoAcao: string;

  @column()
  public status: string;

  @column()
  public urlOrigem: string;

  @column()
  public urlFinal: string;

  @column.dateTime({ autoCreate: true })
  public createdAt?: DateTime;
}
