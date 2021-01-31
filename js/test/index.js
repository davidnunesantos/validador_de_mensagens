/**
 * @file Este arquivo é destinado a realizar testes unitários
 * @author David Nunes dos Santos <david_nunesantos@hotmail.com>
 */

/** 
 * Armazena uma instância do QUnit para realizar os testes
 * @constant {Array<number>} 
 * @default
 */
const { test } = QUnit;

// Impede que o QUnit reordene a lista de testes em caso de erro
QUnit.config.reorder = false;

// Define o nome do módulo a ser testado
QUnit.module("Class DataSend");

// Realiza o teste do constructor para a classe DataSend
test("Test Datasend constructor", assert => {
    var data_send = new DataSend();
    assert.equal(Object.keys(data_send).length, 9, 'Inicialização do construtor');
});

// Realiza o teste dos getters da classe DataSend
test("Test Datasend getters", assert => {
    var data_send = new DataSend('testId', '41', '999999999', 'testOperadora', '12:00:00', 'testMensagem');
    assert.equal(data_send.idMensagem, 'testId', 'Get ID mensagem');
    assert.equal(data_send.numeroDdd, '41', 'Get número DDD');
    assert.equal(data_send.numeroCelular, '999999999', 'Get número celular');
    assert.equal(data_send.nomeOperadora, 'TESTOPERADORA', 'Get nome operadora');
    assert.equal(data_send.horaEnvio.format('HH:mm:ss'), '12:00:00', 'Get hora envio');
    assert.equal(data_send.mensagem, 'testMensagem', 'Get mensagem');
    assert.equal(data_send.numeroCompleto, '41999999999', 'Get número completo');
    assert.equal(data_send.brokerId, null, 'Get broker ID');
    assert.equal(data_send.motivoBloqueio, '', 'Get motivo bloqueio');
    assert.false(data_send.dadosValidos, 'Get dados válidos');
});

// Realiza o teste dos setters da classe DataSend
test("Test Datasend setters", assert => {
    var data_send = new DataSend();
    data_send.idMensagem = 'newId';
    data_send.numeroDdd = '40';
    data_send.numeroCelular = '888888888';
    data_send.nomeOperadora = 'newOperadora'; 
    data_send.horaEnvio = '15:45:52';
    data_send.mensagem = 'newMensagem';
    data_send.brokerId = 'newBrokerId';
    data_send.motivoBloqueio = 'newMotivoBloqueio';
    data_send.dadosValidos = true;

    assert.equal(data_send._id_mensagem, 'newId', 'Set ID mensagem');
    assert.equal(data_send._ddd, '40', 'Set número DDD');
    assert.equal(data_send._celular, '888888888', 'Set número celular');
    assert.equal(data_send._operadora, 'newOperadora', 'Set nome operadora');
    assert.equal(data_send._horario_envio, '15:45:52', 'Set hora envio');
    assert.equal(data_send._mensagem, 'newMensagem', 'Set mensagem');
    assert.equal(data_send._broker_id, 'newBrokerId', 'Set broker ID');
    assert.equal(data_send._motivo_bloqueio, 'newMotivoBloqueio', 'Set motivo bloqueio');
    assert.true(data_send._valido, 'Set dados válidos');
});

// Indica que os próximos testes pertencem a um novo módulo
QUnit.module( "Class Validator" );

// Testa o constructor da classe Validator
test("Test Validator constructor", assert => {
    var validator = new Validator();
    assert.equal(Object.keys(validator._motivos).length, 7, 'Inicialização do construtor');
});

// Testa a função isAfterTimeLimit da classe Validator
test("Test isAfterTimeLimit function", assert => {
    var validator = new Validator();
    var data_send = new DataSend('', '', '', '', '19:59:58', '');

    assert.false(validator.isAfterTimeLimit(data_send), 'Teste com horario de envio menor que o limite');
    data_send.horaEnvio = '20:00:00';
    assert.true(validator.isAfterTimeLimit(data_send), 'Teste com horario de envio maior que o limite');
});

