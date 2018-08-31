
var Meta = cc.Class.extend({
    layer:null,
    sprite:null,
    shape:null,

    ctor:function (gameLayer, posicion) {
        this.layer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(res.meta_png);
        // Cuerpo estática, no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);
        this.sprite.setBody(body);
        // Los cuerpos estáticos nunca se añaden al Space
        // forma
        this.shape = new cp.BoxShape(body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);

        this.shape.setCollisionType(tipoMeta);
        // Nunca genera colisiones reales, es como un “fantasma”
        this.shape.setSensor(true);
        // forma estática
        gameLayer.space.addStaticShape(this.shape);

        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,10);

    }, accion: function(){
        console.log("Meta recogida");
        cc.audioEngine.playEffect(res.recogiendo_meta_wav);

        //Mostramos un mensaje de Victoria
        var capaControles = this.layer.getParent().getChildByTag(idCapaControles);
        capaControles.ponerSpriteVictoria();

        //Cuando el jugador gana, pausamos la partida
        cc.director.pause();
    }

});
