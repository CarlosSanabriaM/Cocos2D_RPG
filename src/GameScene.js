var tipoBordeMapa       = 1;
var tipoLimite          = 2;
var tipoJugador         = 3;
var tipoFlechaJugador   = 4;
var tipoPiedraJugador   = 5;
var tipoEnemigo         = 6;
var tipoFlechaEnemigo   = 7;
var tipoMoneda          = 8;
var tipoCorazon         = 9;
var tipoInmunidad       = 10;
var tipoMeta            = 11;
var tipoCajaMadera      = 12;
var tipoCajaMetal       = 13;
var tipoBaldosaMadera   = 14;
var tipoBaldosaMetal    = 15;
var tipoPalancaPuerta   = 16;

var GameLayer = cc.Layer.extend({
    space:null,
    tecla:0,
    mapa:null,
    mapaAncho:0,
    mapaAlto:0,
    formasEliminar:[],
    caballero:null,
    flechasCaballero:[],
    piedrasCaballero:[],
    enemigosArquero:[],
    enemigosRey:[],
    flechasEnemigos:[],
    monedas:[],
    corazones:[],
    inmunidades:[],
    meta:null,
    puerta:null,
    palancaPuerta:null,
    cajaMadera:null,
    cajaMetal:null,
    baldosaMadera:null,
    baldosaMetal:null,
    baldosaMaderaActiva:false,
    baldosaMetalActiva:false,

    ctor:function () {
       this._super();
       var size = cc.winSize;

        //Cacheamos los sprites
        cc.spriteFrameCache.addSpriteFrames(res.caballero_plist);
        cc.spriteFrameCache.addSpriteFrames(res.caballero_ataque_plist);
        cc.spriteFrameCache.addSpriteFrames(res.caballero_muerte_plist);
        cc.spriteFrameCache.addSpriteFrames(res.arquero_plist);
        cc.spriteFrameCache.addSpriteFrames(res.arquero_ataque_plist);
        cc.spriteFrameCache.addSpriteFrames(res.arquero_muerte_plist);
        cc.spriteFrameCache.addSpriteFrames(res.rey_plist);
        cc.spriteFrameCache.addSpriteFrames(res.rey_muerte_plist);
        cc.spriteFrameCache.addSpriteFrames(res.moneda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.flecha_plist);
        cc.spriteFrameCache.addSpriteFrames(res.inmunidad_plist);

       // Inicializar Space (sin gravedad)
       this.space = new cp.Space();

       //DEPURACION
       //this.depuracion = new cc.PhysicsDebugNode(this.space);
       //this.addChild(this.depuracion, 10);

       this.cargarMapa();
       this.scheduleUpdate();

       cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.teclaPulsada,
            onKeyReleased: this.teclaLevantada
       }, this);

       //Reproducimos la musica de fondo
        cc.audioEngine.playMusic(res.musica_fondo_wav,true);
        cc.audioEngine.setMusicVolume(0.25);

       //COLISIONES
        // jugador y moneda
        // IMPORTANTE: Invocamos el método antes de resolver la colisión
        // (realmente no habrá colisión por la propiedad SENSOR de la Moneda).
        this.space.addCollisionHandler(tipoJugador, tipoMoneda,
            null, this.colisionJugadorConMoneda.bind(this), null, null);

        // jugador e inmunidad
        // IMPORTANTE: Invocamos el método antes de resolver la colisión
        // (realmente no habrá colisión por la propiedad SENSOR de la Inmunidad).
        this.space.addCollisionHandler(tipoJugador, tipoInmunidad,
            null, this.colisionJugadorConInmunidad.bind(this), null, null);

        // jugador y corazon
        // IMPORTANTE: Invocamos el método antes de resolver la colisión
        // (realmente no habrá colisión por la propiedad SENSOR de la Inmunidad).
        this.space.addCollisionHandler(tipoJugador, tipoCorazon,
            null, this.colisionJugadorConCorazon.bind(this), null, null);

        // jugador y meta
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoJugador, tipoMeta,
            null, this.colisionJugadorConMeta.bind(this), null, null);

        // jugador y palanca
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoJugador, tipoPalancaPuerta,
            null, this.colisionJugadorConPalancaPuerta.bind(this), null, null);

        // jugador y enemigo
        this.space.addCollisionHandler(tipoJugador,tipoEnemigo,
            null,null,this.colisionJugadorConEnemigo.bind(this),null);

        // flecha jugador y enemigo
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoFlechaJugador, tipoEnemigo,
            null, this.colisionFlechaJugadorConEnemigo.bind(this), null, null);

        // flecha jugador y limite
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoFlechaJugador, tipoLimite,
            null, this.colisionFlechaJugadorConLimite.bind(this), null, null);

        // flecha jugador y borde mapa
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoFlechaJugador, tipoBordeMapa,
            null, this.colisionFlechaJugadorConBordeMapa.bind(this), null, null);

        // piedra y borde mapa
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoPiedraJugador, tipoBordeMapa,
            null, this.colisionPiedraConBordeMapa.bind(this), null, null);

        // piedra y limite
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoPiedraJugador, tipoLimite,
            null, this.colisionPiedraConLimite.bind(this), null, null);

        // piedra y enemigo
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoPiedraJugador, tipoEnemigo,
            null, this.colisionPiedraConEnemigo.bind(this), null, null);

        // flecha enemigo y limite
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoFlechaEnemigo, tipoLimite,
            null, this.colisionFlechaEnemigoConLimite.bind(this), null, null);

        // flecha enemigo y borde mapa
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoFlechaEnemigo, tipoBordeMapa,
            null, this.colisionFlechaEnemigoConBordeMapa.bind(this), null, null);

        // flecha enemigo y jugador
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoFlechaEnemigo, tipoJugador,
            null, this.colisionFlechaEnemigoConJugador.bind(this), null, null);

        // caja madera y baldosa madera
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        // Invocamos a otro metodo despues de que dejan de colisionar
        this.space.addCollisionHandler(tipoCajaMadera, tipoBaldosaMadera,
            null, this.colisionCajaMaderaConBaldosaMadera.bind(this), null, this.finColisionCajaMaderaConBaldosaMadera.bind(this));

        // caja metal y baldosa metal
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        // Invocamos a otro metodo despues de que dejan de colisionar
        this.space.addCollisionHandler(tipoCajaMetal, tipoBaldosaMetal,
            null, this.colisionCajaMetalConBaldosaMetal.bind(this), null, this.finColisionCajaMetalConBaldosaMetal.bind(this));

       return true;

    },update:function (dt) {
        this.space.step(dt);

        this.caballero.update(dt);

        //Actualizamos los enemigos
        for (var i = 0; i < this.enemigosArquero.length; i++) {
            this.enemigosArquero[i].update(dt);
        }
        for (var i = 0; i < this.enemigosRey.length; i++) {
            this.enemigosRey[i].update(dt);
        }

        //Actualizamos la palanca
        this.palancaPuerta.update(dt);

        //Actualizamos las cajas
        this.cajaMadera.update(dt);
        this.cajaMetal.update(dt);

        //Movemos la camara cuando haga falta
        var posicionXCamara = this.caballero.body.p.x - this.getContentSize().width/2;
        var posicionYCamara = this.caballero.body.p.y - this.getContentSize().height/2;

        if ( posicionXCamara < 0 ){
            posicionXCamara = 0;
        }
        if ( posicionXCamara > this.mapaAncho - this.getContentSize().width ){
            posicionXCamara = this.mapaAncho - this.getContentSize().width;
        }

        if ( posicionYCamara < 0 ){
            posicionYCamara = 0;
        }
        if ( posicionYCamara > this.mapaAlto - this.getContentSize().height ){
            posicionYCamara = this.mapaAlto - this.getContentSize().height ;
        }

        this.setPosition(cc.p( - posicionXCamara , - posicionYCamara));


        //Comprobamos la pulsacion de las teclas
        // izquierda (tecla A)
        if (this.tecla == 65 ){
            if( this.caballero.body.p.x > 0){
                this.caballero.moverIzquierda();
            } else {
                this.caballero.detener();
            }
        }
        // derecha (tecla D)
        if (this.tecla == 68 ){
            if( this.caballero.body.p.x < this.mapaAncho){
                this.caballero.moverDerecha();
            } else {
                this.caballero.detener();
            }
        }
        // arriba (tecla W)
        if (this.tecla == 87 ){
            if( this.caballero.body.p.y < this.mapaAlto){
                this.caballero.moverArriba();
            } else {
                this.caballero.detener();
            }
        }

        // abajo (tecla S)
        if (this.tecla == 83 ){
            if( this.caballero.body.p.y > 0){
                this.caballero.moverAbajo();
            } else {
                this.caballero.detener();
            }
        }

        // atacar espada (tecla J)
        if (this.tecla == 74 ){
            this.caballero.atacar_espada();
        }

        // atacar arco (tecla K)
        if (this.tecla == 75 ){
            this.caballero.atacar_arco();
        }

        // atacar piedra (tecla L)
        if (this.tecla == 76 ){
            this.caballero.atacar_piedra();
        }

        // ninguna pulsada
        if( this.tecla == 0 ){
            this.caballero.detener();
        }


        // Eliminar formas:
        for(var i = 0; i < this.formasEliminar.length; i++) {
            var shape = this.formasEliminar[i];

            for (var r = 0; r < this.monedas.length; r++) {
                if (this.monedas[r].shape == shape) {
                    this.monedas[r].eliminar();
                    this.monedas.splice(r, 1);
                }
            }

            for (var r = 0; r < this.inmunidades.length; r++) {
                if (this.inmunidades[r].shape == shape) {
                    this.inmunidades[r].eliminar();
                    this.inmunidades.splice(r, 1);
                }
            }

            for (var r = 0; r < this.corazones.length; r++) {
                if (this.corazones[r].shape == shape) {
                    this.corazones[r].eliminar();
                    this.corazones.splice(r, 1);
                }
            }

            for (var r = 0; r < this.flechasCaballero.length; r++) {
                if (this.flechasCaballero[r].shape == shape) {
                    this.flechasCaballero[r].eliminar();
                    this.flechasCaballero.splice(r, 1);
                }
            }

            for (var r = 0; r < this.flechasEnemigos.length; r++) {
                if (this.flechasEnemigos[r].shape == shape) {
                    this.flechasEnemigos[r].eliminar();
                    this.flechasEnemigos.splice(r, 1);
                }
            }

            for (var r = 0; r < this.piedrasCaballero.length; r++) {
                if (this.piedrasCaballero[r].shape == shape) {
                    this.piedrasCaballero[r].eliminar();
                    this.piedrasCaballero.splice(r, 1);
                }
            }
        }
        this.formasEliminar = [];

        //Eliminar los enemigos que esten en el estado eliminar
        for (var r = 0; r < this.enemigosArquero.length; r++) {
            if (this.enemigosArquero[r].estado == estadoEliminarArquero) {
                console.log("Enemigo arquero eliminado");
                var posEnemigo = this.enemigosArquero[r].body.getPos();

                this.enemigosArquero[r].eliminar();
                this.enemigosArquero.splice(r, 1);

                //Generamos un powerup al azar en su posicion
                this.generarPowerUpAlAzar(posEnemigo);
            }
        }
        for (var r = 0; r < this.enemigosRey.length; r++) {
            if (this.enemigosRey[r].estado == estadoEliminarRey) {
                console.log("Enemigo rey eliminado");
                var posEnemigo = this.enemigosRey[r].body.getPos();

                this.enemigosRey[r].eliminar();
                this.enemigosRey.splice(r, 1);

                //Generamos un powerup al azar en su posicion
                this.generarPowerUpAlAzar(posEnemigo);
            }
        }

        //Eliminar las piedras que esten en estado eliminar
        for (var r = 0; r < this.piedrasCaballero.length; r++) {
            if (this.piedrasCaballero[r].estado == estadoEliminarPiedra) {
                this.piedrasCaballero[r].eliminar();
                this.piedrasCaballero.splice(r, 1);
            }
        }

        this.comprobarTodosEnemigosEliminados();
        this.comprobarBaldosasActivas();

    }, cargarMapa:function () {
       this.mapa = new cc.TMXTiledMap(res.mapa1_tmx);
       // Añadirlo a la Layer
       this.addChild(this.mapa);
       // Ancho del mapa
       this.mapaAncho = this.mapa.getContentSize().width;
       this.mapaAlto = this.mapa.getContentSize().height;

        // Solicitar los objetos dentro de la capa Limites
        var grupoLimites = this.mapa.getObjectGroup("Limites");
        var limitesArray = grupoLimites.getObjects();

        // Los objetos de la capa limites
        // formas estáticas de Chipmunk ( SegmentShape ).
        for (var i = 0; i < limitesArray.length; i++) {
              var limite = limitesArray[i];
              var puntos = limite.polylinePoints;
              for(var j = 0; j < puntos.length - 1; j++){
                  var bodyLimite = new cp.StaticBody();

                  var shapeLimite = new cp.SegmentShape(bodyLimite,
                      cp.v(parseInt(limite.x) + parseInt(puntos[j].x),
                          parseInt(limite.y) - parseInt(puntos[j].y)),
                      cp.v(parseInt(limite.x) + parseInt(puntos[j + 1].x),
                          parseInt(limite.y) - parseInt(puntos[j + 1].y)),
                      1);

                  shapeLimite.setFriction(1);
                  shapeLimite.setElasticity(0);
                  shapeLimite.setCollisionType(tipoLimite);
                  this.space.addStaticShape(shapeLimite);
              }
        }

        // Solicitar los objetos dentro de la capa BordesMapa
        var grupoBordesMapa = this.mapa.getObjectGroup("BordesMapa");
        var bordesMapaArray = grupoBordesMapa.getObjects();

        // Los objetos de la capa BordesMapa
        // formas estáticas de Chipmunk ( SegmentShape ).
        for (var i = 0; i < bordesMapaArray.length; i++) {
            var bordeMapa = bordesMapaArray[i];
            var puntos = bordeMapa.polylinePoints;
            for(var j = 0; j < puntos.length - 1; j++){
                var bodyBordeMapa = new cp.StaticBody();

                var shapeBordeMapa = new cp.SegmentShape(bodyBordeMapa,
                    cp.v(parseInt(bordeMapa.x) + parseInt(puntos[j].x),
                        parseInt(bordeMapa.y) - parseInt(puntos[j].y)),
                    cp.v(parseInt(bordeMapa.x) + parseInt(puntos[j + 1].x),
                        parseInt(bordeMapa.y) - parseInt(puntos[j + 1].y)),
                    1);

                shapeBordeMapa.setFriction(1);
                shapeBordeMapa.setElasticity(0);
                shapeBordeMapa.setCollisionType(tipoBordeMapa);
                this.space.addStaticShape(shapeBordeMapa);
            }
        }

        //Cargamos al jugador
        var grupoCaballero = this.mapa.getObjectGroup("Caballero");
        var caballeroArray = grupoCaballero.getObjects();
        this.caballero = new Caballero(cc.p(caballeroArray[0]["x"],caballeroArray[0]["y"]), this);

        // Cargamos los enemigos
        var grupoReyes = this.mapa.getObjectGroup("Reyes");
        var reyesArray = grupoReyes.getObjects();
        for (var i = 0; i < reyesArray.length; i++) {


            var rey = new Rey(cc.p(reyesArray[i]["x"],reyesArray[i]["y"]), this);
            this.enemigosRey.push(rey);
        }

        var grupoArqueros = this.mapa.getObjectGroup("Arqueros");
        var arquerosArray = grupoArqueros.getObjects();
        for (var i = 0; i < arquerosArray.length; i++) {
            var arquero = new Arquero(cc.p(arquerosArray[i]["x"],arquerosArray[i]["y"]), this);
            this.enemigosArquero.push(arquero);
        }

        // Cargamos las monedas
        var grupoMonedas = this.mapa.getObjectGroup("Monedas");
        var monedasArray = grupoMonedas.getObjects();
        for (var i = 0; i < monedasArray.length; i++) {
            var moneda = new Moneda(this,
                cc.p(monedasArray[i]["x"],monedasArray[i]["y"]));
            this.monedas.push(moneda);
        }

        // Cargamos las inmunidades
        var grupoInmunidades = this.mapa.getObjectGroup("Inmunidades");
        var inmunidadesArray = grupoInmunidades.getObjects();
        for (var i = 0; i < inmunidadesArray.length; i++) {
            var inmunidad = new Inmunidad(this,
                cc.p(inmunidadesArray[i]["x"],inmunidadesArray[i]["y"]));
            this.inmunidades.push(inmunidad);
        }

        // Cargamos los corazones
        var grupoCorazones = this.mapa.getObjectGroup("Corazones");
        var corazonesArray = grupoCorazones.getObjects();
        for (var i = 0; i < corazonesArray.length; i++) {
            var corazon = new Corazon(this,
                cc.p(corazonesArray[i]["x"],corazonesArray[i]["y"]));
            this.corazones.push(corazon);
        }

        // Cargamos la puerta
        var grupoPuerta = this.mapa.getObjectGroup("Puerta");
        var puertaArray = grupoPuerta.getObjects();
        this.puerta = new Puerta(cc.p(puertaArray[0]["x"],puertaArray[0]["y"]), this);

        // Cargamos la palanca
        var grupoPalanca = this.mapa.getObjectGroup("Palanca");
        var palancaArray = grupoPalanca.getObjects();
        this.palancaPuerta = new Palanca(cc.p(palancaArray[0]["x"],palancaArray[0]["y"]),
            this, palancaArray[0]["width"], palancaArray[0]["height"]);

        // Cargamos las cajas
        var grupoCajaMadera = this.mapa.getObjectGroup("CajaMadera");
        var cajaMaderaArray = grupoCajaMadera.getObjects();
        this.cajaMadera = new Caja(cc.p(cajaMaderaArray[0]["x"],cajaMaderaArray[0]["y"]),
            this, "madera");

        var grupoCajaMetal = this.mapa.getObjectGroup("CajaMetal");
        var cajaMetalArray = grupoCajaMetal.getObjects();
        this.cajaMetal = new Caja(cc.p(cajaMetalArray[0]["x"],cajaMetalArray[0]["y"]),
            this, "metal");

        // Cargamos las baldosas
        var grupoBaldosaMadera = this.mapa.getObjectGroup("BaldosaMadera");
        var baldosaMaderaArray = grupoBaldosaMadera.getObjects();
        this.baldosaMadera = new Baldosa(cc.p(baldosaMaderaArray[0]["x"],baldosaMaderaArray[0]["y"]),
            this, baldosaMaderaArray[0]["width"], baldosaMaderaArray[0]["height"],"madera");

        var grupoBaldosaMetal = this.mapa.getObjectGroup("BaldosaMetal");
        var baldosaMetalArray = grupoBaldosaMetal.getObjects();
        this.baldosaMetal = new Baldosa(cc.p(baldosaMetalArray[0]["x"],baldosaMetalArray[0]["y"]),
            this, baldosaMetalArray[0]["width"], baldosaMetalArray[0]["height"],"metal");

    },teclaPulsada: function(keyCode, event){
         var instancia = event.getCurrentTarget();

         instancia.tecla = keyCode;
         //console.log("Tecla: " + keyCode);

    },teclaLevantada: function(keyCode, event){
        var instancia = event.getCurrentTarget();

        if ( instancia.tecla  == keyCode){
            instancia.tecla = 0;
        }

        //Si el juego esta pausado y se levanta una tecla
        if(cc.director.isPaused()){
            //Se para la musica de fondo y se vuelve a la escena inicial
            cc.audioEngine.stopMusic();
            cc.director.resume();
            cc.director.runScene(new MenuScene());
        }

    },generarPowerUpAlAzar: function(posEnemigo){
        var powerup = new Utilidades().damePowerUpAlAzar();

        switch (powerup){
            case NINGUNO:
                break;
            case MONEDA:
                var moneda = new Moneda(this, posEnemigo);
                this.monedas.push(moneda);
                break;
            case CORAZON:
                var corazon = new Corazon(this, posEnemigo);
                this.corazones.push(corazon);
                break;
            case INMUNIDAD:
                var inmunidad = new Inmunidad(this, posEnemigo);
                this.inmunidades.push(inmunidad);
                break;
        }

    },comprobarBaldosasActivas:function(){
        //Si ambas baldosas estan activas
        if(this.baldosaMaderaActiva && this.baldosaMetalActiva){
            //Si la puerta esta cerrada
            if( !this.puerta.abierta ){
                //La abrimos
                this.puerta.abrir();
            }
        }

        //Si no estan ambas activas
        else{
            //Si la puerta esta abierta
            if( this.puerta.abierta ){
                //Si la puerta NO esta siendo abierta por la palanca
                if( !this.palancaPuerta.puertaAbiertaConPalanca )
                //La cerramos
                    this.puerta.cerrar();
            }
        }

    },comprobarTodosEnemigosEliminados: function() {
        //Si no quedan enemigos
        var numEnemigos = this.enemigosRey.length + this.enemigosArquero.length;
        if (numEnemigos  == 0 && this.meta==null)
            this.hacerQueAparazecaLaMeta();

    },hacerQueAparazecaLaMeta: function() {
        console.log("Ha aparecido la meta");

        var grupoMeta = this.mapa.getObjectGroup("Meta");
        var metaArray = grupoMeta.getObjects();
        this.meta = new Meta(this,
            cc.p(metaArray[0]["x"],metaArray[0]["y"]));

        cc.audioEngine.playEffect(res.meta_aparece_wav);

    },colisionJugadorConMoneda:function (arbiter, space) {
        // shapes[0] es el jugador y shapes[1] es la moneda
        var shapes = arbiter.getShapes();

        // Marcar la moneda para eliminarla
        this.formasEliminar.push(shapes[1]);

        //Iteramos por las monedas, buscando la moneda cuya shape sea la shape de la moneda con la que colisiona el jugador
        for (var i = 0; i < this.monedas.length; i++) {
            if (this.monedas[i].shape == shapes[1]) {
                //Ejecutamos la accion de la moneda
                this.monedas[i].accion();
            }
        }

    },colisionJugadorConInmunidad:function (arbiter, space) {
        // shapes[0] es el jugador y shapes[1] es la inmunidad
        var shapes = arbiter.getShapes();

        // Marcar la inmunidad para eliminarla
        this.formasEliminar.push(shapes[1]);

        //Iteramos por las inmunidades, buscando la inmunidad cuya shape sea la shape de la inmunidad con la que colisiona el jugador
        for (var i = 0; i < this.inmunidades.length; i++) {
            if (this.inmunidades[i].shape == shapes[1]) {
                //Ejecutamos la accion de la inmunidad
                this.inmunidades[i].accion();
            }
        }

    },colisionJugadorConCorazon:function (arbiter, space) {
        // shapes[0] es el jugador y shapes[1] es el corazon
        var shapes = arbiter.getShapes();

        // Marcar el corazon para eliminarlo
        this.formasEliminar.push(shapes[1]);

        //Iteramos por los corazones, buscando el corazon cuya shape sea la shape del corazon con el que colisiona el jugador
        for (var i = 0; i < this.corazones.length; i++) {
            if (this.corazones[i].shape == shapes[1]) {
                //Ejecutamos la accion del corazon
                this.corazones[i].accion();
            }
        }

    },colisionJugadorConMeta:function (arbiter, space) {
        this.meta.accion();

    },colisionJugadorConPalancaPuerta:function (arbiter, space) {
        //La abrimos durante 5 segundos con la palanca
        this.palancaPuerta.abrirPuerta();

    },colisionJugadorConEnemigo:function (arbiter, space) {
        // shapes[0] es el jugador y shapes[1] es el enemigo
        var shapes = arbiter.getShapes();

        //Sacamos el enemigo
        var enemigo;
        //Iteramos por los enemigos, buscando el enemigo cuya shape sea la shape del enemigo con el que colisiona el jugador
        for (var i = 0; i < this.enemigosArquero.length; i++) {
            if (this.enemigosArquero[i].shape == shapes[1]) {
                enemigo = this.enemigosArquero[i];
            }
        }
        for (var i = 0; i < this.enemigosRey.length; i++) {
            if (this.enemigosRey[i].shape == shapes[1]) {
                enemigo = this.enemigosRey[i];
            }
        }

        //Si el enemigo esta muriendo o listo para eliminar, no hacemos nada
        if(enemigo instanceof Rey && (enemigo.estado==estadoMuriendoRey || enemigo.estado==estadoEliminarRey)){
            return;
        }
        if(enemigo instanceof Arquero && (enemigo.estado==estadoMuriendoArquero || enemigo.estado==estadoEliminarArquero)){
            return;
        }

        //Si el jugador esta atacando, le reducimos una vida al enemigo
        if(this.caballero.estado==estadoAtacandoCaballero){
            //Solo reproducimos el sonido del impacto de la espada en la primera colision,
            // ya que se producen varias colisiones seguidas
            //La primera colision es aquella en la que el enemigo no tiene tiempo de inmunidad
            if(enemigo.tiempoInmunidad==0)
                cc.audioEngine.playEffect(res.impacto_espada_wav);

            enemigo.reducirVida();

            return;
        }

         //Si el jugador no esta en tiempo de inmunidad o en estado muriendo, le reducimos una vida al jugador
        if(this.caballero.tiempoInmunidad==0 && this.caballero.estado!=estadoMuriendoCaballero)
            this.caballero.reducirVida();

    },colisionFlechaJugadorConEnemigo:function (arbiter, space) {
        // shapes[0] es la flecha del jugador y shapes[1] es el enemigo
        var shapes = arbiter.getShapes();

        cc.audioEngine.playEffect(res.impacto_flecha_wav);

        // Marcar la flecha del jugador para eliminarla
        this.formasEliminar.push(shapes[0]);

        //Sacamos el enemigo
        var enemigo;
        //Iteramos por los enemigos, buscando el enemigo cuya shape sea la shape del enemigo con el que colisiona el jugador
        for (var i = 0; i < this.enemigosArquero.length; i++) {
            if (this.enemigosArquero[i].shape == shapes[1]) {
                enemigo = this.enemigosArquero[i];
            }
        }
        for (var i = 0; i < this.enemigosRey.length; i++) {
            if (this.enemigosRey[i].shape == shapes[1]) {
                enemigo = this.enemigosRey[i];
            }
        }

        //Si el enemigo esta muriendo o listo para eliminar, no hacemos nada
        if(enemigo instanceof Rey && (enemigo.estado==estadoMuriendoRey || enemigo.estado==estadoEliminarRey)){
            return;
        }
        if(enemigo instanceof Arquero && (enemigo.estado==estadoMuriendoArquero || enemigo.estado==estadoEliminarArquero)){
            return;
        }

        enemigo.reducirVida();

    },colisionFlechaJugadorConBordeMapa:function (arbiter, space) {
        // shapes[0] es la flecha del jugador
        var shapes = arbiter.getShapes();

        // Marcar la flecha del jugador para eliminarla
        this.formasEliminar.push(shapes[0]);

    },colisionFlechaJugadorConLimite:function (arbiter, space) {
        // shapes[0] es la flecha del jugador
        var shapes = arbiter.getShapes();

        cc.audioEngine.playEffect(res.impacto_flecha_wav);

        // Marcar la flecha del jugador para eliminarla
        this.formasEliminar.push(shapes[0]);

    },colisionPiedraConBordeMapa:function (arbiter, space) {
        // shapes[0] es la piedra
        var shapes = arbiter.getShapes();

        //Marcamos la piedra para eliminarla
        this.formasEliminar.push(shapes[0]);

    },colisionPiedraConLimite:function (arbiter, space) {
        // shapes[0] es la piedra
        var shapes = arbiter.getShapes();

        //La piedra rebota
        for (var r = 0; r < this.piedrasCaballero.length; r++) {
            if (this.piedrasCaballero[r].shape == shapes[0]) {
                this.piedrasCaballero[r].rebotar();
            }
        }

    },colisionPiedraConEnemigo:function (arbiter, space) {
        // shapes[0] es la piedra y shapes[1] el enemigo
        var shapes = arbiter.getShapes();

        //La piedra rebota
        for (var r = 0; r < this.piedrasCaballero.length; r++) {
            if (this.piedrasCaballero[r].shape == shapes[0]) {
                this.piedrasCaballero[r].rebotar();
            }
        }

        //Sacamos el enemigo
        var enemigo;
        //Iteramos por los enemigos, buscando el enemigo cuya shape sea la shape del enemigo con el que colisiona el jugador
        for (var i = 0; i < this.enemigosArquero.length; i++) {
            if (this.enemigosArquero[i].shape == shapes[1]) {
                enemigo = this.enemigosArquero[i];
            }
        }
        for (var i = 0; i < this.enemigosRey.length; i++) {
            if (this.enemigosRey[i].shape == shapes[1]) {
                enemigo = this.enemigosRey[i];
            }
        }

        //Si el enemigo esta muriendo o listo para eliminar, no hacemos nada
        if(enemigo instanceof Rey && (enemigo.estado==estadoMuriendoRey || enemigo.estado==estadoEliminarRey)){
            return;
        }
        if(enemigo instanceof Arquero && (enemigo.estado==estadoMuriendoArquero || enemigo.estado==estadoEliminarArquero)){
            return;
        }

        enemigo.reducirVida();

    },colisionFlechaEnemigoConLimite:function (arbiter, space) {
        // shapes[0] es la flecha enemigo
        var shapes = arbiter.getShapes();

        cc.audioEngine.playEffect(res.impacto_flecha_wav);

        // Marcar la flecha del enemigo para eliminarla
        this.formasEliminar.push(shapes[0]);

    },colisionFlechaEnemigoConBordeMapa:function (arbiter, space) {
        // shapes[0] es la flecha enemigo
        var shapes = arbiter.getShapes();

        // Marcar la flecha del enemigo para eliminarla
        this.formasEliminar.push(shapes[0]);

    },colisionFlechaEnemigoConJugador:function (arbiter, space) {
        // shapes[0] es la flecha enemigo y shapes[1] es el jugador
        var shapes = arbiter.getShapes();

        // Marcar la flecha del enemigo para eliminarla
        this.formasEliminar.push(shapes[0]);

        //Si el jugador no esta en tiempo de inmunidad o en estado muriendo, le reducimos una vida al jugador
        if(this.caballero.tiempoInmunidad==0 && this.caballero.estado!=estadoMuriendoCaballero)
            this.caballero.reducirVida();

    },colisionCajaMaderaConBaldosaMadera:function (arbiter, space) {
        if( !this.baldosaMaderaActiva ){
            this.baldosaMaderaActiva = true;
            console.log("Baldosa madera activa");
        }

    },colisionCajaMetalConBaldosaMetal:function (arbiter, space) {
        if( !this.baldosaMetalActiva ){
            this.baldosaMetalActiva = true;
            console.log("Baldosa metal activa");
        }

    },finColisionCajaMaderaConBaldosaMadera:function (arbiter, space) {
        console.log("Baldosa madera desactivada");
        this.baldosaMaderaActiva = false;

    },finColisionCajaMetalConBaldosaMetal:function (arbiter, space) {
        console.log("Baldosa metal desactivada");
        this.baldosaMetalActiva = false;

    }

});

var idCapaJuego = 1;
var idCapaControles = 2;

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer, 0, idCapaJuego);

        var controlesLayer = new ControlesLayer();
        this.addChild(controlesLayer, 0, idCapaControles);

        layer.caballero.actualizarCapaVida();
    }
});
