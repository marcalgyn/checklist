import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Empresa from "./Empresa";
import Pessoa from "./Pessoa";
import Departamento from "./Departamento";

export default class Patrimonio extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public idEmpresa: number;

  @column()
  public idUsuario: number;

  @column()
  public idDepartamento: number;

  @column.dateTime()
  public dataCompra: DateTime;

  @column.dateTime()
  public dataGarantia: DateTime;

  @column.dateTime()
  public dataBaixa: DateTime;

  @column()
  public descricao: string;

  @column()
  public statusPatrimonio: string;

  @column()
  public urlDocumento: string;

  @column()
  public urlGarantia: string;

  @column.dateTime({ autoCreate: true })
  public createdAt?: DateTime;

  @belongsTo(() => Empresa)
  public empresa: BelongsTo<typeof Empresa>;

  @belongsTo(() => Pessoa)
  public usuario: BelongsTo<typeof Pessoa>;

  @belongsTo(() => Departamento)
  public departamento: BelongsTo<typeof Departamento>;


}
