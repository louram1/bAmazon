var mysql = require("mysql");
var inquirer = require('inquirer');
var action = 0;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Roshan317",
  database: "bAmazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  console.log("Our Store has following products for Sale");
  var query = connection.query("SELECT * FROM products", function(err, res) {

	  for (var i = 0; i < res.length; i++) 
	   {
	      console.log(res[i].item_id + " | " + res[i].product_name + " | " + "$ " + res[i].price);
	   }
	   var test = inquirer.prompt([
	{
		type: "input",
	    name: "Item_Id",
	    message: "Type Item_Id to search by Product Id"
	},
	
	{
		type: "input",
	    name: "Units",
	    message: "How many units of the Selected Item you will like to buy?"
	}
	]).then(function(ans) {
		//console.log(ans.Item_Id);
		//console.log(ans.Units);
		//console.log(ans.Units);
		var id = ans.Item_Id;
		//console.log(id);
		var NumId = String(id);
		//console.log(NumId);
		//var query = connection.query("SELECT * FROM products WHERE item_id=100", function(err, res) {
		var query = connection.query("SELECT * FROM products WHERE item_id=?", NumId, function(err, res) {
	    for (var i = 0; i < res.length; i++) 
	    {
	        console.log("The inventory on hand is: " + res[i].stock_quantity);
	        var Quant = res[i].stock_quantity;
	        //save the item price
	        var ItemPrc = res[i].price;
	        var nUnits = parseInt(ans.Units);
	        //console.log(Quant);
	        //console.log(ItemPrc);
	        //console.log(nUnits*ItemPrc);
	    	if(res[i].stock_quantity < ans.Units)
	    	{
	    		console.log("Insufficient Quantity. Please re-order with fewer units");
	    		connection.end();
	    	}
	    	else
	    	{
	    		//we have sufficient stock. Proceed with fulfillment
	    		//deplete the inventory by the num of units purchased.
	    		Quant = Quant - ans.Units;
	    		//console.log("Current stock is: " + Quant);
	    		//update the inventory in the DB.
	    		qryStr = "UPDATE products SET stock_quantity=" + Quant + " WHERE item_id=" + NumId + ";";
	    		//console.log(qryStr);
	    		var query = connection.query(qryStr, function(err, res) {
	    			console.log('Order Processed. Congratulations!!!');
	    			//print updated inventory from db
	    			var query = connection.query("SELECT * FROM products WHERE item_id=?", NumId, function(err, res) {
	    			console.log("Updated inventory is: " + res[0].stock_quantity);
	    			//print the purchase receipt for the customer.
	    			var Total = nUnits * ItemPrc;
	    			console.log("Your receipt for this order is: $" + Total);
	    			});

	    			connection.end();
	    		});	
	    	}
	    }
	 });
		
	});	
  });

  //test;
	
});