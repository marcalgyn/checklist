import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Ordens extends BaseSchema {
  protected tableName = 'ordens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('emp_origem').notNullable()
      table.integer('usu_origem').notNullable()
      table.integer('emp_destino').notNullable()
      table.integer('usu_destino').notNullable()
      table.date('data_origem').notNullable()
      table.date('data_previsao').nullable()
      table.date('data_conclusao').nullable()
      table.string('descricao_problema', 500).notNullable()
      table.string('plano_acao', 500).nullable()
      table.string('estatus').notNullable()
      table.string('url_origem', 500).nullable()
      table.string('url_final', 500).nullable()
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
