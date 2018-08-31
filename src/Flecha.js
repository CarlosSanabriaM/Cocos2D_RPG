var VELOCIDAD_FLECHA = 400;

var Flecha = cc.Class.extend({
    space:null,
    sprite:null,
    body:null,
    shape:null,
    layer:null,

    ctor:function (space, posicion, layer, orientacion, tipoColision) {
        this.space = space;
        this.layer = layer;

        //Tenemos un fichero plist que referencia a 4 imagenes, una para cada orientacion
        //Le colocamos la que corresponda en funcion de su orientacion
        var str;
        switch (orientacion){
            case ARRIBA:
                str = "flecha_arriba.png";
                break;
            case DERECHA:
                str = "flecha_derecha.png";
                break;
            case ABAJO:
                str = "flecha_abajo.png";
                break;
            case IZQUIERDA:
                str = "flecha_izquierda.png";
                break;
        }

        var imagen = cc.spriteFrameCache.getSpriteFrame(str);
        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(imagen);
        // Cuerpo dinamico
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
        this.shape.setCollisionType(tipoColision);
        // añadir sprite a la capa
        this.layer.addChild(this.sprite,10);

    }, eliminar: function (){
        // quita la forma
        this.space.removeShape(this.shape);

        // quita el cuerpo
        this.space.removeBody(this.shape.getBody());

        // quita el sprite
        this.layer.removeChild(this.sprite);
    }

});
