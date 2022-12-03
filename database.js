const sqlite3 = require('sqlite3').verbose();
exports.dbInstance = () => {
    let db = new sqlite3.Database('post.db');
    db.run('CREATE TABLE IF NOT EXISTS post (id INTEGER PRIMARY KEY,title TEXT, body TEXT, photo TEXT)');
    return db;
}

exports.addPost = (title,body,photo) => {
    let db = this.dbInstance()
    console.log(title);
    var resullt =  db.run('INSERT INTO post(title,body,photo) VALUES(?,?,?)', [title,body,photo], function (err) {
        if (err) {
           console.log('error' + err.message)
           return "error";
        }
      console.log('success')
      return "success"
    });
    return resullt;
}
exports.getPosts = async() => {
    let db = this.dbInstance()
    var a = await getAllPromise('select id,title from post', [], db);
    return a;
}
exports.getOnePost = async(id) => {
    let db = this.dbInstance()
    var a = await getAllPromise('select * from post where id=' + id, [], db);
    return a;
}
exports.updatePost = async(id,title,body) => {
    let db = this.dbInstance()
    var resullt =  db.run('UPDATE post SET title=?,body=? WHERE id=?', [title,body,id], function (err) {
        if (err) {
           console.log('error' + err.message)
           return "error";
        }
      console.log('success')
      return "success"
    });
    return resullt;
}
exports.deletePost = async(id) => {
    let db = this.dbInstance()
    var a = await getAllPromise('delete from post where id=?', [id], db);
    return a;
}
function getAllPromise(query, params, db) {
    return new Promise((resolve, reject) => {

        db.all(query, params, (err, rows) => {

            if (err) {


                reject(err);
            }


            resolve(rows);
        })
    })
}