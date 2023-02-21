import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

export default class Tarefa extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public empOrigem: string;

  @column()
  public usuOrigem: number;

  @column()
  public empDestino: number;

  @column()
  public usuDestino: number;

  @column.dateTime()
  public dataOrigem: DateTime;

  @column.dateTime()
  public dataPrevisao: DateTime;

  @column.dateTime()
  public dataConclusao: DateTime;

  @column()
  public descricao: string;

  @column()
  public prioridade: number;

  @column()
  public statusTarefa: string;

  @column()
  public urlOrigem: string;

  @column()
  public urlFinal: string;

  @column.dateTime({ autoCreate: true })
  public createdAt?: DateTime;
}
