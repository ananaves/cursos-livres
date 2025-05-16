import { DataBaseModel } from "./DataBaseModel";

//recuperar conexao com o banco
const database = new DataBaseModel().pool;

//classe que representa um Aluno no sistema
export class Aluno {
    static setIdAluno(arg0: number) {
        throw new Error("Method not implemented.");
    }
    private idAluno: number = 0;
    private nomeAluno: string;
    private sobrenomeAluno: string;
    private dataNascimento: Date;
    private cpfAluno: string;
    private emailAluno: string;
    private celularAluno: string;

    /**construtor de classe Aluno
     * @param nomeAluno
     * @param sobrenomeAluno
     * @param dataNascimento
     * @param cpfAluno
     * @param emailAluno
     * @param celularAluno
     */
    public constructor(_nomeAluno: string, _sobrenomeAluno: string, _dataNascimento: Date, _cpfAluno: string, _emailAluno: string, _celularAluno: string) {
        this.nomeAluno = _nomeAluno;
        this.sobrenomeAluno = _sobrenomeAluno;
        this.dataNascimento = _dataNascimento;
        this.cpfAluno = _cpfAluno;
        this.emailAluno = _emailAluno;
        this.celularAluno = _celularAluno;
    }

    //método GET e SET

    //retorna id do aluno
    public getIdAluno(): number {
        return this.idAluno;
    }
    //atribui o parametro ao atributo idAluno
    public setIdAluno(_idAluno: number): void {
        this.idAluno = _idAluno;
    }

    //retorna nome do aluno
    public getNomeAluno() {
        return this.nomeAluno;
    }
    //atribui o parametro ao atributo nomeAluno
    public setNomeAluno(_nomeAluno: string) {
        this.nomeAluno = _nomeAluno;
    }

    //retorna sobrenome do Aluno
    public getSobrenomeAluno() {
        return this.sobrenomeAluno;
    }
    //atribui o parametro ao atributo sobrenomeAluno
    public setSobrenomeAluno(_sobrenomeAluno: string) {
        this.sobrenomeAluno = _sobrenomeAluno;
    }

    //retorna data nascimento do Aluno
    public getDataNascimento() {
        return this.dataNascimento;
    }
    //atribui o parematro ao atributo dataNascimento
    public setDataNascimento(_dataNascimento: Date) {
        this.dataNascimento = _dataNascimento;
    }

    //retorna CPF do Aluno
    public getCpfAluno() {
        return this.cpfAluno;
    }
    //atribui o parematro ao atributo cpfAluno
    public setCpfAluno(_cpfAluno: string) {
        this.cpfAluno = _cpfAluno;
    }

    //retorna  email do Aluno
    public getEmailAluno() {
        return this.emailAluno;
    }
    //atribui o parematro ao atributo emailAluno
    public setEmailAluno(_emailAluno: string) {
        this.emailAluno = _emailAluno;
    }

    //retorna celular do Aluno
    public getCelularAluno() {
        return this.celularAluno;
    }
    //atribui o parematro ao atributo celularAluno
    public setCelularAluno(_celularAluno: string) {
        this.celularAluno = _celularAluno;
    }

    // MÉTODO PARA ACESSAR O BANCO DE DADOS
    // CRUD Create - READ - Update - Delete

