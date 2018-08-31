
var Corazon = cc.Class.extend({
    layer:null,
    sprite:null,
    shape:null,

    ctor:function (gameLayer, posicion) {
        this.layer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(res.corazon_png);
        // Cuerpo estática, no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);
        this.sprite.setBody(body);
        // Los cuerpos estáticos nunca se añaden al Space
        // forma
        this.shape = new cp.BoxShape(body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);

        this.shape.setCollisionType(tipoCorazon);
        // Nunca genera colisiones reales, es como un “fantasma”
        this.shape.setSensor(true);
        // forma estática
        gameLayer.space.addStaticShape(this.shape);
        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,10);

    }, eliminar: function (){
        // quita la forma
        this.layer.space.removeShape(this.shape);

        // quita el sprite
        this.layer.removeChild(this.sprite);

    }, accion: function(){
        this.layer.caballero.aumentarVida();
        console.log("Corazón recogido");
        cc.audioEngine.playEffect(res.corazon_recogido_wav);

    }

});
