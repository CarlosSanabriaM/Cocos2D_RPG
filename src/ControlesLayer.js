
var ControlesLayer = cc.Layer.extend({
    etiquetaMonedas:null,
    monedas:0,
    etiquetaVidas:null,
    size:null,

    ctor:function () {
        this._super();
        this.size = cc.winSize;

        // Contador Monedas
        this.etiquetaMonedas = new cc.LabelTTF("Monedas: 0", "Helvetica", 22);
        this.etiquetaMonedas.setPosition(cc.p(this.size.width - 90, this.size.height - 20));
        this.etiquetaMonedas.fillStyle = new cc.Color(255, 255, 255, 0);
        this.addChild(this.etiquetaMonedas);

        var sprite_moneda = cc.Sprite.create(res.hud_moneda_png);
        sprite_moneda.setPosition(cc.p(this.size.width - 160, this.size.height - 19));
        this.addChild(sprite_moneda,100);

        // Contador Vidas
        this.etiquetaVidas = new cc.LabelTTF("Vidas: ", "Helvetica", 22);
        this.etiquetaVidas.setPosition(cc.p(75, this.size.height - 20));
        this.etiquetaVidas.fillStyle = new cc.Color(255, 255, 255, 0);
        this.addChild(this.etiquetaVidas);

        var sprite_corazon = cc.Sprite.create(res.hud_corazon_png);
        sprite_corazon.setPosition(cc.p(20,this.size.height - 19));
        this.addChild(sprite_corazon,100);

        this.scheduleUpdate();
        return true;

    },update:function (dt) {

    },agregarMoneda:function(){
        this.monedas++;
        this.etiquetaMonedas.setString("Monedas: " + this.monedas);

    },cambiaVida:function(vidas){
        this.etiquetaVidas.setString("Vidas: " + vidas);

    },ponerSpriteDerrota:function(){
        var sprite_derrota = new cc.Sprite(res.derrota_png);
        sprite_derrota.setPosition(cc.p(this.size.width/2, this.size.height/2));
        this.addChild(sprite_derrota,20);

    },ponerSpriteVictoria:function(){
        var sprite_victoria = new cc.Sprite(res.victoria_png);
        sprite_victoria.setPosition(cc.p(this.size.width/2, this.size.height/2));
        this.addChild(sprite_victoria,20);
    }

});
