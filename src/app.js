
var MenuLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        var size = cc.winSize;

        // Fondo
        var spriteFondoTitulo= new cc.Sprite(res.menu_titulo_png);
        // Asigno posición central
        spriteFondoTitulo.setPosition(cc.p(size.width / 2, size.height / 2));
        // Lo escalo porque es más pequeño que la pantalla
        spriteFondoTitulo.setScale(size.height / spriteFondoTitulo.height);
        // Añado Sprite a la capa
        this.addChild(spriteFondoTitulo);

        //MenuItemSprite para cada botón
        var menuBotonJugar = new cc.MenuItemSprite(
            new cc.Sprite(res.boton_jugar_png), // IMG estado normal
            new cc.Sprite(res.boton_jugar_png), // IMG estado pulsado
            this.pulsarBotonJugar, this);


        // creo el menú pasándole los botones
        var menu = new cc.Menu(menuBotonJugar);
        // Asigno posición central
        menu.setPosition(cc.p(size.width / 2, size.height * 0.25));
        // Añado el menú a la capa
        this.addChild(menu);


        return true;
    }, pulsarBotonJugar : function(){
        cc.director.runScene(new GameScene());
    }
});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);
    }
});

