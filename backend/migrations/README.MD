# 🔄 Migrações com Alembic

Guia completo para gerenciar migrações de banco de dados do projeto Padaria FastAPI.

## O que é Alembic?

Alembic é uma ferramenta de migração de banco de dados SQL para Python, funciona com SQLAlchemy e permite:

- ✅ Versionamento automático do schema do banco
- ✅ Migrações reversíveis (upgrade/downgrade)
- ✅ Histórico completo de mudanças
- ✅ Geração automática a partir de modelos SQLAlchemy

## Configuração Inicial

### Já Configurado

O projeto já possui Alembic configurado. Arquivos principais:

```
backend/
├── alembic.ini              # Configuração geral
├── migrations/
│   ├── env.py              # Ambiente de execução
│   ├── script.py.mako      # Template de migração
│   └── versions/
│       ├── 427d0a9f8ee8_initial_migration.py
│       └── ee2e381f5e40_.py
└── requirements.txt        # Inclui alembic
```

## Comandos Principais

### 1. Criar uma Nova Migração

#### Automática (Recomendado)

Detecta mudanças nos modelos e gera automaticamente:

```bash
cd backend

# Gerar migração automática
alembic revision --autogenerate -m "Descrição da mudança"

# Exemplo:
alembic revision --autogenerate -m "Add telephone to users table"
```

**Resultado:** Novo arquivo em `migrations/versions/xxxxx_add_telephone_to_users_table.py`

#### Manual (Para Customizações)

Cria um arquivo vazio para editar manualmente:

```bash
alembic revision -m "Custom migration"
```

### 2. Ver Histórico de Migrações

```bash
# Ver todas as migrações (com status)
alembic history

# Ver apenas versões recentes
alembic history --rev-range=rev1:rev2

# Ver versão atual
alembic current
```

### 3. Aplicar Migrações

#### Aplicar Todas as Pending (Recomendado)

```bash
# Executa todas as migrações não aplicadas até a head
alembic upgrade head
```

#### Aplicar Até Revisão Específica

```bash
# Aplicar até uma revisão específica
alembic upgrade [revision_id]

# Exemplo:
alembic upgrade 427d0a9f8ee8
```

#### Aplicar N Migrações

```bash
# Aplicar próximas 2 migrações
alembic upgrade +2
```

### 4. Reverter Migrações

#### Reverter Última Migração

```bash
# Desfaz a última migração aplicada
alembic downgrade -1
```

#### Reverter para Revisão Específica

```bash
alembic downgrade [revision_id]
```

#### Reverter Todas

```bash
# Remove todas as migrações aplicadas
alembic downgrade base
```

### 5. Status e Debug

```bash
# Ver migração atual
alembic current

# Ver branches de migração
alembic branches

# Ver labels
alembic labels

# Ver range de versões
alembic history --rev-range=base:head
```

## Estrutura de um Arquivo de Migração

### Exemplo: Adicionar Coluna

```python
"""Add telephone to users table.

Revision ID: 427d0a9f8ee8
Revises:
Create Date: 2026-01-12 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# Identificadores de revisão
revision = '427d0a9f8ee8'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    """Aplicar migração (upgrade)."""
    op.add_column('users', sa.Column('telephone', sa.String(20), nullable=True))

def downgrade() -> None:
    """Desfazer migração (downgrade)."""
    op.drop_column('users', 'telephone')
```

## Operações Comuns

### Adicionar Coluna

```python
def upgrade():
    op.add_column('users', sa.Column('email_verified', sa.Boolean(), default=False))

def downgrade():
    op.drop_column('users', 'email_verified')
```

### Remover Coluna

```python
def upgrade():
    op.drop_column('users', 'old_field')

def downgrade():
    op.add_column('users', sa.Column('old_field', sa.String(255)))
```

### Modificar Coluna

```python
def upgrade():
    op.alter_column('users', 'username', new_column_name='email')

def downgrade():
    op.alter_column('users', 'email', new_column_name='username')
```

### Criar Índice

```python
def upgrade():
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

def downgrade():
    op.drop_index('ix_users_email', table_name='users')
```

### Criar Tabela

```python
def upgrade():
    op.create_table(
        'new_table',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('new_table')
```

### Adicionar Constraint de Chave Estrangeira

```python
def upgrade():
    op.create_foreign_key(
        'fk_products_user_id',
        'products', 'users',
        ['user_id'], ['id']
    )

def downgrade():
    op.drop_constraint('fk_products_user_id', 'products')
```

## Fluxo Típico de Desenvolvimento

### 1. Modificar Modelo

Edite `backend/db/entities.py`:

```python
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    # Novo campo:
    phone_number = Column(String(20), nullable=True)  # ← Adicionado
```

### 2. Criar Migração

```bash
cd backend
alembic revision --autogenerate -m "Add phone_number to users"
```

Arquivo criado: `migrations/versions/xxxxx_add_phone_number_to_users.py`

### 3. Revisar Migração

Abra o arquivo e verifique se está correto:

```python
# Deve conter:
def upgrade():
    op.add_column('users', sa.Column('phone_number', sa.String(20), nullable=True))

def downgrade():
    op.drop_column('users', 'phone_number')
```

### 4. Aplicar Migração

```bash
alembic upgrade head
```

Pronto! O banco está atualizado.

### 5. Testar

```bash
# Iniciar backend com nova coluna
uvicorn app:app --reload
```

## Boas Práticas

### ✅ Faça

- ✅ Use mensagens descritivas: `-m "Add email verification"`
- ✅ Revise migrações automáticas antes de aplicar
- ✅ Sempre faça downgrade local para testar reversão
- ✅ Commite os arquivos de migração junto com código
- ✅ Use nomes consistentes para índices e constraints
- ✅ Teste em desenvolvimento antes de ir para produção

### ❌ Evite

- ❌ Editar migrações já aplicadas em produção
- ❌ Criar migrações vazias
- ❌ Migrações sem downgrade
- ❌ Mudanças de schema sem migração
- ❌ Múltiplas operações complexas em uma só migração

## Troubleshooting

### "No such table: alembic_version"

O banco não foi inicializado. Execute:

```bash
alembic upgrade head
```

### "Target database is not up to date"

Existem migrações pending. Execute:

```bash
alembic upgrade head
```

### "Multiple heads exist"

Há conflito de branches. Resolva manualmente em `migrations/versions/`.

### "Can't drop column - referenced by foreign key"

Remova a constraint antes:

```python
op.drop_constraint('fk_name', 'table_name')
op.drop_column('table_name', 'column_name')
```

## Resetar Banco de Dados (Desenvolvimento)

```bash
# PostgreSQL
dropdb padaria
createdb padaria
alembic upgrade head

# SQLite
rm backend/test.db
alembic upgrade head
```

## Integração com CI/CD

Em GitHub Actions, sempre execute:

```yaml
- name: Run migrations
  run: |
    cd backend
    alembic upgrade head
```

## Referências

- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/orm/)
- [Database Migrations Guide](https://alembic.sqlalchemy.org/en/latest/migration_guide.html)

---

**Última atualização:** Janeiro 2026
