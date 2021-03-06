var products = [
	{id : 4, name : 'Pen', cost : 50, units : 30, category : 'stationary'},
	{id : 9, name : 'Hen', cost : 20, units : 70, category : 'grocery'},
	{id : 8, name : 'Den', cost : 60, units : 40, category : 'stationary'},
	{id : 2, name : 'Ten', cost : 40, units : 50, category : 'stationary'},
	{id : 7, name : 'Len', cost : 80, units : 20, category : 'grocery'},
	{id : 3, name : 'Zen', cost : 30, units : 90, category : 'stationary'},
];

function describe(title, fn){
	console.group(title);
	fn();
	console.groupEnd();
}
describe('Default List', function(){
	console.table(products);
});

describe('Sorting', function(){
	describe('Default Sorting [ products by id ] ', function(){
		function sort(){
			for(var i=0; i < products.length-1; i++)
				for(var j=i+1; j < products.length; j++)
					if (products[i].id > products[j].id){
						var temp = products[i];
						products[i] = products[j];
						products[j] = temp;
					}
		}
		sort();
		console.table(products);
	});

	describe('Generic Sorting [ any list by any attribute ] ', function(){;
		function sort(list, attrName){
			for(var i=0; i < list.length-1; i++)
				for(var j=i+1; j < list.length; j++)
					if (list[i][attrName] > list[j][attrName]){
						var temp = list[i];
						list[i] = list[j];
						list[j] = temp;
					}
		}
		describe('Products by cost', function(){
			sort(products, 'cost');
			console.table(products);
		});
		describe('Products by units', function(){
			sort(products, 'units');
			console.table(products);
		});
	});

	describe('Generic Sorting [ any list by any comparer ] ', function(){;
		function sort(list, comparer){
			var comparerFn = comparer;
			if (typeof comparer === 'string')
				comparerFn = function(item1, item2){
					if (item1[comparer] < item2[comparer]) return -1;
					if (item1[comparer] > item2[comparer]) return 1;
					return 0;
				}
			for(var i=0; i < list.length-1; i++)
				for(var j=i+1; j < list.length; j++){
					var shouldSwap = comparerFn(list[i], list[j]) > 0;
					if (shouldSwap){
						var temp = list[i];
						list[i] = list[j];
						list[j] = temp;
					}
				}
		}

		function descending(comparerFn){
			return function(){
				return comparerFn.apply(this, arguments) * -1;
			};
		}

		var productComparerByValue = function(p1, p2){
			var p1Value = p1.cost * p1.units,
				p2Value = p2.cost * p2.units;
			if (p1Value < p2Value) return -1;
			if (p1Value > p2Value) return 1;
			return 0;
		}
		describe('Products by value [units * cost]', function(){
			sort(products, productComparerByValue);
			console.table(products);
		});
		describe('Products by value in descending', function(){
			sort(products, descending(productComparerByValue));
			console.table(products);
		})
		var productComparerByCost = function(p1, p2){
			if (p1.cost < p2.cost) return -1;
			if (p1.cost > p2.cost) return 1;
			return 0;
		}
		describe('Products by cost', function(){
			sort(products, productComparerByCost);
			console.table(products);
		});

		describe('Products by cost descending', function(){
			sort(products, descending(productComparerByCost));
			console.table(products);
		});
		describe('Products by units', function(){
			sort(products, 'units');
			console.table(products);
		})
	});
});

describe('Filter', function(){
	describe('Default Filter [ costly products ]', function(){
		function filterCostlyProducts(){
			var result = [];
			for(var index = 0; index < products.length; index++){
				if (products[index].cost > 50)
					result.push(products[index]);
			}
			return result;
		}
		var costlyProducts = filterCostlyProducts();
		console.table(costlyProducts);
	});
	describe('Generic Filter [ any list by any criteria ]', function(){
		function filter(list, criteriaFn){
			var result = [];
			for(var index = 0; index < list.length; index++){
				if (criteriaFn(list[index]))
					result.push(list[index]);
			}
			return result;
		}
		function negate(criteriaFn){
			return function(){
				return !criteriaFn.apply(this, arguments);
			};
		}

		describe("Products by units", function(){
			var understockedProductCriteria = function(product){
				return product.units < 50;
			};
			describe('Understocked products [units < 50]', function(){
				var understockedProducts = filter(products, understockedProductCriteria);
				console.table(understockedProducts);
			});
			describe('OverStocked products [units < 50]', function(){
				/*var overStockedProductCriteria = function(product){
					return !understockedProductCriteria(product);
				};*/
				var overStockedProductCriteria = negate(understockedProductCriteria);
				var overStockedProducts = filter(products, overStockedProductCriteria);
				console.table(overStockedProducts);
			});
		});

		describe('Products by category', function(){
			var stationaryProductCriteria = function(product){
				return product.category === 'stationary';
			};
			describe('All stationary products', function(){
				
				var stationaryProducts = filter(products, stationaryProductCriteria);
				console.table(stationaryProducts);
			})
			describe('All non-stationary products', function(){
				/*var nonStationaryProductCriteria = function(product){
					return !stationaryProductCriteria(product)
				};*/
				var nonStationaryProductCriteria = negate(stationaryProductCriteria);
				var nonStationaryProducts = filter(products, nonStationaryProductCriteria);
				console.table(nonStationaryProducts);
			})
		})
	})
});

describe('Group By', function(){
	function printGroup(groupedItem){
		for(var key in groupedItem){
			describe('Key - ' + key, function(){
				console.table(groupedItem[key]);
			});
		}
	}
	describe('Products grouped by category', function(){
		function groupProductsByCategory(){
			var result = {};
			for(var index = 0; index < products.length; index++){
				var key = products[index].category;
				if (typeof result[key] === 'undefined')
					result[key] = [];
				result[key].push(products[index]);
			}
			return result;
		}

		var productsByCategory = groupProductsByCategory();
		printGroup(productsByCategory);
	});
	describe('Any list by any key', function(){
		function groupBy(list, keySelectorFn){
			var result = {};
			for(var index = 0; index < list.length; index++){
				var key = keySelectorFn(list[index]);
				
				/*if (typeof result[key] === 'undefined')
					result[key] = [];*/
				result[key] = result[key] || [];

				result[key].push(list[index]);
			}
			return result;
		}
		describe('Products grouped by cost', function(){
			var costKeySelector = function(product){
				return product.cost < 50 ? 'affordable' : 'costly';
			};
			var productsByCost = groupBy(products, costKeySelector);
			printGroup(productsByCost);
		});
	})
});



