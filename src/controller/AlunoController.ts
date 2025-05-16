import { Aluno } from "../model/Aluno";
import { Request, Response } from "express";

//Define os atributos que devem ser recebidos do cliente nas requisições
interface AlunoDTO {
    nomeAluno: string;
    sobrenomeAluno: string;
    dataNascimento: Date;
    cpfAluno: string;
    emailAluno: string;
    celularAluno: string;
}

// Controlador para operações relacionadas aos alunos.
class AlunoController extends Aluno {
    /**
     * Lista todos os alunos.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     * @returns Lista de alunos em formato JSON.
     */

    static async todos(req: Request, res: Response) {
        console.log(`passei por aqui!!`)
        try {
            const listaDeAlunos = await Aluno.listarAlunos();
            res.status(200).json(listaDeAlunos);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);
            res.status(400).json('Erro ao recuperara as informações do Aluno');
        }
    }

    // Cadastra um novo aluno
    static async cadastrar(req: Request, res: Response): Promise<any> {
        try {
            const dadosrecebidos: AlunoDTO = req.body;
            const novoAluno = new Aluno(
                dadosrecebidos.nomeAluno,
                dadosrecebidos.sobrenomeAluno,
                dadosrecebidos.dataNascimento ?? new Date("1900-01-01"),
                dadosrecebidos.cpfAluno,
                dadosrecebidos.emailAluno ?? '',
                dadosrecebidos.celularAluno
            );
            const result = await Aluno.cadastrarAluno(novoAluno);

            if (result) {
                return res.status(200).json(`Aluno cadastrado com sucesso`);
            } else {
                return res.status(400).json('Não foi possível cadastrar o aluno no banco de dados');
            }
        } catch (error) {
            console.log(`Erro ao cadastrar o aluno: ${error}`);
            return res.status(400).json('Erro ao cadastrar o aluno');
        }
    }

    //Remove um aluno
    static async remover(req: Request, res: Response): Promise<any> {
        try {
            const idAluno = parseInt(req.query.idAluno as string);
            const result = await Aluno.removerAluno(idAluno);
            
            if (result) {
                return res.status(200).json('Aluno removido com sucesso');
            } else {
                return res.status(401).json('Erro ao deletar aluno');
            }
        } catch (error) {
            console.log("Erro ao remover o Aluno");
            console.log(error);
            return res.status(500).send("error");
        }
    }

    //Atualizar o cadastro de um aluno
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const dadosrecebidos: AlunoDTO = req.body;
            const aluno = new Aluno(
                dadosrecebidos.nomeAluno,
                dadosrecebidos.sobrenomeAluno,
                dadosrecebidos.dataNascimento ?? new Date("1900-01-01"),
                dadosrecebidos.cpfAluno,
                dadosrecebidos.emailAluno ?? '',
                dadosrecebidos.celularAluno
            );

            aluno.setIdAluno(parseInt(req.query.idAluno as string));

            // Chama o método para atualizar o cadastro do aluno no banco de dados
            if (await Aluno.atualizaCadastroAluno(aluno)) {
                return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso!" });
            } else {
                return res.status(400).json('Não foi possível atualizar o aluno no banco de dados');
            }
        } catch (error) {
            // Caso ocorra algum erro, este é registrado nos logs do servidor
            console.error(`Erro no modelo: ${error}`);
            // Retorna uma resposta com uma mensagem de erro
            return res.json({ mensagem: "Erro ao atualizar aluno." });
        }
    }
}

export default AlunoController;

