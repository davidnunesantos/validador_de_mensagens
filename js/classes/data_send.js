/**
 * @file Destinado a criação da classe DataSend
 * @author David Nunes dos Santos <david_nunesantos@hotmail.com>
 */

/**
 * Classe responsável por estruturar os dados de envio
 * @class
 */
class DataSend {

    /**
     * Pega o ID da mensagem
     * @returns {string}
     */
    get idMensagem() { return this._id_mensagem.toString(); }

    /**
     * Pega o número de DDD
     * @returns {string}
     */
    get numeroDdd() { return this._ddd.toString(); }

    /**
     * Pega o número do celular
     * @returns {string}
     */
    get numeroCelular() { return this._celular.toString(); }

    /**
     * Pega o nome da operadora
     * @returns {string}
     */
    get nomeOperadora() { return this._operadora.toString().toUpperCase(); }

    /**
     * Pega o horário de envio no formato dayjs
     * @returns {object}
     */
    get horaEnvio() { return dayjs('2021-01-01 ' + this._horario_envio, 'HH:mm:ss'); }

    /**
     * Pega o conteúdo da mensagem
     * @returns {string}
     */
    get mensagem() { return this._mensagem.toString(); }

    /**
     * Pega o ID do broker
     * @returns {number}
     */
    get brokerId() { return this._broker_id; }

    /**
     * Pega o número de telefone completo (DDD + Celular)
     * @returns {string}
     */
    get numeroCompleto() { return this.numeroDdd.toString() + this.numeroCelular.toString(); }

    /**
     * Pega o motivo de bloqueio em caso de a mensagem estiver bloqueada
     * @returns {string}
     */
    get motivoBloqueio() { return this._motivo_bloqueio.toString(); }

    /**
     * Pega o status da mensagem
     * @returns {boolean}
     */
    get dadosValidos() { return this._valido; }

    /**
     * Define um novo ID de mensagem
     * @param {string} id_mensagem ID da mensagem
     */
    set idMensagem(id_mensagem) { this._id_mensagem = id_mensagem; }

    /**
     * Define um novo número de DDD
     * @param {string} numero_ddd Número do DDD
     */
    set numeroDdd(numero_ddd) { this._ddd = numero_ddd; }

    /**
     * Define um novo número de celular
     * @param {string} numero_celular Número do celular
     */
    set numeroCelular(numero_celular) { this._celular = numero_celular; }

    /**
     * Define um novo nome de operadora
     * @param {string} nome_operadora Nome da operadora
     */
    set nomeOperadora(nome_operadora) { this._operadora = nome_operadora; }

    /**
     * Define um novo horário de envio
     * @param {string} hora_envio Horário de envio no formato HH:mm:ss
     */
    set horaEnvio(hora_envio) { this._horario_envio = hora_envio; }

    /**
     * Define um novo texto de mensagem
     * @param {string} mensagem Nova mensagem
     */
    set mensagem(mensagem) { this._mensagem = mensagem; }

    /**
     * Define um novo ID do broker
     * @param {number} id_broker ID do broker
     */
    set brokerId(id_broker) { this._broker_id = id_broker; }

    /**
     * Define um novo motivo de bloqueio
     * @param {string} motivo Motivo do bloqueio
     */
    set motivoBloqueio(motivo) { this._motivo_bloqueio = motivo; }

    /**
     * Define o status da mensagem
     * @param {boolean} is_valid
     */
    set dadosValidos(is_valid) { this._valido = is_valid; }

    /**
     * Monta um objeto DataSend
     * @param {string} id_mensagem ID da mensagem
     * @param {string} ddd Número do DDD
     * @param {string} celular Número do celular
     * @param {string} operadora Nome da operadora
     * @param {string} horario_envio Horário de envio no formato HH:mm:ss
     * @param {string} mensagem Texto da mensagem
     */
    constructor(id_mensagem, ddd, celular, operadora, horario_envio, mensagem) {
        this._id_mensagem      = id_mensagem ?? '';
        this._ddd              = ddd ?? '';
        this._celular          = celular ?? '';
        this._operadora        = operadora ?? '';
        this._horario_envio    = horario_envio ?? '';
        this._mensagem         = mensagem ?? '';
        this._broker_id        = null;
        this._motivo_bloqueio  = '';
        this._valido           = false;
    }
}