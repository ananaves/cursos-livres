import { Matricula } from "../model/Matricula";
import { Request, Response } from "express";


//Define os atributos que devem ser recebidos do cliente nas requisições

interface MatriculaDTO {
    idAluno: number;
    idCurso: number;
    dataMatricula: string;
    statusMatricula: string;
}

class MatriculaController extends Matricula {

    static async todos(req: Request, res: Response): Promise<any> {
        try {
            const listaDeMatriculas = await Matricula.listarMatriculas();

            if (!listaDeMatriculas || listaDeMatriculas.length === 0) {
                return res.status(404).json({ message: 'Nenhuma matricula encontrado.' });
            }

            return res.status(200).json(listaDeMatriculas);
        } catch (error) {
            console.error('Erro ao listar matriculas:', error);
            return res.status(500).json({ message: 'Erro ao listar as matriculas.' });
        }
    }

    //Cadastra um nova mmatricula.
    static async cadastrar(req: Request, res: Response): Promise<any> {
        try {
            const dadosRecebidos: MatriculaDTO = req.body;

            if (!dadosRecebidos.idAluno || !dadosRecebidos.idCurso || !dadosRecebidos.dataMatricula || !dadosRecebidos.statusMatricula
            ) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }

            const novoIdMatricula = await Matricula.cadastrarMatricula(
                dadosRecebidos.idAluno, dadosRecebidos.idCurso, new Date(dadosRecebidos.dataMatricula), dadosRecebidos.statusMatricula
            );

            return res.status(201).json({ message: 'matricula cadastrado com sucesso', idMatricula: novoIdMatricula });

        } catch (error) {
            console.error('Erro ao cadastrar matricula:', error);
            return res.status(500).json({ message: 'Erro ao cadastrar a matricula.' });
        }
    }


    //Atualiza um matricula existente.
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const dadosRecebidos: MatriculaDTO = req.body;
            const idMatricula = parseInt(req.query.idMatricula as string);

            if (!idMatricula || !dadosRecebidos.idAluno || !dadosRecebidos.idCurso || !dadosRecebidos.dataMatricula || !dadosRecebidos.statusMatricula) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }

            const matriculaAtualizada = await Matricula.atualizarMatricula(
                idMatricula, dadosRecebidos.idAluno, dadosRecebidos.idCurso, new Date(dadosRecebidos.dataMatricula), dadosRecebidos.statusMatricula
            );

            return res.status(200).json({ message: 'Matricula atualizado com sucesso', idMatricula: matriculaAtualizada });

        } catch (error) {
            console.error('Erro ao atualizar matricula:', error);
            return res.status(500).json({ message: 'Erro ao atualizar o matricula.' });
        }
    }

    //Método para remover um matricula do banco de dados

    static async remover(req: Request, res: Response): Promise<any> {

        try {
            const idMatricula = parseInt(req.query.idMatricula as string);

            const resultado = await Matricula.removerMatricula(idMatricula);

            if (resultado) {

                return res.status(200).json('Matricula removido com sucesso!');
            } else {
 
                return res.status(400).json('Erro ao remover matricula!');
            }

        } catch (error) {
            console.log(`Erro ao remover o matricula ${error}`);
            return res.status(500).send("error");
        }
    }
}

export default MatriculaController;