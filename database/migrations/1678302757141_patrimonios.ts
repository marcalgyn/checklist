import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'patrimonios'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.integer("idEmpresa").references("empresas.id");
      table.integer("idUsuario").references("pessoas.id");
      table.integer("idDepartamento").references("departamentos.id");
      table.timestamp("dataCompra").nullable();
      table.timestamp("dataGarantia").nullable();
      table.timestamp("dataBaixa").nullable();
      table.string("descricao", 250).notNullable();
      table.string("statusPatrimonio",5).notNullable();
      table.string("urlDocumento").nullable();
      table.string("urlGarantia").nullable();
      table.timestamp("createdAt", {useTz: true}).notNullable()
      .defaultTo(this.now());


    })
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
