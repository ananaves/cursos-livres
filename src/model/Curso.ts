import { run } from "node:test";
import { DataBaseModel } from "./DataBaseModel";

const database = new DataBaseModel().pool;

export class Curso {
    private idCurso: number = 0;
    private nomeCurso: string;
    private tipoCurso: string;
    private duracaoCurso: string;
    private turnoCurso: string;

    /**
     * Construtor de Classe Curso
     * @param nomeCurso
     * @param tipoCurso
     * @param duracaoCurso
     * @param turnoCurso
     */

    public constructor(_nomeCurso: string, _tipoCurso: string, _duracaoCurso: string, _turnoCurso: string) {
        this.nomeCurso = _nomeCurso;
        this.tipoCurso = _tipoCurso;
        this.duracaoCurso = _duracaoCurso;
        this.turnoCurso = _turnoCurso;
    }
    //
    public getIdCurso(): number {
        return this.idCurso;
    }
    public setIdCurso(_idCurso: number): void {
        this.idCurso = _idCurso;
    }

    //
    public getNomeCurso() {
        return this.nomeCurso;
    }
    public setNomeCurso(_nomeCurso: string) {
        this.nomeCurso = _nomeCurso;
    }

    //
    public getTipoCurso() {
        return this.tipoCurso;
    }
    public setTipoCurso(_tipoCurso: string) {
        this.tipoCurso = _tipoCurso;
    }

    //
    public getDuracaoCurso() {
        return this.duracaoCurso;
    }
    public setDuracaoCurso(_duracaoCurso: string) {
        this.duracaoCurso = _duracaoCurso;
    }

    //
    public getTurnoCurso() {
        return this.turnoCurso;
    }
    public setTurnoCurso(_turnoCurso: string) {
        this.turnoCurso = _turnoCurso;
    }

    // Lista com todos os cursos cadastrados no banco
    static async ListarCursos(): Promise<Array<Curso> | null> {
        let listaDeCursos: Array<Curso> = [];

        try {
            const querySelectCurso = `SELECT * FROM Curso;`

            const respostaBD = await database.query(querySelectCurso);

            respostaBD.rows.forEach((curso: any) => {
                let novoCurso = new Curso(
                    curso.nome_curso,
                    curso.tipo_curso,
                    curso.duracao_curso,
                    curso.turno_curso
                );

                novoCurso.setIdCurso(curso.id_curso);

                listaDeCursos.push(novoCurso);
            });
            return listaDeCursos;
        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    // Cadastrar um novo Curso no banco de dados
    static async cadastrarCurso(curso: Curso): Promise<Boolean> {
        try {
            const queryInsertCurso = `INSERT INTO Curso (nome_curso, tipo_curso, duracao_curso, turno_curso)
                                      VALUES (
                                        '${curso.getNomeCurso().toUpperCase()}',
                                        '${curso.getTipoCurso().toUpperCase()}',
                                        '${curso.getDuracaoCurso().toUpperCase()}',
                                        '${curso.getTurnoCurso().toUpperCase()}'
                                      )
                                      RETURNING id_curso;`;
            const result = await database.query(queryInsertCurso);

            if (result.rows.length > 0) {
                console.log(`Curso cadastrad com sucesso. ID: ${result.rows[0].id_aluno}`);
                return true;
            }
            return false;
        } catch (error) {
            console.log(`Erro ao cadastrar curso: ${error}`);
            return false;
        }
    }

    // Remover um curso do banco de dados
    static async removerCurso(id_curso: number): Promise<Boolean> {
        let queryResult = false;

        try {
            const queryDeleteMatriculaCurso = `DELETE FROM Matricula WHERE id_curso=${id_curso};`;
            await database.query(queryDeleteMatriculaCurso);

            const queryDeleteCurso = `DELETE FROM Curso WHERE id_curso= ${id_curso};`;
            await database.query(queryDeleteCurso).then((result: any) => {
                if (result.rowCount != 0) { queryResult = true; };
            });

            return queryResult;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return queryResult;
        }
    }

    // Atualiza os dados de um curso no banco de dados
    static async atualizarCadastroCurso(curso: Curso): Promise<Boolean> {
        let queryResult = false;

        try {
            const queryAtualizarCurso = `UPDADE Curso SET 
                                         nome_curso = '${curso.getNomeCurso().toUpperCase()}'
                                         tipo_curso = '${curso.getTipoCurso().toUpperCase()}'
                                         duracao_curso = '${curso.getDuracaoCurso().toUpperCase()}'
                                         turno_curso = '${curso.getTurnoCurso().toUpperCase()}'
                                         WHERE id_curso = ${curso.idCurso};`;
            await database.query(queryAtualizarCurso).then((result: any) => {
                if (result.rowCount != 0) { queryResult = true; }
            });
            return queryResult;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return queryResult;
        }
    }
}