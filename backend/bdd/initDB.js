const getDB = require('./getBD');

async function initDB() {
  let connection;
  try {
    connection = await getDB();
    await connection.query('DROP TABLE IF EXISTS user_dev');
    await connection.query('DROP TABLE IF EXISTS photos_song_event');
    await connection.query('DROP TABLE IF EXISTS song_author');
    // await connection.query('DROP TABLE IF EXISTS video_rrss');
    // await connection.query('DROP TABLE IF EXISTS audio_flamenco');
    await connection.query('DROP TABLE IF EXISTS event_news');
    await connection.query('DROP TABLE IF EXISTS partners_colaboration');
    console.log('TABLES REMOVED');

    await connection.query(`
    CREATE TABLE  user_dev (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(512) NOT NULL,
        active BOOLEAN DEFAULT false,
        deleted BOOLEAN DEFAULT false,
        role ENUM('admin', 'user_dev', 'user_social', 'user_fan' ) DEFAULT 'user_fan' NOT NULL,
        access ENUM('dev', 'social', 'user') DEFAULT 'user' NOT NULL,
        security_question VARCHAR(100) NOT NULL,
        key_word VARCHAR(50) NOT NULL,
        registration_code VARCHAR(100),
        recovered_code VARCHAR(100),
        created_user DATETIME NOT NULL,
        modified_user DATETIME

    )
    `);

    console.log('USER TABLE CREATED');

    await connection.query(`
    CREATE TABLE partners_colaboration (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50),
        comercial_name VARCHAR(50) NOT NULL,
        type_partner ENUM("singer", "productor"),
        created_partner DATETIME NOT NULL,
        modified_partner DATETIME
    )
    `);

    console.log('PARTNER TABLE CREATED');

    await connection.query(`
        CREATE TABLE song_author (
            id INT PRIMARY KEY AUTO_INCREMENT,
            spotyfy VARCHAR(100),
            youtube VARCHAR(100),
            applemusic VARCHAR(100),
            itunes VARCHAR(100),
            titulo VARCHAR(50) NOT NULL,
            song_type ENUM("propia", "cover", "colaboracion", "propia-colaboracion") NOT NULL,
            created_song DATETIME NOT NULL,
            id_singer INT NOT NULL,
            FOREIGN KEY (id_singer) REFERENCES 
            partners_colaboration(id) ON DELETE CASCADE,
            id_collaborator_1 INT,
            FOREIGN KEY (id_collaborator_1) REFERENCES 
            partners_colaboration(id) ON DELETE CASCADE,
            id_collaborator_2 INT,
            FOREIGN KEY (id_collaborator_2) REFERENCES 
            partners_colaboration(id) ON DELETE CASCADE,
            id_productor INT NOT NULL,
            FOREIGN KEY (id_productor) REFERENCES 
            partners_colaboration(id) ON DELETE CASCADE,
            actived_song BOOLEAN DEFAULT true
            
        )
    `);

    console.log('SONGS TABLE CREATED');

    await connection.query(`
    CREATE TABLE event_news (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(50) NOT NULL,
        description TEXT,
        type_news ENUM("articulo", "radio", "concierto", "lanzamiento"),
        enlace VARCHAR(100),
        active_event BOOLEAN DEFAULT true,
        created DATETIME NOT NULL,
        finish_date DATETIME
    )
    `);
    console.log('EVENT TABLE CREATED');

    await connection.query(`
        CREATE TABLE photos_song_event (
            id INT PRIMARY KEY AUTO_INCREMENT,
            type_photo ENUM('song', 'bio', 'random') NOT NULL,
            name VARCHAR(50) NOT NULL,
            description VARCHAR(50),
            created_photo DATETIME NOT NULL,
            id_song INT,
            FOREIGN KEY (id_song) REFERENCES
            song_author(id) ON DELETE CASCADE,
            id_event INT,
            FOREIGN KEY (id_event) REFERENCES
            event_news(id) ON DELETE CASCADE
        )
    `);

    console.log('PHOTOS TABLES CREATED');

    console.log('CREATED TABLES READY');
  } catch (error) {
    console.error(error.message);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}
initDB();