    //retorna uma lista com todos os alunos cadastrados no banco
    static async listarAlunos(): Promise<Array<Aluno> | null> {
        //Criando lista vazia para armazenar os alunos
        let listaDeAlunos: Array<Aluno> = [];

        try {
            // consulta no banco
            const querySelectAluno = `SELECT * FROM aluno;`;
            console.log(querySelectAluno);
            //executa no banco
            const respostaBD = await database.query(querySelectAluno);

            //percorre cada resultado retornado pelo banco de dados
            respostaBD.rows.forEach((aluno: any) => {
                //criando objeto aluno
                let novoAluno = new Aluno(
                    aluno.nomeAluno,
                    aluno.sobrenomeAluno,
                    aluno.dataNascimento,
                    aluno.cpfAluno,
                    aluno.emailAluno,
                    aluno.celularAluno
                );
                // adicionando o ID ao obj
                novoAluno.setIdAluno(aluno.id_aluno);
                // adicionar a pessoa na lista
                listaDeAlunos.push(novoAluno);
            });

            //retornado a lista de pessoas para quem chamou a função
            return listaDeAlunos;
        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    //cadastrar um novo aluno no banco de dados
    static async cadastrarAluno(aluno: Aluno): Promise<Boolean> {
        try {
            //cria a consulta (query) para inserir o registro de um aluno nol banco
            const queryInsertAluno = `INSERT INTO Aluno (nome_aluno, sobrenome_aluno, data_nascimento, cpf_aluno, email_aluno, celular_aluno)
                                      VALUES (
                                            '${aluno.getNomeAluno().toUpperCase()}'
                                            '${aluno.getSobrenomeAluno().toUpperCase()}'
                                            '${aluno.getDataNascimento()}'
                                            '${aluno.getCpfAluno().toUpperCase()}'
                                            '${aluno.getEmailAluno().toUpperCase()}'
                                            '${aluno.getCelularAluno()}'
                                            )
                                            RETURNING id_aluno;`;

            // executa a query no banco e armazena o resultado
            const result = await database.query(queryInsertAluno);

            //verifica se a quantidade de linhas que foram alteradas é maior que 0
            if (result.rows.length > 0) {
                //exibe a mensagem de sucesso
                console.log(`Aluno cadastrado com sucesso. ID: ${result.rows[0].id_aluno}`);
                //retorna verdadeiro
                return true;
            }

            //caso a consulta nao tenha sido sucesso, retorna falso
            return false;
            //captura erro                   
        } catch (error) {
            //exibe mensagem com detalhes do erro 
            console.log(`Erro ao cadastrar Aluno: ${error}`);
            //retorna falso
            return false;
        }
    }

    //remover um aluno do banco de dados
    static async removerAluno(id_aluno: number): Promise<Boolean> {
        //varavel para controle de resultado da consulta
        let queryResult = false;

        try {
            //cria a consulta para remover aluno
            const queryDeleteMatricula = `UPDATE Matricula SET status_matricula = FALSE WHERE id_aluno=${id_aluno};`;

            //remove as matriculas associadas ao aluno
            await database.query(queryDeleteMatricula);

            // construção query SQL para deleytar o Aluno
            const queryDeleteAluno = `UPDADE Aluno WHERE id_aluno=${id_aluno};`;

            // executa a query de exclusao e verifica se a operação foi bom-sucedida
            await database.query(queryDeleteAluno).then((result: any) => {
                if (result.rowCount != 0) { queryResult = true; }
            });
            //retorna o resultado da query
            return queryResult;
            //captar qualquer erro
        } catch (error) {
            //caso de errona consulta
            console.log(`Erro na consulta: ${error}`);
            //retorna falso
            return queryResult;
        }
    }

    // Atualiza os dados de um Aluno no Banco
    static async atualizaCadastroAluno(aluno: Aluno): Promise<Boolean> {
        // variavel para armazenar o resultado da consulta
        let queryResult = false;

        try {
            //contrução para atualizar os dados do aluno no banco 
            const queryAtualizarAluno = `UPDADE Aluno SET
                                         nome_aluno = '${aluno.getNomeAluno().toUpperCase()}', 
                                         sobrenome_aluno = '${aluno.getSobrenomeAluno().toUpperCase()}',
                                         data_nascimento = '${aluno.getDataNascimento()}',
                                         cpf_aluno = '${aluno.getCpfAluno().toUpperCase()}',
                                         email_aluno = '${aluno.getEmailAluno().toUpperCase()}',
                                         celular_aluno= '${aluno.getCelularAluno()}'
                                        WHERE id_aluno = ${aluno.idAluno};`;
            //executa a query de atualização e verifica se a operação foi bom-sucedida
            await database.query(queryAtualizarAluno).then((result: any) => {
                if (result.rowCount != 0) { queryResult = true; }
            });
            //retorna o resultado da operação para quem chamou a função
            return queryResult;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return queryResult;
        }
    }

}