// Testa a função exceedsCharacterLimit da classe Validator
test("Test exceedsCharacterLimit function", assert => {
    var validator = new Validator();
    var data_send = new DataSend('', '', '', '', '', 'testMensagem');

    assert.false(validator.exceedsCharacterLimit(data_send), 'Total com caracteres menor que o limite');
    data_send.mensagem = 'Donec elementum sapien nec dapibus venenatis. Donec lobortis fringilla magna. Morbi dapibus nunc a justo mollis fermentum. Donec placerat nisl eget massa tincidunt, eget vestibulum ligula aliquam.';
    assert.true(validator.exceedsCharacterLimit(data_send), 'Total com caracteres maior que o limite');
});

// Testa a função isDDDValid da classe Validator
test("Test isDDDValid function", assert => {
    var validator = new Validator();
    var data_send = new DataSend('', '41', '', '', '', '');

    assert.true(validator.isDDDValid(data_send), "Teste com número de DDD válido");
    data_send.numeroDdd = '1B';
    assert.false(validator.isDDDValid(data_send), "Teste com número de DDD inválido");
});

// Testa a função isNumberValid da classe Validator
test("Test isNumberValid function", assert => {
    var validator = new Validator();
    var data_send = new DataSend('', '', '999999999', '', '', '');

    assert.true(validator.isNumberValid(data_send), "Teste com número de celular válido");
    data_send.numeroCelular = '969999999';
    assert.false(validator.isNumberValid(data_send), "Teste com número de celular inválido");
});

// Testa a função isPhoneValid da classe Validator
test("Test isPhoneValid function", assert => {
    var validator = new Validator();
    var data_send = new DataSend('', '41', '999999999', '', '', '');

    assert.true(validator.isPhoneValid(data_send), "Teste com número completo válido");
    data_send.numeroCelular = '99999abcd';
    assert.false(validator.isPhoneValid(data_send), "Teste com número completo inválido");
});

// Testa a função isStateOfSaoPaulo da classe Validator
test("Test isStateOfSaoPaulo function", assert => {
    var validator = new Validator();
    var data_send = new DataSend('', '41', '', '', '', '');

    assert.false(validator.isStateOfSaoPaulo(data_send), "Teste sem DDD de São Paulo");
    data_send.numeroDdd = '11';
    assert.true(validator.isStateOfSaoPaulo(data_send), "Teste com DDD de São Paulo");
});

// Testa a função getBroker da classe Validator
test("Test getBroker function", assert => {
    var validator = new Validator();
    var data_send = new DataSend('', '', '', 'testOperadora', '', '');

    assert.false(validator.getBroker(data_send), "Teste com operadora inválida");
    data_send.nomeOperadora = 'TIM';
    assert.equal(validator.getBroker(data_send), 1, "Teste com operadora válida");
});

// Testa a função isOnBlackList da classe Validator
test("Test isOnBlackList function", assert => {
    var validator = new Validator();
    var data_send = new DataSend('', '41', '999999999', '', '', '');

    assert.false(validator.isOnBlackList(data_send), "Teste com número fora da blacklist");
    data_send.numeroDdd = '46';
    data_send.numeroCelular = '950816645';
    assert.true(validator.isOnBlackList(data_send), "Teste com número em blacklist");
});

// Testa a função validate da classe Validator
test("Test validate function", assert => {
    var validator = new Validator();
    var data_send = new DataSend('testId', '41', '999999999', 'TIM', '19:59:58', 'testMensagem');

    validator.validate(data_send, {});
    assert.true(data_send.dadosValidos, "Teste com dados válidos");

    data_send.horaEnvio = '21';
    validator.validate(data_send, {});
    assert.false(data_send.dadosValidos, "Teste com dados inválidos");
});

// Testa a função haveShortedTime da classe Validator
test("Test haveShortedTime function", assert => {
    var validator = new Validator();
    var new_data = new DataSend('testId', '41', '999999999', 'TIM', '16:59:58', 'testMensagem');
    var old_data = new DataSend('testId', '41', '999999999', 'TIM', '17:59:58', 'testMensagem');

    assert.true(validator.haveShortedTime(new_data, old_data), "Teste com novos dados com horário menor");
    
    new_data.horaEnvio = '18:00:00';
    assert.false(validator.haveShortedTime(new_data, old_data), "Teste com novos dados com horário maior");
});