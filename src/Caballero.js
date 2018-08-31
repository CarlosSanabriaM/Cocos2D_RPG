var estadoQuietoCaballero       = 1;
var estadoCaminandoCaballero    = 2;
var estadoAtacandoCaballero     = 3;
var estadoMuriendoCaballero     = 4;

var VIDAS_INICIALES_CABALLERO   = 3;
var VIDAS_MAXIMO_CABALLERO      = 5;
var TIEMPO_INMUNIDAD_CABALLERO  = 2;

var Caballero = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    animacionQuieto:null,
    animacionDerecha:null,
    animacionIzquierda:null,
    animacionArriba:null,
    animacionAbajo:null,
    animacionAtaqueArriba:null,
    animacionAtaqueDerecha:null,
    animacionAtaqueAbajo:null,
    animacionAtaqueIzquierda:null,
    animacionAtaqueADistanciaArriba:null,
    animacionAtaqueADistanciaDerecha:null,
    animacionAtaqueADistanciaAbajo:null,
    animacionAtaqueADistanciaIzquierda:null,
    animacionMuerte:null,
    animacion:null, // Actual
    tiempoInmunidad:0,
    vidas:VIDAS_INICIALES_CABALLERO,
    orientacion: null,
    _emitter: null, // Particulas para la inmunidad
    estado: estadoQuietoCaballero,

