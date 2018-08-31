
var Inmunidad = cc.Class.extend({
    layer:null,
    sprite:null,
    shape:null,

    ctor:function (layer, posicion) {
        this.layer = layer;

        // Crear animación
        var framesAnimacion = [];
        for (var i = 0; i <= 1; i++) {
            var str = "inmunidad_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.5);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#inmunidad_0.png");
        // Cuerpo estática, no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);
        this.sprite.setBody(body);
        // Los cuerpos estáticos nunca se añaden al Space
        // forma
        this.shape = new cp.BoxShape(body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);

        this.shape.setCollisionType(tipoInmunidad);
        // Nunca genera colisiones reales, es como un “fantasma”
        this.shape.setSensor(true);
        // forma estática
        layer.space.addStaticShape(this.shape);
        // ejecutar la animación
        this.sprite.runAction(actionAnimacionBucle);
        // añadir sprite a la capa
        layer.addChild(this.sprite,10);

    }, eliminar: function (){
        // quita la forma
        this.layer.space.removeShape(this.shape);

        // quita el sprite
        this.layer.removeChild(this.sprite);

    }, accion: function(){
        //Confiere al jugador 5 segundos de inmunidad
        this.layer.caballero.darInmunidad(5);
        console.log("Inmunidad recogida");
        cc.audioEngine.playEffect(res.inmunidad_recogido_wav);

    }

});
