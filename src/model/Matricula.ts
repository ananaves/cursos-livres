import { promises } from "dns";
import { DataBaseModel } from "./DataBaseModel";

const database = new DataBaseModel().pool;

export class Matricula {
    private idMatricula: number = 0;
    private idAluno: number;
    private idCurso: number;
    private dataMatricula: Date;
    private statusMatricula: string;

    /**
     * Construtor de Classes Matricula
     * @param idAluno
     * @param idCuro
     * @param dataMatricula
     * @param statusMatricula
     */

    public constructor(_idAluno: number, _idCurso: number, _dataMatricula: Date, _statsMatricula: string) {
        this.idAluno = _idAluno;
        this.idCurso = _idCurso;
        this.dataMatricula = _dataMatricula;
        this.statusMatricula = _statsMatricula;
    }

    //
    public getIdMatricula() {
        return this.idMatricula;
    }
    public setIdMatricula(_idMatricula: number): void {
        this.idMatricula = _idMatricula;
    }

    //
    public getIdAluno() {
        return this.idAluno;
    }
    public setIdAluno(_idAluno: number) {
        this.idAluno = _idAluno;
    }

    //
    public getIdCurso() {
        return this.idCurso;
    }
    public setIdCurso(_idCurso: number) {
        this.idCurso = _idCurso;
    }

    //
    public getDataMatricula() {
        return this.dataMatricula;
    }
    public setDataMatricula(_dataMatricula: Date) {
        this.dataMatricula = _dataMatricula;
    }

    //
    public getStatusMatricula() {
        return this.statusMatricula;
    }
    public setStatusMatricuça(_statsMatricula: string) {
        this.statusMatricula = _statsMatricula;
    }

    // Retorna lista de Matriculas cadastradas no banco
    static async listarMatriculas(): Promise<Array<any> | null> {
        let listaDeMatriculas: Array<any> = [];

        try {
            const querySelectMatricula = `SELECT e.id_matricula, e.id_aluno, e.id_curso, e.data_matricula, e.status_matricula,
                                                 a.nome_aluno, a.sobrenome_aluno, a.cpf_aluno, a.celular_aluno,
                                                 c.nome_curso, c.tipo_curso
                                                 FROM Matricula e
                                                 JOIN Aluno a ON e.id_aluno = a.id_aluno
                                                 JOIN Curso c ON c.id_curso = c.id_curso;`;
            const respostaBD = await database.query(querySelectMatricula);

            if (respostaBD.rows.length === 0) {
                return null;
            }
            respostaBD.rows.forEach((linha: any) => {
                const matricula = {
                    idMatricula: linha.id_matricula,
                    idAluno: linha.id_aluno,
                    idCurso: linha.id_curso,
                    dataMatricula: linha.data_matricula,
                    statusMatricula: linha.status_matricula,
                    aluno: {
                        nomeAluno: linha.nome_aluno,
                        sobrenomeAluno: linha.sobrenome_aluno,
                        cpfAluno: linha.cpf_aluno,
                        celularAluno: linha.celular_aluno
                    },
                    curso: {
                        nomeCurso: linha.nome_curso,
                        tipoCurso: linha.tipo_curso
                    },
                };
                listaDeMatriculas.push(matricula);
            });
            return listaDeMatriculas;
        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    /**
     * Cadastrar uma nova Matricula npo banco de dados
     * @param idAluno
     * @param idCurso
     * @param dataMatricula
     * @param statusMatricula
     */

    static async cadastrarMatricula(
        idAluno: number,
        idCurso: number,
        dataMatricula: Date,
        statusMatricula: string
    ): Promise<any> {
        try {
            const queryInsertMatricula = `INSERT INTO Matricula (id_aluno, id_curso, data_matricula, status_matricula)
                                          VALUES ($1, $2, $3, $4) RETURNING id_matricula;`;
            const valores = [idAluno, idCurso, dataMatricula, statusMatricula];
            const resultado = await database.query(queryInsertMatricula, valores);

            if (resultado.rowCount != 0) {
                console.log(`Matricula cadastrada com sucesso! ID: ${resultado.rows[0].id_matricula}`);
                return resultado.rows[0].id_matricula;
            }
            return false;
        } catch (error) {
            console.log(`Erro ao cadastrar matricula: ${error}`);
            throw new Error('Erro ao cadastrar a matricula.');
        }
    }

    //Atualiza os dados de uma matricula existente no banco 
    static async atualizarMatricula(
        idMatricula: number,
        idAluno: number,
        idCurso: number,
        dataMatricula: Date,
        statusMatricula: string
    ): Promise<any> {
        try {
            const queryUpdateMatricula = `UPDATE Matricula SET id_aluno = $1, id_curso = $2, data_matricula = $3, status_matricula = $4  
                                          WHERE id_emprestimo = $6 RETURNING id_matricula;`;

            const valores = [idAluno, idCurso, dataMatricula, statusMatricula];
            const resultado = await database.query(queryUpdateMatricula, valores);

            if (resultado.rowCount === 0) {
                throw new Error('Matricula não encontrada.');
            }
            return resultado.rows[0].id_matricula;
        } catch (error) {
            console.error(`Erro ao atualizar matricula: ${error}`);
            throw new Error('Erro ao atualizar a matricula.');
        }

    }

    // REmover uma matricula ativa no banco de dados
    static async removerMatricula(idMatricula: number): Promise<boolean> {
        let queryResult = false;

        try {
            const queryDeleteMatricula = `DELETE FROM Matricula WHERE id_matricula=${idMatricula};`;
            const respostaBD = await database.query(queryDeleteMatricula);

            if (respostaBD.rowCount != 0) {
                console.log(`Matricula reovida com sucesso!`);
                queryResult = true;
            }
            return queryResult;
        } catch (error) {
            console.log(`Erro ao remover matricula: ${error}`);
            return queryResult;
        }
    }

}