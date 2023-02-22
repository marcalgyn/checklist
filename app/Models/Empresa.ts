import { BaseModel, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Tarefa from "./Tarefa";

export default class Empresa extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public cnpj: string;

  @column()
  public razaoSocial: string;

  @column()
  public email: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @hasMany(() => Tarefa, { foreignKey: "emp_origem" })
  public empOrigemTarefas: HasMany<typeof Tarefa>;

  @hasMany(() => Tarefa, { foreignKey: "emp_destino" })
  public empDestinoTarefas: HasMany<typeof Tarefa>;
}
