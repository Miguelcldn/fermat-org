/**
 * @author Ricardo Delgado
 * Create screenshots of android with your images and functions.
 */
function ScreenshotsAndroid() {

	// Public Variables
    this.objects = {
		mesh : [],
		target : [],
		texture : [],
		title : {
			mesh : {},
			texture : {}
		}			
	};
		
    // Private Variables
	var self = this,
		POSITION_X = 231,
		CONTROL = {},
		SCREENSHOTS = {},
		GROUP = {};

    var action = { state : false, mesh : null };

	var onClick = function(target) {
		change(target.userData.id);
		window.buttonsManager.removeAllButtons();
	};

	this.getScreenshots = function(){
		return SCREENSHOTS;
	};

	this.changePositionScreenshots = function(id, x, y){

		for(var t in SCREENSHOTS){

			if(SCREENSHOTS[t].id === id && SCREENSHOTS[t].show === true){

				SCREENSHOTS[t].position = new THREE.Vector3(x, y, 0);

				for(var i = 0; i < self.objects.mesh.length; i++){

					if(self.objects.mesh[i].userData.wallet === SCREENSHOTS[t].name){

						var mesh = self.objects.mesh[i];

						var target = {x : x, y : y + 240, z : 0};

						self.objects.target[i].show.x = target.x;
						self.objects.target[i].show.y = target.y;
						self.objects.target[i].show.z = target.z;
					}
				}
			}
		}
	};

	this.deleteScreenshots = function(id){

		var newObjects = {};

		for(var t in SCREENSHOTS){

			if(SCREENSHOTS[t].id === id){

				for(var i = 0; i < self.objects.mesh.length; i++){

					if(SCREENSHOTS[t].name === self.objects.mesh[i].userData.wallet){

						var mesh = self.objects.mesh[i];

						var target = self.objects.target[i];

						self.objects.mesh.splice(i,1);
						self.objects.target.splice(i,1);

						animate(mesh, target.hide, 1000, function(){
							window.scene.remove(mesh);
						}); 
					}
				}
			}
			else
				newObjects[t] = SCREENSHOTS[t];
		}

		SCREENSHOTS = newObjects;

	};

	this.hidePositionScreenshots = function(newGroup, newLayer){

		var layer = window.CLI.query(window.layers,function(el){return (el.super_layer === false);});

		if(typeof window.platforms[newGroup] !== 'undefined'){

			if(newLayer === layer[0] || newLayer === layer[1] || newLayer === layer[2]){

				for(var t in SCREENSHOTS){

					var id = SCREENSHOTS[t].id;
					var data = id.split("_");

					if(data[0] === newGroup && data[1] === 'Sub App'){

						for(var i = 0; i < self.objects.mesh.length; i++){

							if(self.objects.mesh[i].userData.wallet === SCREENSHOTS[t].name){

								var mesh = self.objects.mesh[i];

								self.objects.target[i].show.z = 160000;

								animate(mesh, self.objects.target[i].hide);
							}
						}
					}
				}
			}
		}
	};

    // Public method
    this.setGroup = function(_group, _layer) {

    	if(typeof GROUP[_group] === 'undefined')
        	GROUP[_group] = [];
            
        GROUP[_group].push(_layer);
    };

    this.showButtonScreenshot = function(id){

    	if(typeof SCREENSHOTS[id] !== 'undefined'){

    		window.buttonsManager.createButtons('showScreenshots', 'View Screenshots', function(){
    			
    			window.buttonsManager.removeAllButtons();
    			showScreenshotsButton(id);
    		});
    	}	
    };

	/**
	* @author Ricardo Delgado
	* Initialization screenshots.
	*/
	this.init = function() {

        $.get("json/screenshots.json", {}, function(json) {

	        for(var _group in json){

	        	for(var _layer in json[_group]){

	        		for(var _wallet in json[_group][_layer]){

	        			if(window.TABLE[_group]){

	        				if(window.TABLE[_group].layers[_layer]){

		        				for(var i = 0; i < window.TABLE[_group].layers[_layer].objects.length; i++){

		        					var id = _group + "_" + _layer + "_" + i;
		                            
		                            var tile = window.helper.getSpecificTile(id).data;        

			        				if(tile.type === "Plugin" || tile.type === "Android"){ 

				        				if(tile.name === _wallet){
				        					
				        					var name = json[_group][_layer][_wallet].name,
				        						position = window.helper.getSpecificTile(id).target.show.position,
				        						_id = _group + "_" + _layer + "_" + name,
				        						show = false,
				        						screenshots = {};

				        					if(_layer === "Sub App" && GROUP[_group][0] === "Sub App")
				        						show = true;

			        						for(var _screen in json[_group][_layer][_wallet].screenshots){
												screenshots[_screen] = json[_group][_layer][_wallet].screenshots[_screen];
											}

											fillScreenshots(id, _id, position, name, show, screenshots);
				        				}
				        			}
			        			}
			        		}
		        		}
	        		}
	        	}
	        }
	        setScreenshot();
    	});
	};
    
    	/**
	* @author Ricardo Delgado
	* Wallet hidden from view.
	*/ 
	this.hide = function() {
		for(var i = 0; i < self.objects.mesh.length; i++){
			animate(self.objects.mesh[i], self.objects.target[i].hide, 800);
			titleVisibility(self.objects.mesh[i].userData.wallet, self.objects.mesh[i], 'hide');
		}
	};

	/**
	* @author Ricardo Delgado
	* Show wallet sight.
	*/ 
	this.show = function() {

        if(action.state)
			resetTexture(action.mesh);
		else {
			for(var i = 0; i < self.objects.mesh.length; i++)
				animate(self.objects.mesh[i], self.objects.target[i].show, 1500);
		}
	};
    
    // Private method
    /**
	* @author Ricardo Delgado
	* Screenshots settings show.
	*/ 
    function setScreenshot(){
        
        var cant = 0,
			lost = "";

		for(var id in SCREENSHOTS){

			var name = SCREENSHOTS[id].name,
				position = SCREENSHOTS[id].position,
				show = SCREENSHOTS[id].show;

			CONTROL[name] = {};

			addWallet(id, name);

			addMesh(position, name, show);
            
            addTextureTitle(name);

			lost = name;

			cant++;	
		}

		if(cant < 4){

			var _position = {x : Math.random() * 80000};

			for(cant; cant <= 4; cant++)
				addMesh('1', _position , lost, false);
		}

		addTitle();

	}

    /**
	* @author Ricardo Delgado
	* Variable filled SCREENSHOTS.
    * @param {String}  id   Wallet id
    * @param {number}  position   End position of the plane in the x axis.
    * @param {String}   wallet     Wallet group to which it belongs.
    * @param {Array}  screenshots  All routes screenshot.
	*/ 
	function fillScreenshots(id, _id, position, name, show, screenshots){

		SCREENSHOTS[id] = {};
		SCREENSHOTS[id].name = name;
		SCREENSHOTS[id].position = position;
		SCREENSHOTS[id].show = show;		
		SCREENSHOTS[id].screenshots = screenshots;
		SCREENSHOTS[id].id = _id;
	}

	/**
	* @author Ricardo Delgado
	* Each drawing screenshots of wallet.
	* @param {String}  wallet   Wallet draw. 
	*/
	function addWallet(id, wallet) {

		var cant = 0,
			total = 4;

		for(var c in SCREENSHOTS[id].screenshots){
			cant++;
		}

		if(cant <= 4)
			total = cant;

		for(var i = 1; i <= total; i++) {
			addTextureWallet(id, wallet, i);
		}
	}

	/**
	* @author Ricardo Delgado
	* Search for a wallet in specific in the variable self.objects.texture.
	* @param {String}  wallet   Group wallet to find.
	* @param {Number}    id     Wallet identifier. 
	*/
	function searchWallet(wallet, id) {

		var i = 0;

		while(self.objects.texture[i].wallet != wallet || self.objects.texture[i].id != id) {
			i++ ;
		}  

		return self.objects.texture[i].image;
	}

	/**
	* @author Ricardo Delgado
	* The plans necessary for the wallet are added, each level is for a group of wallet.
	* @param {number}  root    End position of the plane in the x axis.
	* @param {String}  wallet     Wallet group to which it belongs.
	*/   
	function addMesh(root, wallet, state) {

		var id = self.objects.mesh.length,
			x = root.x,
			y = 0,
			z = 0,
			_texture = null,
			position = new THREE.Vector3(0, 0, 0); 


        _texture = searchWallet(wallet, 1);
        y = window.tileManager.dimensions.layerPositions[3] + window.TILE_DIMENSION.height + 240;

			
		var mesh = new THREE.Mesh(
					new THREE.PlaneBufferGeometry(50, 80),
					new THREE.MeshBasicMaterial({ map:_texture, side: THREE.FrontSide, transparent: true })
					);

		mesh.material.needsUpdate = true;

		mesh.userData = {
			id : id,
			wallet : wallet,
			onClick : onClick
		};

		position.y = y;

		position = window.viewManager.translateToSection('table', position);

		var target = window.helper.fillTarget(x, position.y, z, 'table');

		mesh.material.opacity = 1;

		mesh.scale.set(4, 4, 4);

		mesh.position.copy(target.hide.position);
		mesh.rotation.set(target.hide.rotation.x, target.hide.rotation.y, target.hide.rotation.z);

		window.scene.add(mesh);

		if(!state){
			target.show = target.hide;
		}

		self.objects.target.push(target);

		self.objects.mesh.push(mesh);
	}

	/**
	* @author Ricardo Delgado
	* Add the title of the group focused wallet.
	* @param {String}    text    Behalf of the wallet.
	*/ 
	function addTitle() {

		var texture = null;
			
		var mesh = new THREE.Mesh(
					new THREE.PlaneGeometry(70, 15),
					new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide, transparent: true })
				);

		mesh.material.needsUpdate = true;

		mesh.material.opacity = 1;

		mesh.scale.set(4, 4, 4);

		var target = window.helper.fillTarget(0, 0, 0, 'table');

		mesh.position.copy(target.hide.position);
		mesh.rotation.set(target.hide.rotation.x, target.hide.rotation.y, target.hide.rotation.z);

		window.scene.add(mesh);

		self.objects.title.mesh = {
			mesh : mesh,
			target : target
		};
	}

	/**
	* @author Ricardo Delgado
	* Add the title of the group focused wallet.
	* @param {String}    Wallet    Behalf of the wallet.
	*/ 
	function addTextureTitle(wallet){

		var canvas,
			ctx,
			texture,
			text = wallet;

		canvas = document.createElement('canvas');
		canvas.width  = 600;
		canvas.height = 200;
		var middle = canvas.width / 2;
		ctx = canvas.getContext("2d");
		ctx.textAlign = 'center';
		ctx.font="bold 40px Arial";
		ctx.fillText(text, middle, 100);

		texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;  
		texture.minFilter = THREE.NearestFilter;

		self.objects.title.texture[wallet] = texture;
	}

	/**
	* @author Ricardo Delgado
	* Wallet drawn and added required.
	* @param {String}    wallet    Wallet draw.
	* @param {String}      i       Group identifier wallet.
	*/ 
	function addTextureWallet(_id, wallet, i) {

		var _texture,
			image,
			cant = 0,
			place;

		for(var f in SCREENSHOTS[_id].screenshots){
			cant++;
		}

		place = Math.floor(Math.random()* cant + 1);

		if(CONTROL[wallet]["picture"+place] === undefined){

			CONTROL[wallet]["picture"+place] = place;

			image = new THREE.ImageUtils.loadTexture(SCREENSHOTS[_id].screenshots['Screenshots_'+place]);
			image.needsUpdate = true;  
			image.minFilter = THREE.NearestFilter;

			_texture = { id : i, wallet : wallet, image : image };

			self.objects.texture.push(_texture);

		}
		else
			addTextureWallet(_id, wallet, i);
	}

	/**
	* @author Ricardo Delgado
	* Load the title of the selected wallet.
	* @param {String}    Wallet    Behalf of the wallet.
	* @param {object}     mesh     Wallet.	
	*/ 
	function titleVisibility(wallet, mesh, option) {

		var _mesh = self.objects.title.mesh.mesh,
			target = {};

		target = window.helper.fillTarget(mesh.position.x, mesh.position.y + 240, mesh.position.z, 'table');

		_mesh.material.map = self.objects.title.texture[wallet]; 
		_mesh.material.needsUpdate = true;

		if(option === 'show')
			animate(_mesh, target.show, 2000);
		else
			animate(_mesh, target.hide, 2000);
	}

	/**
	* @author Ricardo Delgado
	* Wallet focus and draw the other planes in the same group wallet.
	* @param {Number}    id    Wallet identifier focus.
	*/ 
	
	function change(id) {

		var duration = 2000;
		var focus = parseInt(id);

		if(window.camera.getFocus() === null) {

			action.state = true; action.mesh = id;

			window.tileManager.letAlone();

			window.camera.setFocus(self.objects.mesh[focus], new THREE.Vector4(0, 0, window.TILE_DIMENSION.width - window.TILE_SPACING, 1), duration);
			
			window.headers.hideHeaders(duration);
			
			window.helper.showBackButton();

			positionFocus(id);
		}
	}

	function showScreenshotsButton(_id){

		var wallet = SCREENSHOTS[_id].name,
			position = SCREENSHOTS[_id].position,
			id = 0,
			mesh = null,
            target = {};

		for(var i = 0; i < self.objects.mesh.length; i++){
			if(self.objects.mesh[i].userData.wallet === wallet){
				id = i;
				mesh = self.objects.mesh[i];
			}
		}

		action.state = true; action.mesh = id;

		window.tileManager.letAlone();

		target = window.helper.fillTarget(position.x, position.y, 0, 'table');

		animate(mesh, target.show, 1000, function(){
	   		window.camera.enable();
	   		window.camera.setFocus(mesh, new THREE.Vector4(0, 0, window.TILE_DIMENSION.width - window.TILE_SPACING, 1), 1000);
	   		positionFocus(id);
		});
	}

	/**
	* @author Ricardo Delgado
	* Screenshots account total has a wallet.
	* @param {String}    Wallet    Wallet counting.
	*/ 
	function countControl(wallet){

		var sum = 0;
		
		for(var i in CONTROL[wallet])
			sum++;

		return sum;
	}

	/**
	* @author Ricardo Delgado
	* Accommodate the wallet.
	* @param {Number}    id    Identifier reference wallet.
	*/ 
	function positionFocus(id) {

		var ignore = id,
			mesh = self.objects.mesh[id],
			wallet = mesh.userData.wallet,
			target = {},
			count = 1,
			_countControl = countControl(wallet),
			x = POSITION_X;

		titleVisibility(wallet, mesh, 'show');
			
		target = window.helper.fillTarget(mesh.position.x - (x / 2), mesh.position.y, mesh.position.z, 'table');
        
		if(_countControl > 3)
			animate(mesh, target.show, 1000);

		setTimeout(function() { loadTexture(wallet, ignore); }, 500);

		setTimeout(function() { 

			for(var i = 0; i < 4; i++) { 

				if(count < 4){ 

					if(count < _countControl){

						if(i != ignore) { 

							var _mesh = self.objects.mesh[i];

							if(_countControl > 3){ 

								if(x === POSITION_X)
									x = x * 2;
								else if(x > POSITION_X)
									x = (x / 2) * -1;
								else
									x = POSITION_X;

							}
							else{

								if(count === 1)
									x = x;
								else
									x = x * -1;
							}

							count++;

							target = window.helper.fillTarget(mesh.position.x + x, mesh.position.y, mesh.position.z, 'table');

							animate(_mesh, target.show, 2000);

						}
					} 
				}            
			}
		}, 1500);
	}

	/**
	* @author Ricardo Delgado
	* Texture change of plans regarding the group focused wallet.
	* @param {String}    wallet    Behalf of the wallet.
	* @param {Number}    ignore    Id focused wallet.
	*/ 
	function loadTexture(wallet, ignore) {

		var id = 1,
			_mesh,
			count = 1,
			_countControl = countControl(wallet);

		for(var i = 0; i < 4; i++) { 

			if(count < 4){ 

				if(count < _countControl){

					if(i != ignore) { 

						id = id + 1 ;

						_mesh = self.objects.mesh[i];
						_mesh.material.map = searchWallet(wallet, id); 
						_mesh.material.needsUpdate = true;

						count++;
					}
				}
			}
		} 
	}

	/**
	* @author Ricardo Delgado
	* Change texture of the planes to the original state.
	* @param {Number}    ignore    Id focused wallet.
	*/   
	function resetTexture(ignore) {

		var title = self.objects.title.mesh.mesh, 
			_mesh;

		self.hide(); 

		animate(title, self.objects.title.mesh.target.hide, 1000, function() {   

			for(var i = 0; i < self.objects.mesh.length; i++) { 

				if(i != ignore) { 

					_mesh = self.objects.mesh[i];
					_mesh.material.map = searchWallet(_mesh.userData.wallet, 1); 
					_mesh.material.needsUpdate = true;
				}
			} 

			action.state = false;

			self.show();  

		});
	}

	/**
	* @author Ricardo Delgado
	* Animation and out of the wallet.
	* @param {object}     mesh     Wallet.
	* @param {Number}    target    Coordinates wallet.
	* @param {Boolean}   state     Status wallet.
	* @param {Number}   duration   Animation length.
	*/ 
    function animate(mesh, target, duration, callback){

        var _duration = duration || 2000,
            x = target.position.x,
            y = target.position.y,
            z = target.position.z,
            rx = target.rotation.x,
            ry = target.rotation.y,
            rz = target.rotation.z; 

        _duration = Math.random() * _duration + _duration;

        new TWEEN.Tween(mesh.position)
            .to({x : x, y : y, z : z}, _duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(mesh.rotation)
            .to({x: rx, y: ry, z: rz}, _duration + 500)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function () {
                    if(typeof(callback) === 'function')
                        callback();   
                })
            .start();
    }
}