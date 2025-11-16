const fs = require('fs');

function catatLog(aktivitas) {
    const data = {
        waktu: new Date(),
        aksi: aktivitas
    };

    fs.appendFile('database_log.json', JSON.stringify(data) + ",\n", (err) => {
        if (err) console.log("Failed write file");
        else console.log("success write log on server"); 
    });
}