ctor:function (posicion, layer) {
    this.space = layer.space;
    this.layer = layer;

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#caballero_quieto_01.png");
    // Cuerpo dinamico, SI le afectan las fuerzas
    this.body = new cp.Body(5, Infinity);

    this.body.setPos(posicion);
    this.body.setAngle(0);
    this.sprite.setBody(this.body);

    // Se añade el cuerpo al espacio
    this.space.addBody(this.body);

    // forma
    this.shape = new cp.BoxShape(this.body,
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height);

    this.shape.setFriction(1);
    this.shape.setElasticity(0);
    this.shape.setCollisionType(tipoJugador);

    // forma dinamica
    this.space.addShape(this.shape);

    // Crear animación - quieto
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_quieto_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionQuieto =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - derecha
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_derecha_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionDerecha =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - izquierda
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_izquierda_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionIzquierda =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - arriba
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_arriba_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionArriba =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - abajo
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_abajo_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionAbajo =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - atacar arriba
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_ataque_arriba_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.5);
    this.animacionAtaqueArriba = new cc.Repeat(new cc.Animate(animacion),1);
    //La animacion de ataque a distancia es la misma, pero se ejecuta mas rapido
    var animacion = new cc.Animation(framesAnimacion, 0.3);
    this.animacionAtaqueADistanciaArriba = new cc.Repeat(new cc.Animate(animacion),1);

    // Crear animación - atacar derecha
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_ataque_derecha_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.5);
    this.animacionAtaqueDerecha = new cc.Repeat(new cc.Animate(animacion),1);
    //La animacion de ataque a distancia es la misma, pero se ejecuta mas rapido
    var animacion = new cc.Animation(framesAnimacion, 0.3);
    this.animacionAtaqueADistanciaDerecha = new cc.Repeat(new cc.Animate(animacion),1);

    // Crear animación - atacar abajo
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_ataque_abajo_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.5);
    this.animacionAtaqueAbajo = new cc.Repeat(new cc.Animate(animacion),1);
    //La animacion de ataque a distancia es la misma, pero se ejecuta mas rapido
    var animacion = new cc.Animation(framesAnimacion, 0.3);
    this.animacionAtaqueADistanciaAbajo = new cc.Repeat(new cc.Animate(animacion),1);

    // Crear animación - atacar izquierda
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_ataque_izquierda_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.5);
    this.animacionAtaqueIzquierda = new cc.Repeat(new cc.Animate(animacion),1);
    //La animacion de ataque a distancia es la misma, pero se ejecuta mas rapido
    var animacion = new cc.Animation(framesAnimacion, 0.3);
    this.animacionAtaqueADistanciaIzquierda = new cc.Repeat(new cc.Animate(animacion),1);

    // Crear animación - muerte
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "caballero_muerte_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 1);
    this.animacionMuerte = new cc.Repeat(new cc.Animate(animacion),1);


    // ejecutar la animación
    this.sprite.runAction(this.animacionQuieto);
    this.animacion = this.animacionQuieto;

    this.orientacion = ABAJO;

    // Declarar emisor de particulas (parado)
    this._emitter =  new cc.ParticleSun.create();
    this._emitter.setEmissionRate(0);//cerrado inicialmente
    this._emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
    layer.addChild(this._emitter,10);

    //Añadimos el sprite a la capa
    layer.addChild(this.sprite,10);

    },update:function (dt) {
        //dt --> Segundos que han pasado desde la ultima ejecucion

        // Reducir la inmunidad del caballero cuando corresponda
        if (this.tiempoInmunidad > 0){
            this.tiempoInmunidad = this.tiempoInmunidad - dt;
            // Control de emisor de partículas
            this._emitter.x =  this.body.p.x;
            this._emitter.y =  this.body.p.y;

            //console.log("Segundos de inmunidad: " + this.tiempoInmunidad);
        }
        if (this.tiempoInmunidad < 0) {
            this.tiempoInmunidad = 0;
            // Cerramos el emisor de partículas
            this._emitter.setEmissionRate(0);

            //console.log("Segundos de inmunidad: " + this.tiempoInmunidad);
        }

    }, moverIzquierda:function() {
        //Solo se mueve si esta en el estado quieto o caminando
        if(this.estado==estadoQuietoCaballero || this.estado==estadoCaminandoCaballero){
            this.estado=estadoCaminandoCaballero;
            this.orientacion=IZQUIERDA;

            if (this.animacion != this.animacionIzquierda){
                this.sprite.stopAllActions();
                this.animacion = this.animacionIzquierda;
                this.sprite.runAction(this.animacion);
            }

            this.body.vy = 0;
            if ( this.body.vx > -100){
                this.body.applyImpulse(cp.v(-100, 0), cp.v(0, 0));
            }
        }

    }, moverDerecha:function() {
        //Solo se mueve si esta en el estado quieto o caminando
        if(this.estado==estadoQuietoCaballero || this.estado==estadoCaminandoCaballero) {
            this.estado=estadoCaminandoCaballero;
            this.orientacion=DERECHA;

            if (this.animacion != this.animacionDerecha) {
                this.sprite.stopAllActions();
                this.animacion = this.animacionDerecha;
                this.sprite.runAction(this.animacion);
            }

            this.body.vy = 0;
            if (this.body.vx < 100) {
                this.body.applyImpulse(cp.v(100, 0), cp.v(0, 0));
            }
        }

    }, moverArriba:function() {
        //Solo se mueve si esta en el estado quieto o caminando
        if(this.estado==estadoQuietoCaballero || this.estado==estadoCaminandoCaballero) {
            this.estado=estadoCaminandoCaballero;
            this.orientacion=ARRIBA;

            if (this.animacion != this.animacionArriba) {
                this.sprite.stopAllActions();
                this.animacion = this.animacionArriba;
                this.sprite.runAction(this.animacion);
            }

            this.body.vx = 0;
            if (this.body.vy < 100) {
                this.body.applyImpulse(cp.v(0, 100), cp.v(0, 0));
            }
        }
    }, moverAbajo:function() {
        //Solo se mueve si esta en el estado quieto o caminando
        if(this.estado==estadoQuietoCaballero || this.estado==estadoCaminandoCaballero) {
            this.estado=estadoCaminandoCaballero;
            this.orientacion=ABAJO;

            if (this.animacion != this.animacionAbajo) {
                this.sprite.stopAllActions();
                this.animacion = this.animacionAbajo;
                this.sprite.runAction(this.animacion);
            }

            this.body.vx = 0;
            if (this.body.vy > -100) {
                this.body.applyImpulse(cp.v(0, -100), cp.v(0, 0));
            }
        }
    }, detener : function() {
        //Solo se detiene si esta en el estado caminando
      if (this.estado==estadoCaminandoCaballero) {
          this.estado=estadoQuietoCaballero;
          this.orientacion=ABAJO;

          this.sprite.stopAllActions();
          this.animacion = this.animacionQuieto;
          this.sprite.runAction(this.animacion);

          this.body.vx = 0;
          this.body.vy = 0;
      }
    }, atacar_espada : function() {
        //Solo ataca si esta en el estado quieto o caminando
        if(this.estado==estadoQuietoCaballero || this.estado==estadoCaminandoCaballero) {
            var estadoAnterior = this.estado;
            this.estado=estadoAtacandoCaballero;

            this.sprite.stopAllActions();
            //Si el jugador se mueve hacia arriba, ataca hacia arriba
            if(this.body.vy > 0){
                this.animacion = this.animacionAtaqueArriba;
            }
            //Si el jugador se mueve hacia la derecha, ataca hacia la derecha
            else if(this.body.vx > 0){
                this.animacion = this.animacionAtaqueDerecha;
            }
            //Si el jugador se mueve hacia la izquierda, ataca hacia la izquierda
            else if(this.body.vx < 0){
                this.animacion = this.animacionAtaqueIzquierda;
            }
            //Si el jugador no se mueve o se mueve hacia abajo, ataca hacia abajo
            else{
                this.animacion = this.animacionAtaqueAbajo;
            }

            var sequencia = cc.sequence(
                this.animacion,
                cc.callFunc(this.atacarFin,this )
            );
            this.sprite.runAction(sequencia);

            cc.audioEngine.playEffect(res.ataque_espada_wav);
        }

    }, atacar_arco : function() {
        //Solo ataca si esta en el estado quieto o caminando
        if(this.estado==estadoQuietoCaballero || this.estado==estadoCaminandoCaballero) {
            this.estado=estadoAtacandoCaballero;
            this.sprite.stopAllActions();

            //Creamos una flecha con un impulso en la orientacion del arquero
            var flecha = new Flecha(this.space,
                cc.p(this.body.p.x, this.body.p.y),
                this.layer, this.orientacion, tipoFlechaJugador);

            switch (this.orientacion){
                case ARRIBA:
                    //Ataca hacia arriba
                    this.animacion = this.animacionAtaqueADistanciaArriba;
                    flecha.body.vy = VELOCIDAD_FLECHA;
                    break;
                case DERECHA:
                    //Ataca hacia la derecha
                    this.animacion = this.animacionAtaqueADistanciaDerecha;
                    flecha.body.vx = VELOCIDAD_FLECHA;
                    break;
                case ABAJO:
                    //Ataca hacia abajo
                    this.animacion = this.animacionAtaqueADistanciaAbajo;
                    flecha.body.vy = -VELOCIDAD_FLECHA;
                    break;
                case IZQUIERDA:
                    //Ataca hacia la izquierda
                    this.animacion = this.animacionAtaqueADistanciaIzquierda;
                    flecha.body.vx = -VELOCIDAD_FLECHA;
                    break;
            }

            this.layer.flechasCaballero.push(flecha);

            //El jugador se deja de mover para atacar con el arco
            this.body.vx=0;
            this.body.vy=0;

            //  Ejecutamos la animacion de atacar
            // (this.animacion contiene ya la animacion de atacar con la orientacion correspondiente)
            var sequencia = cc.sequence(
                this.animacion,
                cc.callFunc(this.atacarFin,this )
            );
            this.sprite.runAction(sequencia);

            cc.audioEngine.playEffect(res.lanzamiento_flecha_piedra_wav);
        }

    }, atacar_piedra : function() {
        //Solo ataca si esta en el estado quieto o caminando
        if(this.estado==estadoQuietoCaballero || this.estado==estadoCaminandoCaballero) {
            this.estado=estadoAtacandoCaballero;
            this.sprite.stopAllActions();

            //Creamos una piedra con un impulso en la orientacion del arquero
            var piedra = new Piedra(this.space,
                cc.p(this.body.p.x, this.body.p.y),
                this.layer, this.orientacion);

            switch (this.orientacion){
                case ARRIBA:
                    //Ataca hacia arriba
                    this.animacion = this.animacionAtaqueADistanciaArriba;
                    piedra.body.vy = VELOCIDAD_PIEDRA;
                    break;
                case DERECHA:
                    //Ataca hacia la derecha
                    this.animacion = this.animacionAtaqueADistanciaDerecha;
                    piedra.body.vx = VELOCIDAD_PIEDRA;
                    break;
                case ABAJO:
                    //Ataca hacia abajo
                    this.animacion = this.animacionAtaqueADistanciaAbajo;
                    piedra.body.vy = -VELOCIDAD_PIEDRA;
                    break;
                case IZQUIERDA:
                    //Ataca hacia la izquierda
                    this.animacion = this.animacionAtaqueADistanciaIzquierda;
                    piedra.body.vx = -VELOCIDAD_PIEDRA;
                    break;
            }

            this.layer.piedrasCaballero.push(piedra);

            //El jugador se deja de mover para atacar con el arco
            this.body.vx=0;
            this.body.vy=0;

            //  Ejecutamos la animacion de atacar
            // (this.animacion contiene ya la animacion de atacar con la orientacion correspondiente)
            var sequencia = cc.sequence(
                this.animacion,
                cc.callFunc(this.atacarFin,this )
            );
            this.sprite.runAction(sequencia);

            cc.audioEngine.playEffect(res.lanzamiento_flecha_piedra_wav);
        }

    }, atacarFin: function(){
        //Cuando termina de atacar le ponemos el estado caminando y lo detenemos
        this.estado=estadoCaminandoCaballero;
        this.detener();

    }, reducirVida: function(){
        //Le quita una vida al jugador
        this.vidas--;

        //Si al quitarle vidas, pasa a tener vidas negativas, no hacemos nada
        if(this.vidas < 0)
            return;

        console.log("Vidas jugador: "+this.vidas);
        cc.audioEngine.playEffect(res.caballero_golpeado_wav);

        //Si despues de quitarle 1 vida, el jugador tiene 0 vidas, se pierde la partida
        if(this.vidas==0){
            //Le colocamos la animacion de morir y reproducimos el sonido
            this.estado = this.estadoMuriendoCaballero;
            this.animacion = this.animacionMuerte;
            this.sprite.stopAllActions();

            var sequencia = cc.sequence(
                this.animacion,
                cc.callFunc(this.morirFin,this )
            );
            this.sprite.runAction(sequencia);

            cc.audioEngine.playEffect(res.caballero_muriendo_wav);

            //Mientras muere no se mueve
            this.body.vx=0;
            this.body.vy=0;
            this.body.setMass(10000);
        }

        //Si sigue con vida, le damos un tiempo de inmunidad
        else
            this.darInmunidad(TIEMPO_INMUNIDAD_CABALLERO);

        this.actualizarCapaVida();

    },morirFin:function(){
        //Mostramos un mensaje de Derrota
        var capaControles = this.layer.getParent().getChildByTag(idCapaControles);
        capaControles.ponerSpriteDerrota();

        //Pausamos la partida
        cc.director.pause();

    }, aumentarVida: function(){
        //Si el numero de vidas que tiene el jugador es menor al maximo
        if(this.vidas<VIDAS_MAXIMO_CABALLERO) {
            //Le aumentamos una vida
            this.vidas++;
            //Actualizamos la capa controles con el nuevo valor de la vida
            this.actualizarCapaVida();
        }

    },actualizarCapaVida: function(){
        //Actualizamos la label con las vidas que tiene ahora el jugador
        var capaControles = this.layer.getParent().getChildByTag(idCapaControles);
        capaControles.cambiaVida(this.vidas);

    },darInmunidad:function (segundos) {
        this.tiempoInmunidad = segundos;
        console.log("Aplicados segundos de inmunidad al jugador: " + segundos);

        // Emisión de partículas
        this._emitter.setEmissionRate(5);

    }

});
