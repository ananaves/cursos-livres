// CRIANDO SQL 

// TBELA ALUNO
CREATE TABLE Aluno (
	id_aluno SERIAL PRIMARY KEY,
	nome_aluno VARCHAR(80) NOT NULL,
	sobrenome_aluno VARCHAR(80) NOT NULL,
	data_nascimento DATE,
	cpf_aluno VARCHAR(14) NOT NULL,
	email_aluno VARCHAR(50) ,
	celular_aluno VARCHAR(20) NOT NULL
);

//TABELA CURSO
CREATE TABLE Curso (
	id_curso SERIAL PRIMARY KEY,
	nome_curso VARCHAR(80) NOT NULL,
	tipo_curso VARCHAR(50),
	duracao_curso VARCHAR(20),
	turno_curso VARCHAR(20)
);

//TABELA MATRICULA
CREATE TABLE Matricula (
	id_matricula SERIAL PRIMARY KEY,
	id_aluno INT NOT NULL,
	id_curso INT NOT NULL,
	data_matricula DATE,
	status_matricula VARCHAR(20),
	
	CONSTRAINT fk_aluno FOREIGN KEY (id_aluno) REFERENCES Aluno(id_aluno) ON DELETE CASCADE,
  CONSTRAINT fk_curso FOREIGN KEY (id_curso) REFERENCES Curso(id_curso) ON DELETE CASCADE
);

//TABELA USUARIO
CREATE TABLE Usuario (
	id_usuario SERIAL PRIMARY KEY,
	uuid_usuario UUID DEFAULT gen_random_uuid() NOT NULL,
	nome VARCHAR(80) NOT NULL,
	username VARCHAR(40) NOT NULL,
	email VARCHAR(80) NOT NULL,
	senha VARCHAR(50) NOT NULL
);

//CRIAR FUNÇÃO gerar_senha_padrao APENAS SE NAO EXISTIR
CREATE OR REPLACE FUNCTION gerar_senha_padrao()
RETURNS TRIGGER AS $$
BEGIN 
	NEW.senha := NEW.username || '1234';
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

// CRIAR A TRIGGER trigger_gerar_senha APENAS SE NAO EXISTIR
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_gerar_senha') THEN
        CREATE TRIGGER trigger_gerar_senha
        BEFORE INSERT ON Usuario
        FOR EACH ROW
        EXECUTE FUNCTION gerar_senha_padrao();
    END IF;
END $$;

//FAZENDO OS INSERTS
INSERT INTO Aluno (nome_aluno, sobrenome_aluno, data_nascimento, cpf_aluno, email_aluno, celular_aluno) VALUES
('Ana', 'Silva', '2000-05-15', '123.456.789-00', 'ana.silva@email.com', '(11)91234-5678'),
('Bruno', 'Lima', '1999-09-20', '234.567.890-11', 'bruno.lima@email.com', '(11)92345-6789'),
('Carla', 'Mendes', '2001-01-10', '345.678.901-22', 'carla.mendes@email.com', '(11)93456-7890'),
('Daniel', 'Oliveira', '1998-12-30', '456.789.012-33', 'daniel.oliveira@email.com', '(11)94567-8901'),
('Eduarda', 'Costa', '2002-07-07', '567.890.123-44', 'eduarda.costa@email.com', '(11)95678-9012'),
('Felipe', 'Alves', '1997-03-22', '678.901.234-55', 'felipe.alves@email.com', '(11)96789-0123'),
('Giovana', 'Ferreira', '2000-11-03', '789.012.345-66', 'giovana.ferreira@email.com', '(11)97890-1234'),
('Henrique', 'Souza', '2001-04-25', '890.123.456-77', 'henrique.souza@email.com', '(11)98901-2345');

INSERT INTO Curso (nome_curso, tipo_curso, duracao_curso, turno_curso) VALUES
('Programação Web', 'Tecnológico', '6 meses', 'Noite'),
('Inglês Básico', 'Idiomas', '4 meses', 'Tarde'),
('Desenvolvimento Pessoal', 'Complementar', '3 meses', 'Manhã');

INSERT INTO Matricula (id_aluno, id_curso, data_matricula, status_matricula) VALUES
(1, 1, '2025-05-10', 'ativa'),
(2, 1, '2025-05-11', 'ativa'),
(3, 2, '2025-05-12', 'pendente'),
(4, 3, '2025-05-13', 'ativa'),
(5, 1, '2025-05-14', 'cancelada'),
(6, 2, '2025-05-15', 'ativa');

