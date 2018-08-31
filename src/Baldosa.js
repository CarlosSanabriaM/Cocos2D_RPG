var Baldosa = cc.Class.extend({
    layer:null,
    shape:null,

    ctor:function (posicion, layer, ancho, alto, tipo) {
        this.layer = layer;

        //NO TIENE SPRITE

        var tipoColision;
        if(tipo=="madera")
            tipoColision = tipoBaldosaMadera;
        else
            tipoColision = tipoBaldosaMetal;

        // Cuerpo estática, no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);
        // Los cuerpos estáticos nunca se añaden al Space
        // forma
        this.shape = new cp.BoxShape(body, ancho, alto);

        this.shape.setCollisionType(tipoColision);
        // Nunca genera colisiones reales, es como un “fantasma”
        this.shape.setSensor(true);
        // forma estática
        this.layer.space.addStaticShape(this.shape);

    }

});
