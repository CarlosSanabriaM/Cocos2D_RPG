var estadoCaminandoRey  = 1;
var estadoMuriendoRey   = 2;
var estadoEliminarRey   = 3;

var VIDAS_INICIALES_REY             = 3;
var TIEMPO_MINIMO_ENTRE_CAMBIOS_REY = 2;
var VELOCIDAD_REY                   = 500;
var TIEMPO_INMUNIDAD_REY            = 0.75;

var Rey = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    animacionDerecha:null,
    animacionIzquierda:null,
    animacionArriba:null,
    animacionAbajo:null,
    animacionMuerte:null,
    animacion:null, // Actual
    tiempoUtimoCambio:0,
    tiempoInmunidad:0,
    vidas:VIDAS_INICIALES_REY,
    estado: estadoCaminandoRey,

    ctor:function (posicion, layer) {
        this.space = layer.space;
        this.layer = layer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#rey_abajo_1.png");
        // Cuerpo dinamico, SI le afectan las fuerzas
        this.body = new cp.Body(7, Infinity);

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
        this.shape.setCollisionType(tipoEnemigo);

        // forma dinamica
        this.space.addShape(this.shape);

        // Crear animación - derecha
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "rey_derecha_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.4);
        this.animacionDerecha =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - izquierda
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "rey_izquierda_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.4);
        this.animacionIzquierda =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - arriba
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "rey_arriba_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.4);
        this.animacionArriba =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - abajo
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "rey_abajo_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.4);
        this.animacionAbajo =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - muerte
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "rey_muerte_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 1);
        this.animacionMuerte = new cc.Animate(animacion);


        // ejecutar la animación
        this.sprite.runAction(this.animacionAbajo);
        this.animacion = this.animacionAbajo;
        layer.addChild(this.sprite,10);

    }, update:function (dt) {
        //dt --> Segundos que han pasado desde la ultima ejecucion

        // aumentar el tiempo que ha pasado desde el ultimo cambio de direccion
        this.tiempoUtimoCambio = this.tiempoUtimoCambio + dt;

        //Cambia de direccion si ha pasado el tiempo minimo entre saltos mas una cierta aleatoriedad
        var tiempoEntreCambios = TIEMPO_MINIMO_ENTRE_CAMBIOS_REY + Math.floor(Math.random() * TIEMPO_MINIMO_ENTRE_CAMBIOS_REY);

        if(this.tiempoUtimoCambio > tiempoEntreCambios){
            //Generamos una direccion al azar en la que se va a mover
            var direccion = new Utilidades().dameOrientacionAlAzar();

            switch (direccion){
                case ARRIBA:
                    this.moverArriba();
                    break;
                case DERECHA:
                    this.moverDerecha();
                    break;
                case ABAJO:
                    this.moverAbajo();
                    break;
                case IZQUIERDA:
                    this.moverIzquierda();
                    break;
            }

            this.tiempoUtimoCambio = 0;
        }

        // Reducir la inmunidad del rey cuando corresponda
        if (this.tiempoInmunidad > 0){
            this.tiempoInmunidad = this.tiempoInmunidad - dt;
        }
        if (this.tiempoInmunidad < 0) {
            this.tiempoInmunidad = 0;
        }

    }, eliminar: function (){
        // quita la forma
        this.layer.space.removeShape(this.shape);

        // quita el cuerpo
        this.layer.space.removeBody(this.shape.getBody());

        // quita el sprite
        this.layer.removeChild(this.sprite);

    }, moverIzquierda:function() {
        //Solo se mueve si esta en el estado caminando
        if(this.estado==estadoCaminandoRey) {

            if (this.animacion != this.animacionIzquierda){
                this.sprite.stopAllActions();
                this.animacion = this.animacionIzquierda;
                this.sprite.runAction(this.animacion);
            }

            this.body.vy = 0;
            if ( this.body.vx > -VELOCIDAD_REY){
                this.body.applyImpulse(cp.v(-VELOCIDAD_REY, 0), cp.v(0, 0));
            }
        }

    }, moverDerecha:function() {
        //Solo se mueve si esta en el estado caminando
        if(this.estado==estadoCaminandoRey) {

            if (this.animacion != this.animacionDerecha) {
                this.sprite.stopAllActions();
                this.animacion = this.animacionDerecha;
                this.sprite.runAction(this.animacion);
            }

            this.body.vy = 0;
            if (this.body.vx < VELOCIDAD_REY) {
                this.body.applyImpulse(cp.v(VELOCIDAD_REY, 0), cp.v(0, 0));
            }
        }

    }, moverArriba:function() {
        //Solo se mueve si esta en el estado caminando
        if(this.estado==estadoCaminandoRey) {

            if (this.animacion != this.animacionArriba) {
                this.sprite.stopAllActions();
                this.animacion = this.animacionArriba;
                this.sprite.runAction(this.animacion);
            }

            this.body.vx = 0;
            if (this.body.vy < VELOCIDAD_REY) {
                this.body.applyImpulse(cp.v(0, VELOCIDAD_REY), cp.v(0, 0));
            }
        }
    }, moverAbajo:function() {
        //Solo se mueve si esta en el estado caminando
        if(this.estado==estadoCaminandoRey) {

            if (this.animacion != this.animacionAbajo) {
                this.sprite.stopAllActions();
                this.animacion = this.animacionAbajo;
                this.sprite.runAction(this.animacion);
            }

            this.body.vx = 0;
            if (this.body.vy > -VELOCIDAD_REY) {
                this.body.applyImpulse(cp.v(0, -VELOCIDAD_REY), cp.v(0, 0));
            }
        }

    }, reducirVida: function(){
        //Si esta en tiempo de inmunidad no se le quita vida
        if(this.tiempoInmunidad > 0)
            return;

        //Le quita una vida
        this.vidas--;
        console.log("Vidas del rey: " + this.vidas);
        //Si despues de quitarle 1 vida, tiene 0 vidas
        if(this.vidas==0){
            //Le ponemos en estadoMuriendo y le ponemos la animacion de morir
            //Cuando termine la animacion de morir, será eliminado
            this.estado = estadoMuriendoRey;
            this.sprite.stopAllActions();

            var sequencia = cc.sequence(
                this.animacionMuerte,
                cc.callFunc(this.morirFin,this )
            );
            this.sprite.runAction(sequencia);

            cc.audioEngine.playEffect(res.enemigo_muriendo_wav);

            //Mientras muere no se mueve
            this.body.vx=0;
            this.body.vy=0;
            this.body.setMass(10000);
        }

        //Si sigue con vida, le damos un tiempo de inmunidad
        else
            this.tiempoInmunidad=TIEMPO_INMUNIDAD_REY;

    }, morirFin: function(){
        //pasa al estado eliminar
        this.estado = estadoEliminarRey;
    }


});
