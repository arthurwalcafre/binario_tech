exports.seed = async function(knex) {
  // Insere mais 2 veículos sem deletar os existentes
await knex('veiculos').insert([
    { placa: 'MBZ-3030', montadora: 'Mercedes-Benz', modelo: 'Actros 2651' },
    { placa: 'DAF-4040', montadora: 'DAF', modelo: 'XF 530' }
  ]);
};
