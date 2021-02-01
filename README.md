# Validador de mensagens
### Consiste em uma página web onde é possível relizar upload de um arquivo .txt ou .csv para realizar uma validação dos dados seguindo algumas regras.

<!--ts-->
   * [Estrutura](#estrutura)
   * [Regras](#regras)
   * [Validação de telefones](#validacao_telefones)
   * [Consultar BlackList](#blacklist)
   * [Como executar o projeto](#como_executar)
   * [Como realizar testes unitários](#como_testar)
   * [Tecnologias utilizadas](#tecnologias)
<!--te-->

<h2 id="estrutura">Estrutura</h2>

    .
    ├── images
    ├── js                      # Arquivos js
    │   ├── classes             # Classes utilizadas para criação e validação de dados
    │   ├── test                # Arquivos de teste
    │   ├── pgmais.js           # Arquivo controlador da página
    ├── library                 # Libs utilizadas na construção do projeto
    │   ├── bootstrap           # Arquivos da biblioteca bootstrap
    │   ├── dayjs               # Arquivos da biblioteca dayjs
    │   ├── jquery              # Arquivos da biblioteca jquery
    │   ├── qunit               # Arquivos da biblioteca qunit
    ├── node_modules            # Arquivos gerados automaticamente do node
    ├── index.html              # Página inicial do projeto
    ├── package.json            # Arquivo de configuração
    ├── README.md               # Readme
    └── testes.html             # Página de testes unitários


<h2 id="regras">Regras</h2>
<ul>
    <li>As mensagens que contenham um <a href="#validacao_telefones">telefone inválido</a> serão bloqueadas;</li>
    <li>Mensagens destinadas a telefones que estão na <a href="#blacklist">BlackList</a> serão bloqueadas;</li>
    <li>Mensagens destinadas a telefones do estado de São Paulo serão bloqueadas;</li>
    <li>Mensagens com horário de agendamento após as 19:59:59 serão bloqueadas;</li>
    <li>Mensagens com mais de 140 caracteres serão bloqueadas</li>
    <li>Caso haja mais de uma mensagem para o mesmo telefone de destino, apenas a mensagem válida com o menor horário de agendamento será considerada;</li>
</ul>

<h2 id="validacao_telefones">Validação de telefones</h2>
<p>A validação dos telefones é realizada de acordo com os critérios abaixo:</p>
<ul>
    <li>O DDD deve ser composto por 2 dígitos;</li>
    <li>O DDD deve ser válido (DDDs do Brasil);</li>
    <li>O número do celular deve ser composto por 9 dígitos;</li>
    <li>O número do celular decve começar sempre com o número 9;</li>
    <li>O segundo dígito do número do celular deve ser maior que 6;</li>
</ul>

<h2 id="blacklist">Consultar BlackList</h2>
<p>A verificação de números em blacklist deve ser realizada atraves de uma api: https://front-test-pg.herokuapp.com/blacklist/:phone</p>
<p>A validação deve ser feita pelo status de retorno, caso seja 200 o número esta em blacklist, do contrário o status será 404</p>

<h2 id="como_executar">Como executar o projeto</h2>
<p>Para ver o projeto em execução basta clicar <a href="https://davidnunesantos.github.io/pgmais/index.html">aqui</a>.</p>
<p>Ou então você pode fazer o download desse repositório e abrir em um navegador <i>web</i> o arquivo <i>index.html</i> que encontra-se na raiz do projeto.</p>

<h2 id="como_testar">Como realizar testes unitários</h2>
<p>Você pode acessar os testes unitários clicando <a href="https://davidnunesantos.github.io/pgmais/testes.html">aqui</a>.</p>
<p>Ou então você pode fazer o download desse repositório e testar em sua máquina local, basta abrir em um navegador <i>web</i> o arquivo <i>testes.html</i> que encontra-se na raiz do projeto. Os testes são realizados utilizando a biblioteca QUnit, que disponibiliza os resultados em uma página HTML.</p>

<h2 id="tecnologias">Tecnologias utilizadas</h2>
<p>As seguintes tecnologias foram utilizadas na construção do projeto:</p>

  * Linguagens:
    * HTML;
    * Javascript;
    * CSS;
  * Tenologias:
    * DayJS;
    * JQuery 3.5.1;
    * Bootstrap 4;
    * QUnit 2.14.0;
    * NodeJS;
    * NPM;
  * SO Linux;
  * Visual Studio Code (editor de texto);
