import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// classe que representa o modelo de banco de dados
export class DataBaseModel {
    //configuração para conexão com o banco
    private _config: object;

    //pool de conexoes com o banco
    private _pool: pg.Pool;

    //cliente de conexão com o banco
    private _client: pg.Client;

    //construtor de classe DataBaseModel
    constructor() {
        //configuração padrao para conexao com o banco
        this._config = {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            mex: 10,
            idleTimoutMillis: 10000
        }

        //iniciação do pool
        this._pool = new pg.Pool(this._config);

        //iniciação do cliente
        this._client = new pg.Client(this._config);
    }

    //método para testar a conexão com o banco
    //@returns **true** caso a conexão tenha sido feita, **false** caso negativo
    public async testeConexao() {
        try {
            //tenta conectar
            await this._client.connect();
            console.log('Database conectado!');
            //encerrar a conexão
            this._client.end();
            return true;
        } catch (error) {
            //casso de erro, exiba a mensagem de erro
            console.log('Erro ao conectar Database');
            console.log(error);
            //encerrar a conexão
            this._client.end();
            return false;
        }
    }

    //getter para o pool de conexões
    public get pool() {
        return this._pool;
    }
}