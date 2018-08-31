
var Puerta = cc.Class.extend({
    sprite:null,
    shape:null,
    layer:null,
    abierta:false,

    ctor:function (posicion, layer) {
        this.layer = layer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(res.puerta_cerrada_png);
        // Cuerpo estática, no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);
        this.sprite.setBody(body);
        // Los cuerpos estáticos nunca se añaden al Space
        // forma
        this.shape = new cp.BoxShape(body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);

        this.shape.setCollisionType(tipoLimite);
        // forma estática
        this.layer.space.addStaticShape(this.shape);
        // añadir sprite a la capa
        this.layer.addChild(this.sprite,10);

    }, abrir: function(){
        console.log("Puerta abierta");
        this.abierta = true;

        //Desactivamos las colisiones con la puerta
        this.shape.setSensor(true);

        //Cambiamos el sprite por el de la puerta abierta
        this.sprite.setTexture(res.puerta_abierta_png);

        cc.audioEngine.playEffect(res.puerta_wav);

    }, cerrar: function(){
        console.log("Puerta cerrada");
        this.abierta = false;

        //Activamos las colisiones con la puerta
        this.shape.setSensor(false);

        //Cambiamos el sprite por el de la puerta cerrada
        this.sprite.setTexture(res.puerta_cerrada_png);

        cc.audioEngine.playEffect(res.puerta_wav);

    }


});