/*
 * Copyright 2012 MG2 Innovations LLC (http://www.mg2innovations.com)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 	
 *	http://www.apache.org/licenses/LICENSE-2.0 	
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.  
 */

var petfinder = new function() {
	var proxyUrl = 'http://petfinderproxy.herokuapp.com/';
 	
	var apiKey = '<YOUR_API_KEY>';
	var apiSecret = '<YOUR_API_SECRET>';
	
	var authKey;
	
	this.getPet = function(petId, callback) {
		var queryParams = {
			'key': apiKey,
			'id': petId,
			'format': 'json',
		}
		
		hit('pet.get', queryParams, callback);
	}
	
	this.findPet = function(location, animal, breed, size, sex, age, offset, count, output, callback) {
		var queryParams = {
			'key': apiKey,
			'format': 'json'
		};
		
		if(location)
			queryParams['location'] = location;
		
		if(animal)
			queryParams['animal'] = animal;
	
		if(breed)
			queryParams['breed'] = breed;
		
		if(size)
			queryParams['size'] = size;
		
		if(sex)
			queryParams['sex'] = sex;
		
		if(age)
			queryParams['age'] = age;
			
		if(offset)
			queryParams['offset'] = offset;
		
		if(count)
			queryParams['count'] = count;
		
		if(output)
			queryParams['output'] = output;
		
		hit('pet.find', queryParams, callback);
	}
	
	this.authenticate = function(callback) {
		var queryParams = {
			'key': apiKey,
			'format': 'json',
		}
		
		hit('auth.getToken', queryParams, callback);
	};
	
	var hit = function(method, queryParams, callback) {
		var queryString = genQueryString(queryParams);
		console.debug('Query String: ' + queryString);
		
		var url = proxyUrl + method + '?' + queryString;
		console.debug('URL: ' + url);
		
		$.getJSON(
			url + '&callback=?',
			function(data, textStatus, jqXHR) {
				callback(data);
			}
		);
	};
	
	var getKeys = function(obj) {
		// Get keys from array
		var keys = [];
		for(var key in obj){
			if(obj.hasOwnProperty(key)) {
				keys.push(key);
			}
		}
		return keys;
	}
	
	var genQueryString = function(queryParams) {
		var queryString = '';
		
		// Get keys from parameters and sort
		var keys = getKeys(queryParams);
		
		// Sort keys and iterate to get name/value pairs.
		// Build value to be hashed.
		for (var key in keys.sort()) {
			var name = keys[key];
			var value = queryParams[name];
			queryString += "&" + name + "=" + value
		}
		
		// Generate and append sig
		queryString += "&sig=" + $.md5(apiSecret + queryString);
		
		return queryString;
	};
};
