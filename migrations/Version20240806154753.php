<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240806154753 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE categories (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, picture VARCHAR(1500) DEFAULT NULL, date DATETIME NOT NULL, avis LONGTEXT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE species (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, picture VARCHAR(1500) DEFAULT NULL, avis LONGTEXT DEFAULT NULL, date DATETIME NOT NULL, category_id INT NOT NULL, type_id INT NOT NULL, INDEX IDX_A50FF71212469DE2 (category_id), INDEX IDX_A50FF712C54C8C93 (type_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE types (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, picture VARCHAR(1500) DEFAULT NULL, avis LONGTEXT DEFAULT NULL, UNIQUE INDEX UNIQ_593089305E237E06 (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE species ADD CONSTRAINT FK_A50FF71212469DE2 FOREIGN KEY (category_id) REFERENCES categories (id)');
        $this->addSql('ALTER TABLE species ADD CONSTRAINT FK_A50FF712C54C8C93 FOREIGN KEY (type_id) REFERENCES types (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE species DROP FOREIGN KEY FK_A50FF71212469DE2');
        $this->addSql('ALTER TABLE species DROP FOREIGN KEY FK_A50FF712C54C8C93');
        $this->addSql('DROP TABLE categories');
        $this->addSql('DROP TABLE species');
        $this->addSql('DROP TABLE types');
    }
}
