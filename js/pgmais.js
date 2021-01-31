/**
 * @file Este arquivo é o controlador de todo o funcionamento da página web
 * @author David Nunes dos Santos <david_nunesantos@hotmail.com>
 */

/**
 * RegExp contendo as extensões de arquivos aceitas (text.*)
 * @constant {RegExp}
 * @default
 */
const fileExtension  = /text.*/;

/**
 * Objeto do Validator
 * @constant {Validator}
 * @default
 */
const validator = new Validator();

/**
 * Objeto contendo os dados de um arquivo enviado pelo usuário
 * @type {Object.<string, any>}
 * @access private
 */
var file;

/**
 * Objeto com as mensagens válidas
 * @type {Object.<string, DataSend>}
 * @access private
 */
var valid;

/**
 * Array com as mensagens bloqueadas
 * @type {Array<DataSend>}
 * @access private
 */
var blocked;

/**
 * Esta função executada quando a página finaliza sua inicialização
 */
$(function() {
	if (checkBrowserSuportFileApi()) {
		addEventListeners();
	} else {
		noticeMessage(true, 'API de Arquivo não suportada pelo navegador');
	}
});

/**
 * Verifica se o navegador tem suporte para a API de arquivos
 * @returns {boolean}
 */
function checkBrowserSuportFileApi() {
	return window.File && window.FileReader && window.FileList && window.Blob;
}

/**
 * Habilita ou desabilita o campo de mensagem de aviso, os resultados, e os loadings dos resultados
 * @param {boolean} enable Indica se a mensagem deve ser exibida ou não
 * @param {?string} message Mensagem a ser exibida
 */
function noticeMessage(enable, message = '') {
	$('#alertBlock').find('.alert').html(message);
	$('#alertBlock').toggleClass('d-none', !enable);

	showResults(!enable);
	showLoading(!enable);
	
	if (enable) {
		clearResults();
	}
}

/**
 * Mostra ou esconde o bloco de resultados
 * @param {boolean} show Indica se o bloco de resultados deve ser exibido ou não
 */
function showResults(show) {
	$('.resultados').toggleClass('d-none', !show);
}

/**
 * Habilita ou desabilita os spinners de carregamento
 * @param {boolean} show Indica se os spinners de carregamento devem ser exibidos ou não
 */
function showLoading(show) {
	$('.loading').toggleClass('d-none', !show);
	$('.loading').toggleClass('d-flex', show);
	$('#table-blocked').toggleClass('d-none', show);
}

/**
 * Remove os dados dos blocos de validos e bloqueados
 */
function clearResults() {
	$('#validos').find('#conteudo').empty();
	$('#bloqueados').find('#table-blocked').find('tbody').empty();
}

/**
 * Adiciona os eventos à página
 */
function addEventListeners() {
	$('input[type="file"][id="arquivo"]').on('change', function() {
		valid   = {};
		blocked = [];

		clearResults();
		noticeMessage(false);
		checkFile(this);
	});
}

/**
 * Verifica se o arquivo é válido para upload caso seja inicia a leitura
 * @param {Object} file_field Objeto contendo informações do campo de upload de arquivos
 */
function checkFile(file_field) {
	if (file_field.files.length > 0) {
		file = file_field.files[0];

		if (file.type.match(fileExtension)) {
			showLoading(true);
			$('label[for="arquivo"]').text(file.name);
			readFile();
		} else {
			noticeMessage(true, 'Por favor selecione um arquivo de texto (.txt, .csv)');
		}
	} else {
		$('label[for="arquivo"]').text('');
		showResults(false);
	}
}

/**
 * Realiza a leitura do arquivo validando cada linha e enviado para o HTML
 */
function readFile() {
	/**
	 * @type {FileReader}
	 */
	var fileReader = new FileReader();
	fileReader.readAsText(file);

	fileReader.onload = () => {
		var lines = fileReader.result.split(/\r\n|\n/);
		var erro  = false;

		for (var i = 0; i < lines.length; i++) {
			if ($.trim(lines[i]).length > 0) {
				var columns = lines[i].split(';');

				if (columns.length === 1) {
					columns = lines[i].split(',');
				}
		
				if (columns.length === 6) {
					var data_send = new DataSend(columns[0], columns[1], columns[2], columns[3], columns[4], columns[5]);
					validateData(data_send, valid);
				} else {
					erro = true;
					noticeMessage(true, 'Algumas linhas do arquivo <b>' + file.name + '</b> não correspondem ao formato exigido');
					break;
				}
			}
		}

		if (!erro) {
			showInHTML();
			showLoading(false);
			showResults(true);
		}
	}
}

/**
 * Realiza a validação dos dados da mensagem
 * @param {DataSend} data_send Dados de uma mensagem
 */
function validateData(data_send) {
	validator.validate(data_send);

	if (data_send.dadosValidos) {
		if (valid[data_send.numeroCompleto]) {
			var old_data = valid[data_send.numeroCompleto];
			if (validator.haveShortedTime(data_send, old_data)) {
				old_data.dadosValidos	= false;
				old_data.motivoBloqueio = validator._motivos['haveLongerTime'];
				blocked.push(old_data);

				valid[data_send.numeroCompleto] = data_send;
			} else {
				data_send.dadosValidos   = false;
				data_send.motivoBloqueio = validator._motivos['haveLongerTime'];
				blocked.push(data_send);
			}
		} else {
			valid[data_send.numeroCompleto] = data_send;
		}
	} else {
		blocked.push(data_send);
	}
}

/**
 * Percorre as mensagens válidas e bloqueadas e manda seus dados para o HTML
 */
function showInHTML() {
	Object.keys(valid).forEach((chave) => {
		addValidLine(valid[chave]);
	});

	Object.keys(blocked).forEach((chave) => {
		addBlockedLine(blocked[chave]);
	});
}

/**
 * Adiciona uma nova linha ao bloco de dados válidos
 * @param {DataSend} data_send Dados de uma mensagem
 */
function addValidLine(data_send) {
	$('#validos').find('#conteudo').append($('<div />').addClass('col-12').html(data_send.idMensagem + ';' + data_send.brokerId));
}

/**
 * Adiciona uma nova linha a tabela de dados bloqueados
 * @param {DataSend} data_send Dados de uma mensagem
 */
function addBlockedLine(data_send) {
	$('#bloqueados').find('#table-blocked').find('tbody').append(
		$('<tr />').append(
			$('<td />').html(data_send.idMensagem)
		).append(
			$('<td />').html(data_send.numeroDdd)
		).append(
			$('<td />').html(data_send.numeroCelular)
		).append(
			$('<td />').html(data_send.nomeOperadora)
		).append(
			$('<td />').html(data_send.horaEnvio.format('HH:mm:ss'))
		).append(
			$('<td />').html(data_send.mensagem)
		).append(
			$('<td />').html(data_send.motivoBloqueio)
		)
	);
}