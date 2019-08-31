var budgetController=(function() {
	// body...
	var expense=function(id,description,value) {
		// body...
		this.id=id;
		this.description=description;
		this.value=value;
		this.percentage=-1;
	};
	expense.prototype.calcpercentage=function(totalIncome) {
		if(totalIncome>0){
		this.percentage=Math.round((this.value/totalIncome)*100);
	}
	else{
		this.percentage=-1;
	}
};
expense.prototype.getpercentages=function() {
	return this.percentage;
}
	var income=function(id,description,value) {
		// body...
		this.id=id;
		this.description=description;
		this.value=value;
	};


	var calculatetotal=function(type) {
		var sum=0;
		data.allitems[type].forEach(function(cur) {
			// body...
			sum+=cur.value;
		});
		data.total[type]=sum;
		/*
		0
		[200,400,100]
		sum=0+200
		sum=200+400
		sum=600+100
		*/
	};

var data={
	allitems:{
		exp:[],
		inc:[]
	},
	total:{
		exp:0,
		inc:0
	},
	budget:0,
	per:-1
};
return {
	additems:function(type,des,val) {
		var newitem;
		if(data.allitems[type].length>0){
		//create new id
		ID=data.allitems[type][data.allitems[type].length-1].id+1; 
}
else{
	ID=0;

}
		//create new item based on inc and exp
		if(type==='exp'){
			newitem=new expense(ID,des,val);
		}else if(type==='inc'){
			newitem=new income(ID,des,val);
		}
		//push it into datastructue
		data.allitems[type].push(newitem);
		return newitem;
	},
	deleteitem:function(type,id) {
		var ids,index;
		ids=data.allitems[type].map(function (current) {
			return current.id;

		});
		index=ids.indexOf(id);
		if(index!==-1){
			data.allitems[type].slice(index,1);
		}
	},
	calculatebudget:function() {
		//calculate total income and expenses
		calculatetotal('exp');
		calculatetotal('inc');
		//calculate the budget:income-expense
		data.budget=data.total.inc-data.total.exp;
		//calculate the per of income that we spent
		if(data.total.inc > 0){
		data.per=Math.round((data.total.exp/data.total.inc)*100);
		}else{
		data.per=-1;
	}

	},
	calculatepercentages:function() {
		/*
		a=20
		b=10
		c=40
		income=100
		a=20/100=20%
		etc*/


		data.allitems.exp.forEach(function(cur) {
			cur.calcpercentage(data.total.inc);
		});
	},
	getpercentages:function() {
		var allperc=data.allitems.exp.map(function(cur) {
			return cur.getpercentages();

		});
		return allperc;
		
	},
	getbudget:function() {
		return{
			budget:data.budget,
			totalincome:data.total.inc,
			totalexp:data.total.exp,
			percentage:data.per
		};
	},
	testing:function(){
		// body...
		console.log(data);
	}
};

})();











