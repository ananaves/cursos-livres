import { Curso }  from "../model/Curso"
import { Request, Response } from "express";

//Define os atributos que devem ser recebidos do curso nas requisições
interface CursoDTO {
    nomeCurso: string;
    tipoCurso: string;
    duracaoCurso: string;
    turnoCurso: string;
}

// Controlador para operações relacionadas aos cursos.
class CursoController extends Curso {
    /**
     * Lista todos os cursos.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     * @returns Lista de cursos em formato JSON.
     */

    static async todos(req: Request, res: Response) {
        try {
            const listaDeCursos = await Curso.ListarCursos();
            res.status(200).json(listaDeCursos);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);
            res.status(400).json('Erro ao recuperara as informações do Curso');
        }
    }

    // Cadastra um novo curso
    static async cadastrar(req: Request, res: Response): Promise<any> {
        try {
            const dadosrecebidos: CursoDTO = req.body;
            const novoCurso = new Curso(
                dadosrecebidos.nomeCurso,
                dadosrecebidos.tipoCurso,
                dadosrecebidos.duracaoCurso,
                dadosrecebidos.turnoCurso
            );
            const result = await Curso.cadastrarCurso(novoCurso);

            if (result) {
                return res.status(200).json(`Curso cadastrado com sucesso`);
            } else {
                return res.status(400).json('Não foi possível cadastrar o curso no banco de dados');
            }
        } catch (error) {
            console.log(`Erro ao cadastrar o curso: ${error}`);
            return res.status(400).json('Erro ao cadastrar o curso');
        }
    }

    //Remove um curso
    static async remover(req: Request, res: Response): Promise<any> {
        try {
            const idCurso = parseInt(req.query.idCuro as string);
            const result = await Curso.removerCurso(idCurso);
            
            if (result) {
                return res.status(200).json('Curso removido com sucesso');
            } else {
                return res.status(401).json('Erro ao deletar curso');
            }
        } catch (error) {
            console.log("Erro ao remover o curso");
            console.log(error);
            return res.status(500).send("error");
        }
    }

    //Atualizar o cadastro de um curso
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const dadosrecebidos: CursoDTO = req.body;
            const curso = new Curso(
                dadosrecebidos.nomeCurso,
                dadosrecebidos.tipoCurso,
                dadosrecebidos.duracaoCurso,
                dadosrecebidos.turnoCurso
            );

            curso.setIdCurso(parseInt(req.query.idCurso as string));

            // Chama o método para atualizar o cadastro do curso no banco de dados
            if (await Curso.atualizarCadastroCurso(curso)) {
                return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso!" });
            } else {
                return res.status(400).json('Não foi possível atualizar o curso no banco de dados');
            }
        } catch (error) {
            // Caso ocorra algum erro, este é registrado nos logs do servidor
            console.error(`Erro no modelo: ${error}`);
            // Retorna uma resposta com uma mensagem de erro
            return res.json({ mensagem: "Erro ao atualizar curso." });
        }
    }
}

export default CursoController;

