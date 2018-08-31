
var Moneda = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,

    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        // Crear animación
        var framesAnimacion = [];
        for (var i = 1; i <= 6; i++) {
            var str = "moneda" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#moneda1.png");
        // Cuerpo estática, no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);
        this.sprite.setBody(body);
        // Los cuerpos estáticos nunca se añaden al Space
        var radio = this.sprite.getContentSize().width / 2;
        // forma
        this.shape = new cp.CircleShape(body, radio , cp.vzero);
        this.shape.setCollisionType(tipoMoneda);
        // Nunca genera colisiones reales, es como un “fantasma”
        this.shape.setSensor(true);
        // forma estática
        gameLayer.space.addStaticShape(this.shape);
        // ejecutar la animación
        this.sprite.runAction(actionAnimacionBucle);
        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,10);

    }, eliminar: function (){
        // quita la forma
        this.gameLayer.space.removeShape(this.shape);

        // quita el sprite
        this.gameLayer.removeChild(this.sprite);

    }, accion: function(){
        var capaControles = this.gameLayer.getParent().getChildByTag(idCapaControles);
        capaControles.agregarMoneda();
        console.log("Moneda recogida");
        cc.audioEngine.playEffect(res.moneda_recogida_wav);

    }

});
