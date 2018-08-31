var TIEMPO_PUERTA_ABIERTA_CON_PALANCA = 5;

var Palanca = cc.Class.extend({
    layer:null,
    shape:null,
    puertaAbiertaConPalanca:false,
    tiempoPuertaAbierta:0,

    ctor:function (posicion, layer, ancho, alto) {
        this.layer = layer;

        //NO TIENE SPRITE

        // Cuerpo estática, no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);
        // Los cuerpos estáticos nunca se añaden al Space
        // forma
        this.shape = new cp.BoxShape(body, ancho, alto);

        this.shape.setCollisionType(tipoPalancaPuerta);
        // Nunca genera colisiones reales, es como un “fantasma”
        this.shape.setSensor(true);
        // forma estática
        this.layer.space.addStaticShape(this.shape);

    },abrirPuerta: function(){
        this.puertaAbiertaConPalanca = true;
        this.tiempoPuertaAbierta = 0;

        if( !this.layer.puerta.abierta )
            this.layer.puerta.abrir();

    }, update:function (dt) {
        //dt --> Segundos que han pasado desde la ultima ejecucion

        //Si la puerta ha sido abierta con la palanca
        if(this.puertaAbiertaConPalanca){
            //Aumentamos el tiempo que ha estado abierta
            this.tiempoPuertaAbierta = this.tiempoPuertaAbierta + dt;

            //Si han pasado 5 segundos desde que se abrio
            if (this.tiempoPuertaAbierta > TIEMPO_PUERTA_ABIERTA_CON_PALANCA) {
                //Solo podemos cerrar la puerta si ambas baldosas NO estan activas
                if( !(this.layer.baldosaMaderaActiva && this.layer.baldosaMetalActiva) )
                    this.layer.puerta.cerrar();

                this.puertaAbiertaConPalanca = false;
            }
        }

    }

});
