var estadoNormalPiedra   = 1;
var estadoEliminarPiedra = 2;

var VELOCIDAD_PIEDRA     = 500;
var MAX_REBOTES_PIEDRA   = 4;

var Piedra = cc.Class.extend({
    space:null,
    sprite:null,
    body:null,
    shape:null,
    layer:null,
    direccion:null,
    numRebotes:0,
    estado:estadoNormalPiedra,

ctor:function (space, posicion, layer, direccion) {
    this.space = space;
    this.layer = layer;

    //La direccion inicial hacia la que se mueve la piedra
    this.direccion = direccion;

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite(res.piedra_png);
    // Cuerpo estática , no le afectan las fuerzas
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
    // agregar forma dinamica
    this.shape.setSensor(true);
    this.space.addShape(this.shape);
    this.shape.setCollisionType(tipoPiedraJugador);
    // añadir sprite a la capa
    this.layer.addChild(this.sprite,10);


   }, eliminar: function (){
        // quita la forma
        this.space.removeShape(this.shape);

        // quita el cuerpo
        this.space.removeBody(this.shape.getBody());

        // quita el sprite
        this.layer.removeChild(this.sprite);

    },rebotar: function(){
        //Incrementamos el numero de rebotes de la piedra
        this.numRebotes++;

        //Invertimos su direccion
        this.invertirDireccion();

        //Si ha superado al numero maximo de rebotes, la marcamos para eliminar
        if(this.numRebotes > MAX_REBOTES_PIEDRA)
            this.estado = estadoEliminarPiedra;

        cc.audioEngine.playEffect(res.rebote_piedra_wav);

    }, invertirDireccion: function(){
        //Le ponemos una velocidad en la direccion contraria a la direccion anterior
        switch (this.direccion){
            case ARRIBA:
                //Ahora pasa a moverse hacia abajo
                this.body.vy = -VELOCIDAD_PIEDRA;
                this.direccion = ABAJO;
                break;
            case DERECHA:
                //Ahora pasa a moverse hacia la izquierda
                this.body.vx = -VELOCIDAD_PIEDRA;
                this.direccion = IZQUIERDA;
                break;
            case ABAJO:
                //Ahora pasa a moverse hacia arriba
                this.body.vy = VELOCIDAD_PIEDRA;
                this.direccion = ARRIBA;
                break;
            case IZQUIERDA:
                //Ahora pasa a moverse hacia la derecha
                this.body.vx = VELOCIDAD_PIEDRA;
                this.direccion = DERECHA;
                break;
        }

    }

});