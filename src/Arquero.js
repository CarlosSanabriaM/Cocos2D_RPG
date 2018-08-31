var estadoCaminandoArquero  = 1;
var estadoAtacandoArquero   = 2;
var estadoMuriendoArquero   = 3;
var estadoEliminarArquero   = 4;

var VIDAS_INICIALES_ARQUERO             = 2;
var TIEMPO_MINIMO_ENTRE_CAMBIOS_ARQUERO = 3;
var TIEMPO_MINIMO_ENTRE_ATAQUES_ARQUERO = 4;
var VELOCIDAD_ARQUERO                   = 350;
var TIEMPO_INMUNIDAD_ARQUERO            = 0.75;

var Arquero = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    animacionDerecha:null,
    animacionIzquierda:null,
    animacionArriba:null,
    animacionAbajo:null,
    animacionAtaqueArriba:null,
    animacionAtaqueDerecha:null,
    animacionAtaqueAbajo:null,
    animacionAtaqueIzquierda:null,
    animacionMuerte:null,
    animacion:null, // Actual
    tiempoUtimoCambio:0,
    tiempoUtimoAtaque:0,
    tiempoInmunidad:0,
    vidas:VIDAS_INICIALES_ARQUERO,
    orientacion: null,
    estado: estadoCaminandoArquero,

    ctor:function (posicion, layer) {
        this.space = layer.space;
        this.layer = layer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#arquero_abajo_1.png");
        // Cuerpo dinamico, SI le afectan las fuerzas
        this.body = new cp.Body(6, Infinity);

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
            var str = "arquero_derecha_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.4);
        this.animacionDerecha =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - izquierda
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "arquero_izquierda_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.4);
        this.animacionIzquierda =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - arriba
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "arquero_arriba_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.4);
        this.animacionArriba =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - abajo
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "arquero_abajo_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.4);
        this.animacionAbajo =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - atacar arriba
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "arquero_ataque_arriba_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionAtaqueArriba = new cc.Repeat(new cc.Animate(animacion),1);

        // Crear animación - atacar derecha
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "arquero_ataque_derecha_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionAtaqueDerecha = new cc.Repeat(new cc.Animate(animacion),1);

        // Crear animación - atacar abajo
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "arquero_ataque_abajo_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionAtaqueAbajo = new cc.Repeat(new cc.Animate(animacion),1);

        // Crear animación - atacar izquierda
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "arquero_ataque_izquierda_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionAtaqueIzquierda = new cc.Repeat(new cc.Animate(animacion),1);

        // Crear animación - muerte
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "arquero_muerte_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 1);
        this.animacionMuerte = new cc.Repeat(new cc.Animate(animacion),1);

        // ejecutar la animación
        this.sprite.runAction(this.animacionAbajo);
        this.animacion = this.animacionAbajo;

        this.orientacion = ABAJO;

        layer.addChild(this.sprite,10);

    }, update:function (dt) {
        //dt --> Segundos que han pasado desde la ultima ejecucion

        // aumentar el tiempo que ha pasado desde el ultimo cambio de direccion
        this.tiempoUtimoCambio = this.tiempoUtimoCambio + dt;

        // aumentar el tiempo que ha pasado desde el ultimo ataque
        this.tiempoUtimoAtaque = this.tiempoUtimoAtaque + dt;

        //Cambia de direccion si ha pasado el tiempo minimo entre saltos mas una cierta aleatoriedad
        var tiempoEntreCambios = TIEMPO_MINIMO_ENTRE_CAMBIOS_ARQUERO + Math.floor(Math.random() * TIEMPO_MINIMO_ENTRE_CAMBIOS_ARQUERO);

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

        //Ataca si ha pasado el tiempo minimo entre ataques mas una cierta aleatoriedad
        var tiempoEntreAtaques = TIEMPO_MINIMO_ENTRE_ATAQUES_ARQUERO + Math.floor(Math.random() * TIEMPO_MINIMO_ENTRE_ATAQUES_ARQUERO);

        if(this.tiempoUtimoAtaque > tiempoEntreAtaques){
            this.atacar();
            this.tiempoUtimoAtaque = 0;
        }

        // Reducir la inmunidad del arquero cuando corresponda
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
        if(this.estado==estadoCaminandoArquero) {
            this.orientacion=IZQUIERDA;

            if (this.animacion != this.animacionIzquierda){
                this.sprite.stopAllActions();
                this.animacion = this.animacionIzquierda;
                this.sprite.runAction(this.animacion);
            }

            this.body.vy = 0;
            if ( this.body.vx > -VELOCIDAD_ARQUERO){
                this.body.applyImpulse(cp.v(-VELOCIDAD_ARQUERO, 0), cp.v(0, 0));
            }
        }

    }, moverDerecha:function() {
        //Solo se mueve si esta en el estado caminando
        if(this.estado==estadoCaminandoArquero) {
            this.orientacion=DERECHA;

            if (this.animacion != this.animacionDerecha) {
                this.sprite.stopAllActions();
                this.animacion = this.animacionDerecha;
                this.sprite.runAction(this.animacion);
            }

            this.body.vy = 0;
            if (this.body.vx < VELOCIDAD_ARQUERO) {
                this.body.applyImpulse(cp.v(VELOCIDAD_ARQUERO, 0), cp.v(0, 0));
            }
        }

    }, moverArriba:function() {
        //Solo se mueve si esta en el estado caminando
        if(this.estado==estadoCaminandoArquero) {
            this.orientacion=ARRIBA;

            if (this.animacion != this.animacionArriba) {
                this.sprite.stopAllActions();
                this.animacion = this.animacionArriba;
                this.sprite.runAction(this.animacion);
            }

            this.body.vx = 0;
            if (this.body.vy < VELOCIDAD_ARQUERO) {
                this.body.applyImpulse(cp.v(0, VELOCIDAD_ARQUERO), cp.v(0, 0));
            }
        }
    }, moverAbajo:function() {
        //Solo se mueve si esta en el estado caminando
        if(this.estado==estadoCaminandoArquero) {
            this.orientacion=ABAJO;

            if (this.animacion != this.animacionAbajo) {
                this.sprite.stopAllActions();
                this.animacion = this.animacionAbajo;
                this.sprite.runAction(this.animacion);
            }

            this.body.vx = 0;
            if (this.body.vy > -VELOCIDAD_ARQUERO) {
                this.body.applyImpulse(cp.v(0, -VELOCIDAD_ARQUERO), cp.v(0, 0));
            }
        }

    }, reducirVida: function(){
        //Si esta en tiempo de inmunidad no se le quita vida
        if(this.tiempoInmunidad > 0)
            return;

        //Le quita una vida
        this.vidas--;
        console.log("Vidas del arquero: " + this.vidas);
        //Si despues de quitarle 1 vida, tiene 0 vidas
        if(this.vidas==0){
            //Le ponemos en estadoMuriendo y le ponemos la animacion de morir
            //Cuando termine la animacion de morir, será eliminado
            this.estado = estadoMuriendoArquero;
            this.sprite.stopAllActions();

            this.animacion = this.animacionMuerte;
            var sequencia = cc.sequence(
                this.animacion,
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
            this.tiempoInmunidad=TIEMPO_INMUNIDAD_ARQUERO;

    }, atacar: function(){
        //Si esta muriendo o listo para eliminar no ataca
        if(this.estado==estadoMuriendoArquero || this.estado==estadoEliminarArquero)
            return;

        this.estado = estadoAtacandoArquero;
        this.sprite.stopAllActions();

        //Creamos una flecha con un impulso en la orientacion del arquero
        var flecha = new Flecha(this.space,
            cc.p(this.body.p.x, this.body.p.y),
            this.layer, this.orientacion, tipoFlechaEnemigo);

        switch (this.orientacion){
            case ARRIBA:
                //Ataca hacia arriba
                this.animacion = this.animacionAtaqueArriba;
                flecha.body.vy = VELOCIDAD_FLECHA;
                break;
            case DERECHA:
                //Ataca hacia la derecha
                this.animacion = this.animacionAtaqueDerecha;
                flecha.body.vx = VELOCIDAD_FLECHA;
                break;
            case ABAJO:
                //Ataca hacia abajo
                this.animacion = this.animacionAtaqueAbajo;
                flecha.body.vy = -VELOCIDAD_FLECHA;
                break;
            case IZQUIERDA:
                //Ataca hacia la izquierda
                this.animacion = this.animacionAtaqueIzquierda;
                flecha.body.vx = -VELOCIDAD_FLECHA;
                break;
        }

        this.layer.flechasEnemigos.push(flecha);

        //  Ejecutamos la animacion de atacar
        // (this.animacion contiene ya la animacion de atacar con la orientacion correspondiente)
        var sequencia = cc.sequence(
            this.animacion,
            cc.callFunc(this.atacarFin,this )
        );
        this.sprite.runAction(sequencia);

        cc.audioEngine.playEffect(res.lanzamiento_flecha_piedra_wav);

    }, atacarFin: function(){
        this.estado = estadoCaminandoArquero;
        this.sprite.stopAllActions();

        switch (this.orientacion){
            case ARRIBA:
                //Camina hacia arriba
                this.animacion = this.animacionArriba;
                break;
            case DERECHA:
                //Camina hacia la derecha
                this.animacion = this.animacionDerecha;
                break;
            case ABAJO:
                //Camina hacia abajo
                this.animacion = this.animacionAbajo;
                break;
            case IZQUIERDA:
                //Camina hacia la izquierda
                this.animacion = this.animacionIzquierda;
                break;
        }

        this.sprite.runAction(this.animacion);

    }, morirFin: function(){
        //pasa al estado eliminar
        this.estado = estadoEliminarArquero;

    }


});
