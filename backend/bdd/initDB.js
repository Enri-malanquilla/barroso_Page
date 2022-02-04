const getDB = require('./getBD');

async function initDB() {
  let connection;
  try {
    connection = await getDB();
    await connection.query('DROP TABLE IF EXISTS user_dev');
    await connection.query('DROP TABLE IF EXISTS photos_song_event');
    await connection.query('DROP TABLE IF EXISTS song_author');
    await connection.query('DROP TABLE IF EXISTS video_rrss');
    await connection.query('DROP TABLE IF EXISTS audio_flamenco');
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
  } catch (error) {
    console.error(error.message);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}
initDB();
