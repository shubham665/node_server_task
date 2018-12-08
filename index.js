const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});


app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.post('/signup',function(req,res){
 	var client = new pg.Client(config.database);
	client.connect();
 	var queryStr = "insert into user_detail (username,email,mobile,password) values ($1,$2,$3,$4) RETURNING id";
	var params = [req.body.username,req.body.email,req.body.mobile,req.body.password];
 	var query = client.query(queryStr,params, function(err, result){   
 		if(err)
 		{
 			console.log(JSON.stringify(err));
 		}
 		else
 		{
			client.end();
     		res.writeHead(200, {'Content-Type': 'application/json'});
     		res.write(JSON.stringify("User Created"));
     		res.end();				 			
 		}    
    });
})

app.get('/login', function(req, res) {
	var client = new pg.Client(config.database);		
	client.connect();
	var queryStr = "select * from user_detail where username=$1 and password=$2";
	var params = [req.body.username,req.body.password];
	var  query = client.query(queryStr,params);
    query.on("row", function (row, result) { 
        result.addRow(row); 
    });

    query.on("end", function (result) {          
        client.end();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(result.rows));
        res.end();  
    });
})

app.put('/change_password', function(req, res) {
	var client = new pg.Client(config.database);		
	client.connect();
	var queryStr = "select * from user_detail where username=$1 and password=$2";
	var params = [req.body.username,req.body.password];
	var  query = client.query(queryStr,params);
    query.on("row", function (row, result) { 
        result.addRow(row); 
    });

    query.on("end", function (result) {          
        if (result.rows.length>0) {
        	updatePassword();
        }
        else {
        	client.end();
	        res.writeHead(200, {'Content-Type': 'application/json'});
	        res.write(JSON.stringify("Wrong Password"));
	        res.end();
        }
    });

    var updatePassword=function()
    {
  		var queryStr = "update user_detail set password=$1 where username=$2";
		var params=[req.body.newPassword,req.body.username];
		var  query = client.query(queryStr,params);
	    query.on("row", function (row, result) { 
	    	result.addRow(row);
	    });
       	query.on("end", function (result) { 
       		client.end();
	        res.writeHead(200, {'Content-Type': 'application/json'});
	        res.write(JSON.stringify("Password Updated"));
	        res.end();
       	});
    }
})

app.post('/profile_pic_upload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let sampleFile = req.files.sampleFile;

  sampleFile.mv('path_to_server/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

app.put('/edit_user_detail', function(req, res) {
	var client = new pg.Client(config.database);		
	client.connect();
	var queryStr = "update user_detail set mobile=$1,email=$2 where username=$3";
	var params = [req.body.mobile,req.body.email,req.body.username];
	var  query = client.query(queryStr,params);
	query.on("row", function (row, result) { 
	  result.addRow(row);
	});

	query.on("end", function (result) { 
	  client.end();
	  res.writeHead(200, {'Content-Type': 'application/json'});
	  res.write(JSON.stringify("Details Updated"));
	  res.end();
	}); 

})

app.get('/my_user_info', function(req, res) {
	var client = new pg.Client(config.database);		
	client.connect();
	var queryStr = "select * from user_detail where username=$1";
	var params = [req.body.username];
	var  query = client.query(queryStr,params);
    query.on("row", function (row, result) { 
        result.addRow(row); 
    });

    query.on("end", function (result) {          
        client.end();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(result.rows));
        res.end();  
    });
})

