var RANGO_MINIMO_VELOCIDAD_CAJA     = 10;
var VALOR_REDUCCION_VELOCIDAD_CAJA  = 5;

var Caja = cc.Class.extend({
    layer:null,
    sprite:null,
    shape:null,
    space:null,
    body:null,

    ctor:function (posicion, layer, tipo) {
        this.space = layer.space;
        this.layer = layer;

        var sprite;
        var tipoColision;
        var masa;
        if(tipo == "madera"){
            sprite = res.caja_madera_png;
            tipoColision = tipoCajaMadera;
            //masa = 10;
            masa = 10;
        }
        else{// if(tipo == "metal"){
            sprite = res.caja_metal_png;
            tipoColision = tipoCajaMetal;
            //masa = 15;
            masa = 15;
        }

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(sprite);
        // Cuerpo dinamico, SI le afectan las fuerzas
        this.body = new cp.Body(masa, Infinity);

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
        this.shape.setCollisionType(tipoColision);

        // forma dinamica
        this.space.addShape(this.shape);

        // añadir sprite a la capa
        layer.addChild(this.sprite,10);

    }, update:function (dt) {
        //dt --> Segundos que han pasado desde la ultima ejecucion

        if(this.body.vx > 0){
            //Si esta dentro del rango minimo, pasa a ser 0 en dicho eje
            if(this.body.vx < RANGO_MINIMO_VELOCIDAD_CAJA)
                this.body.vx = 0;

            //Si no, le reducimos la velocidad en dicho eje
            else
                this.body.vx -= VALOR_REDUCCION_VELOCIDAD_CAJA;
        }

        if(this.body.vx < 0){
            //Si esta dentro del rango minimo, pasa a ser 0 en dicho eje
            if(this.body.vx > -RANGO_MINIMO_VELOCIDAD_CAJA)
                this.body.vx = 0;

            //Si no, le reducimos la velocidad en dicho eje
            else
                this.body.vx += VALOR_REDUCCION_VELOCIDAD_CAJA;
        }

        if(this.body.vy > 0){
            //Si esta dentro del rango minimo, pasa a ser 0 en dicho eje
            if(this.body.vy < RANGO_MINIMO_VELOCIDAD_CAJA)
                this.body.vy = 0;

            //Si no, le reducimos la velocidad en dicho eje
            else
                this.body.vy -= VALOR_REDUCCION_VELOCIDAD_CAJA;
        }

        if(this.body.vy < 0){
            //Si esta dentro del rango minimo, pasa a ser 0 en dicho eje
            if(this.body.vy > -RANGO_MINIMO_VELOCIDAD_CAJA)
                this.body.vy = 0;

            //Si no, le reducimos la velocidad en dicho eje
            else
                this.body.vy += VALOR_REDUCCION_VELOCIDAD_CAJA;
        }


    }

});
