/**
 * @file Destinado a criação da classe Validator
 * @author David Nunes dos Santos <david_nunesantos@hotmail.com>
 */

/** 
 * Array contendo todos os DDDs válidos do Brasil
 * @constant {Array<number>} 
 * @default
 */
const ddds_brasil = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99];

/** 
 * Array contendo todos os DDDs do estado de São Paulo
 * @constant {Array<number>}
 * @default
 */
const ddds_sao_paulo = [11, 12, 13, 14, 15, 16, 17, 18, 19];

/**
 * Hora máxima parmitida para envio
 * @constant {string} 
 * @default
 */
const time_limit = '19:59:59';

/**
 * Número máximo de caracteres permitidos por mensagem
 * @constant {number}
 * @default
 */
const character_limit = 140;

/**
 * Endpoint da API que verifica números em blacklist
 * @constant {string}
 * @default
 */
const endpoint_blacklist = 'https://front-test-pg.herokuapp.com/blacklist/';

/**
 * Objeto contendo os IDs dos brokers de envio, tendo a operadora como chave
 * @constant {Object.<string, number>}
 * @default
 */
const broker = { 'VIVO': 1, 'TIM': 1, 'CLARO': 2, 'OI': 2, 'NEXTEL': 3 };

/**
 * Classe responsável por realizar a validação dos dados de uma mensagem
 * @class
 */
class Validator {

    /**
     * Método construtor
     */
    constructor() {
        /**
         * Objeto com os motivos possíveis de bloqueio
         * @type {Object.<string, string>}
         */
        this._motivos = {
            'isAfterTimeLimit': 'O horário de envio da mensagem ultrapassa o horário limite (Limite: ' + time_limit + ')',
            'exceedsCharacterLimit': 'O conteúdo da mensagem excede o limite de caracteres (Limite: ' + character_limit + ')',
            'isInvalidPhone': 'O número de DDD ou celular é inválido',
            'isStateOfSaoPaulo': 'O DDD pertence ao estado de São Paulo',
            'isInvalidBroker': 'Não existe um broker para essa operadora',
            'isOnBlackList': 'O número (DDD + Celular) esta na blacklist',
            'haveLongerTime': 'Existe um registro com o mesmo número (DDD + Celular) e com a hora de envio menor ou igual'
        };
    }

    /**
     * Realiza a validação dos dados da mensagem
     * @param {DataSend} data_send Dados de uma mensagem
     * @param {Object.<string, DataSend>} data_valid Objeto de mensagens já validadas e aptas para envio
     */
    validate(data_send, data_valid) {
        data_send.dadosValidos = false;

        if (this.isAfterTimeLimit(data_send)) {
            data_send.motivoBloqueio = this._motivos['isAfterTimeLimit'];
        } else if (this.exceedsCharacterLimit(data_send)) {
            data_send.motivoBloqueio = this._motivos['exceedsCharacterLimit'];
        } else if (!this.isPhoneValid(data_send)) {
            data_send.motivoBloqueio = this._motivos['isInvalidPhone'];
        } else if (this.isStateOfSaoPaulo(data_send)) {
            data_send.motivoBloqueio = this._motivos['isStateOfSaoPaulo'];
        } else if (!this.getBroker(data_send)) {
            data_send.motivoBloqueio = this._motivos['isInvalidBroker'];
        } else if (!data_valid[data_send.numeroCompleto] && this.isOnBlackList(data_send)) {
            data_send.motivoBloqueio = this._motivos['isOnBlackList'];
        } else {
            data_send.brokerId     = this.getBroker(data_send);
            data_send.dadosValidos = true;
        }
    }

    /**
     * Verifica se o horário de envio da mensagem ultrapassa o horário limite
     * @param {DataSend} data_send Dados de uma mensagem
     * @returns {boolean}
     */
    isAfterTimeLimit(data_send) {
        return data_send.horaEnvio.isAfter(dayjs('2021-01-01 ' + time_limit, 'HH:mm:ss'));
    }

    /**
     * Verifica se o conteúdo da mensagem excede o limite de caracteres
     * @param {DataSend} data_send Dados de uma mensagem
     * @returns {boolean}
     */
    exceedsCharacterLimit(data_send) {
        return data_send.mensagem.length > character_limit;
    }

    /**
     * Verifica se um número de telefone (DDD + Celular) é válido
     * @param {DataSend} data_send Dados de uma mensagem
     * @returns {boolean}
     */
    isPhoneValid(data_send) {
        return this.isDDDValid(data_send) && this.isNumberValid(data_send);
    }

    /**
     * Verifica se o número de DDD é válido seguindo as seguintes regras:
     * - Deve ser formado por 2 dígitos númericos
     * - Deve estar na lista de DDDs válidos para o Brasil
     * @param {DataSend} data_send Dados de uma mensagem
     * @returns {boolean}
     */
    isDDDValid(data_send) {
        return data_send.numeroDdd.length === 2 && $.inArray(parseInt(data_send.numeroDdd), ddds_brasil) !== -1;
    }

    /**
     * Verifica se o número de celular é válido seguindo as seguintes regras:
     * - Deve ser formado apenas por números
     * - Deve ser formado por 9 dígitos númericos
     * - O primeiro dígido deve ser 9
     * - O segundo dígito deve ser maior do que 6
     * @param {DataSend} data_send Dados de uma mensagem
     * @returns {boolean}
     */
    isNumberValid(data_send) {
        return !isNaN(data_send.numeroCelular) && data_send.numeroCelular.length === 9 && data_send.numeroCelular.charAt(0) == '9' && parseInt(data_send.numeroCelular.charAt(1)) > 6;
    }

    /**
     * Verifica se o DDD é do estado de São Paulo
     * @param {DataSend} data_send Dados de uma mensagem
     * @returns {boolean}
     */
    isStateOfSaoPaulo(data_send) {
        return $.inArray(parseInt(data_send.numeroDdd), ddds_sao_paulo) !== -1;
    }

    /**
     * Retorna o ID do broker de acordo com a operadora, ou false
     * @param {DataSend} data_send Dados de uma mensagem
     * @returns {number|boolean}
     */
    getBroker(data_send) {
        return broker[data_send.nomeOperadora] ?? false;
    }

    /**
     * Verifica se o número (DDD + Celular) esta na blacklist
     * @param {DataSend} data_send Dados de uma mensagem
     * @returns {boolean}
     */
    isOnBlackList(data_send) {
        var result = $.ajax({
            url: endpoint_blacklist + data_send.numeroCompleto,
            type: "get",
            async: false
        });
        
        return result.status === 200 ? true : false;
    }

    /**
     * Verifica se uma nova mensagem com o mesmo número (DDD + Celular) de uma mensagem já validada possui um tempo de envio menor
     * @param {DataSend} new_data Dados de uma mensagem
     * @param {DataSend} old_data Dados de uma mensagem
     * @returns {boolean}
     */
    haveShortedTime(new_data, old_data) {
        return new_data.horaEnvio.isBefore(old_data.horaEnvio);
    }
}