CREATE USER express_api_user WITH PASSWORD 'password';
ALTER USER express_api_user CREATEDB;

CREATE DATABASE express_api_db;
GRANT ALL PRIVILEGES ON DATABASE express_api_db TO express_api_user;