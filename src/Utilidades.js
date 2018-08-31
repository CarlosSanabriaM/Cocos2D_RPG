var ARRIBA      = 1;
var DERECHA     = 2;
var ABAJO       = 3;
var IZQUIERDA   = 4;

var MONEDA      = 5;
var CORAZON     = 6;
var INMUNIDAD   = 7;
var NINGUNO     = 8;

var Utilidades = cc.Class.extend({

    ctor:function () {

    },dameOrientacionAlAzar: function(){
        //Generamos un numero al azar entre 1 y 4
        var numAzar =  1 + parseInt( Math.round(Math.random() * 3) );
        return numAzar;

    },damePowerUpAlAzar: function(){
        /*
            La importancia de los powerups es la siguiente:
            1.Inmunidad - Probabilidad = 10%
            2.Corazon   - Probabilidad = 15%
            3.Moneda     - Probabilidad = 25%

            Ninguno     - Probabilidad = 50%
         */

        //Generamos un numero al azar entre 0.01 y 1
        var numAzar = Math.random() + 0.01;
        //Solo nos interesan los 2 primeros decimales, así que quitamos todos los demas (sin redondear)
        numAzar = parseFloat( numAzar.toFixed(2) );//to Fixed devuelve un String representando un float con 2 decimales

        console.log("Valor powerup azar: " + numAzar);

        if (numAzar >= .01 && numAzar <= .50){//50%
            console.log("Ninguno");
            return NINGUNO;
        }else if (numAzar >= .51 && numAzar <= .75){//25%
            console.log("Moneda");
            return MONEDA;
        }else if (numAzar >= .76 && numAzar <= .90){//15%
            console.log("Corazon");
            return  CORAZON;
        }//else if (numAzar >= .91 && numAzar <= 1)
        else{
            console.log("Inmunidad");
            return INMUNIDAD;
        }

    }

});