var UIController=(function() {
	// body...
	var DOMstrings={
		inputtype:'.add',
		inputdescription:'.add_description',
		inputvalue:'.add_value',
		inputbtn:'.btn',
		incomecontainer:'.income_list',
		expensecontainer:'.expense_list',
		budgetlabel:'.total',
		incomelabel:'.income_value',
		expenselabel:'.expense_value',
		percentagelabel:'.expense_per',
		container:'.bottom',
		expensesperclabel:'.item__percentage',
		datelabel:'.budget__title--month'

	};
	var nodelistforeach=function(list,callback) {
				for(var i=0;i<list.length;i++){
					callback(list[i],i);
				}
			};

	return{
		getinput:function() {
			// body...
			return{
				type:document.querySelector(DOMstrings.inputtype).value,
				description:document.querySelector(DOMstrings.inputdescription).value,
				value:parseFloat(document.querySelector(DOMstrings.inputvalue).value),
				// percentage:parseFloat(document.querySelector(DOMstrings.percentagelabel).value)
			};
		},

		addlistitem:function(obj,type) {
			// body...
			var html,newhtml,element;

			
			//create html strings with placeholder text
			if(type==='inc')
			{
				element=DOMstrings.incomecontainer;
				html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			else
			{
				element=DOMstrings.expensecontainer;
				html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">25%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}



			//replace placeholder text with som actual data
				newhtml=html.replace('%id%',obj.id);
				newhtml=newhtml.replace('%description%',obj.description);
				newhtml=newhtml.replace('%value%',this.formatnumber(obj.value,type));
			//insert data to ui
			document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);

		},
		deletelistitem:function(selectorid) {
			var el=document.getElementById(selectorid);
			el.parentNode.removeChild(el);

		},
		clearfields:function() {
			// body...
			var fields,fieldsarr;
			fields=document.querySelectorAll(DOMstrings.inputdescription + ', ' + DOMstrings.inputvalue);
			fieldsarr=Array.prototype.slice.call(fields);

			fieldsarr.forEach(function(current){
				current.value="";
			});
			fieldsarr[0].focus();
		},
		displaybudget:function(obj){
			var type;
			obj.budget>0 ? type='inc' : type='exp';
			document.querySelector(DOMstrings.budgetlabel).textContent=this.formatnumber(obj.budget,type);
			document.querySelector(DOMstrings.incomelabel).textContent=this.formatnumber(obj.totalincome,'inc');
			document.querySelector(DOMstrings.expenselabel).textContent=this.formatnumber(obj.totalexp,'exp');

			if(obj.percentage>0){
				document.querySelector(DOMstrings.percentagelabel).textContent=obj.percentage;
			}
			else{
				document.querySelector(DOMstrings.percentagelabel).textContent='-';
			}
		},
		displaypercentages:function(percentages) {

			var fields=document.querySelectorAll(DOMstrings.expensesperclabel);
			nodelistforeach(fields,function(current,index) {
				if(percentages[index]>0){
				current.textContent=percentages[index]+'%';
			}else{
				current.textContent='-';
			}
			});
		},
		displaymonth:function() {
			var now, year;
			now=new Date();
			months=['january','february','march','april','may','june','july','august','september','october','november','december'];
			month=now.getMonth();
			year=now.getFullYear();
			document.querySelector(DOMstrings.datelabel).textContent=months[month]+' '+year;
		},
		changedtype:function() {
			var fields=document.querySelectorAll(
				DOMstrings.inputtype+','+
				DOMstrings.inputdescription+','+
				DOMstrings.inputvalue
				);
			nodelistforeach(fields,function(cur){
				cur.classList.toggle('red-focus');
			});
			document.querySelector('i').classList.toggle('red');		
		},
		formatnumber:function(num,type) {
			/*
			+ or - before number
			exactly 2decimal points
			comma separating thousand
			*/
			var numsplit,int,dec;
			num=Math.abs(num);
			num=num.toFixed(2);
			numsplit=num.split('.');
			int=numsplit[0];
			if(int.length>3){
				int=int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length);
			}
			dec=numsplit[1];
			type==='exp' ? sign ='-':sign='+';
			return sign+' '+int+'.'+dec;

		},
		getDOMstrings:function() {
			// body...
			return DOMstrings;
		}
	};

})();






















var controller=(function(budgetctrl,uictrl) {
	// body...
	var setupEventListeners=function() {
		// body...
		var DOM=uictrl.getDOMstrings();
		document.querySelector(DOM.inputbtn).addEventListener('click',ctrlAddItem);
		document.addEventListener('keypress',function(event) {
		if(event.keyCode===13||event.which===13){
			ctrlAddItem();
		}
	});
		document.querySelector(DOM.container).addEventListener('click',ctrldeleteitem);
		document.querySelector(DOM.inputtype).addEventListener('change',uictrl.changedtype);
	};

	var updatepercentages=function() {
		//calculate the percentage
budgetctrl.calculatepercentages();



		//read percentages from the budget controller
var percentages=budgetctrl.getpercentages();
uictrl.displaypercentages(percentages);
		//updatr teh ui with new percentages
		
	};


	var updatebudget=function() {
		//calculate the budget
		budgetctrl.calculatebudget();
		//return budget
		var budget1=budgetctrl.getbudget();

		//display the budget on the ui
		uictrl.displaybudget(budget1);
	};
	var ctrlAddItem=function() {
		// get the input field
		var input=uictrl.getinput();


		if((input.description!=="") && (!isNaN(input.value)) && (input.value>0)){
		// console.log(input);
		var newitem=budgetctrl.additems(input.type,input.description,input.value);
		//add the items to the budget controller
		uictrl.addlistitem(newitem,input.type);
		//add the item to the ui
		uictrl.clearfields();
		//calculate and update budget
		updatebudget();		
		//calcultae and update percentages
		updatepercentages();
	}
	};
	var ctrldeleteitem=function(event){
		var itemid,splitid;
		itemid=event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(itemid){
			//inc-1
			splitid=itemid.split('-');
			type=splitid[0];
			id=parseInt(splitid[1]);

			//delete item from datastructure
			budgetctrl.deleteitem(type,id);

			//delete items from ui
			uictrl.deletelistitem(itemid);

			// update and show new budget
			updatebudget();
			updatepercentages();

		}
	};
	return{
		init:function() {
			// body...
			console.log('app has started');
			uictrl.displaymonth();
			uictrl.displaybudget({
				budget:0,
				totalincome:0,
				totalexp:0,
				percentage:-1

			});
			setupEventListeners();
		}

	};
})(budgetController,UIController);


controller.init();