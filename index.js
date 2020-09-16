const Discord = require("discord.js");
const client = new Discord.Client();
//configuracion archivo: config
const config = require("./config.json");

client.on ("ready", () => {
  console.log("¡Ya estoy listo para almacenar vuestro Oro!");
});

// creacion de la matriz almacenar
var almacen = new Array (config.alto);
for (var i=0 ; i<config.alto; i++){
  almacen[i] = new Array (config.ancho);
}

//creacion de una matriz para albergar los administradores
var admin = new Array (10);
for (var i = 0 ; i<admin.length ; i++){
  admin[i] = "0";
}
admin[0] = config.IdOwner;
admin[1] = config.IdChusti;
admin[2] = config.IdFaldo;
admin[3] = config.IdFranki;
admin[4] = config.IdYomo;


//creacion matriz dinero total de guild
var guild = new Array (2);
guild[0] = parseInt(0,10);
guild [1] = new Array (config.items);
for (var i = 0; i<config.items ; i++){
  guild[1][i] = parseInt(0,10);
}

//formateo de numeros para impresion
var formatNumber = {
 separador: ".", // separador para los miles
 sepDecimal: ',', // separador para los decimales
 formatear:function (num){
 num +='';
 var splitStr = num.split('.');
 var splitLeft = splitStr[0];
 var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
 var regx = /(\d+)(\d{3})/;
 while (regx.test(splitLeft)) {
 splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
 }
 return this.simbol + splitLeft +splitRight;
 },
 new:function(num, simbol){
 this.simbol = simbol ||'';
 return this.formatear(num);
 }
}

// funcion para calculo de tier por persona
function tier (number){
  if (number < 130000000){
    return 1;
  }
  if (number >= 130000000 && number < 195000000){
    return 2;
  }
  if (number >= 195000000 && number < 260000000){
    return 3;
  }
  if (number >= 260000000 && number < 325000000){
    return 4;
  }
  if (number >= 325000000 && number < 390000000){
    return 5;
  }
  if (number >= 390000000 && number < 455000000){
    return 6;
  }
  if (number >= 455000000 && number < 520000000){
    return 7;
  }
  if (number >= 520000000 && number < 585000000){
    return 8;
  }
  if (number >= 585000000 && number < 650000000){
    return 9;
  }
  if (number >= 650000000){
    return 10;
  }
}

//funcion verificar si es administrador
function check (id){
  var verificar = -1;
  for (var i = 0; i<admin.length && verificar == -1; i++){
    if (id == admin[i]){
      verificar = 0;
    }
  }
  return verificar;
}

// lista dinero de los Items
{
var itm0 = 100000000;
var itm1 = 409200;
var itm2 = 100000;
var itm3 = 82000;
var itm4 = 53700;
var itm5 = 52400;
var itm6 = 42800;
}

//array de almacenamiento de precio de objetos
{
var precios = new Array (config.items);
precios[0] = parseInt(itm0 , 10);
precios[1] = parseInt(itm1 , 10);
precios[2] = parseInt(itm2 , 10);
precios[3] = parseInt(itm3 , 10);
precios[4] = parseInt(itm4 , 10);
precios[5] = parseInt(itm5 , 10);
precios[6] = parseInt(itm6 , 10);
}


client.on("message", async message => {
  //evitamos que el bot pueda hacer loops
  if(message.author.bot) return;
  //ignoramos los mensajes que no usen el prefijo
  if(message.content.indexOf(config.prefix) !== 0) return;
  //separacion de argumentos command
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  //inicializacion de emojis



    //Comando para hablar con la consola (hola)
      if (command === 'hola'){
        message.channel.sendMessage('¡Hola pirata! ¿Qué puedo hacer por ti?');
      }

    // comando para sacar la lista de comandos
      if (command === 'help'){
        message.author.send({embed: {
          color: 0xff8000,
          description: "<:registro:590562326785294336> LISTA DE COMANDOS PARA UTILIZAR EL BOT <:registro:590562326785294336>"
                      +"\nPrimera ayuda inización"
                      +"\nEL bot esta conformado por tres almacenes para guardar tu dinero:"
                      +"\nAlmacen pre-aceptado: guarda las fichas y el dinero que has metido cuando has salido de caza y lo deja a la espera de que un admin lo meta en tu almacen de dinero real"
                      +"\nAlmacen caza multiple: guarda las fichas y el dinero de una caza en grupo y la deja a la espera de ser aceptada por un admin"
                      +"\nAlmacen dinero real: donde se guarda el dinero que despues va a contar en tu tier y tiene que ser aceptado por un admin"
                      +"\n\nLISTA CON LOS COMANDOS:"
                      +"\n\n?register: te registra automaticamente en una casilla con el hueco libre"
                      +"\n\n?add: añade dinero a tu arca de dinero pre-aceptado tienes que introducir los items de la siguiente manera:"
                      +"\n      [item 1M] [item 409k] [item 100k] [item 82k] [item 53k] [item 52K] [item 42k]"
                      +"\n\n?fakecash: te muestra el dinero que tienes en tu arca preaceptada"
                      +"\n\n?addmul: añade dinero a tu arca de dinero grupal cuando cazas entre varios"
                      +"\n      [item 1M] [item 409k] [item 100k] [item 82k] [item 53k] [item 52K] [item 42k]"
                      +"\n\n?fakemul: te muestra el dinero que tiene en tu arca de grupo"
                      +"\n\n?deletefake: borra los items y el dinero que tienes en tu arca de pre-aceptado(por si te equivocas)"
                      +"\n\n?deletemul: borra los items y el dinero que tienes en tu arca de grupo (por si te equivocas)"
                      +"\n\n?list: muestra la lista de piratas con el dinero REAL que tiene para recibir el Tier"
        }});
      }

    //comando ADMIN para sacar la lista de comandos
      if (command === 'admhelp'){
        if (check(message.author.id) == 0){
        message.author.send({embed: {
          color: 0xff8000,
          description: "<:registro:590562326785294336> LISTA DE COMANDOS DE ADMIN PARA UTILIZAR EL BOT <:registro:590562326785294336>"
                      +"\nPrimera ayuda para manejarte con comandos de admin: "
                      +"\nLee atentamente todas las pautas a seguir para realizar bien todas las operaciones, recuerda que los cambios que hagas muchos no se pueden revertir y tienen cambios sobre el dinero real que maneja la guild"
                      +"\nLos comando se introducen por casillas ( cada casilla seria dar al espacio)"
                      +"\n\nLISTA CON LOS COMANDOS:"
                      +"\n?admadd: introduce el dinero de la casilla pre-aceptado a la casilla de dinero real introduciendo solo su número de la lista"
                      +"\nintroduccion: [número de la lista del juagdor] (recuerda que las casilla van de 0 hasta el numero maximo que haya)"
                      +"\nEjemplo: ?admadd 1 (añade el dinero pre-aceptado del jugador de la casilla 1 al dinero real)"
                      +"\n\n?admchange: cambia dinero de un jugador a otro de la casilla real (para aquellos que hagan caza marina para otros)"
                      +"\nintroduccion: [casilla del jugador al que se le quita] [casilla de quien recibe el dinero][cantidad de dinero][repetir cantidad de dinero por seguridad]"
                      +"\nEjemplo: ?admchange 1 4 6000 6000 (añade 6000 de dinero del jugador 1 al jugador 4)"
                      +"\n\n?admmul: añade el dinero de la casilla grupal a la casilla real a los jugadores que se indique"
                      +"\nintroduccion: puedes poner hasta un maximo de 3 acompañantes y en las dos primeras casillas quien ha metido el dinero"
                      +"\n              [casilla de quien posee el dinero][repetir quien posee el dinero por si acaso][acompañante 1][repetir acompañante 1][acompañante 2 si lo hay si no, no se pone][repetir acompañante 2][acompañante 3 si lo hay][repetir acompañante 3]"
                      +"\nEjemplo: ?admmul 0 0 2 2 // ?admmul 0 0 4 4 2 2 // ?admmul 1 1 3 3 6 6 2 2"
                      +"\n\n?admfakelist: te saca la lista de dinero preaceptado de todos los usuarios registrados"
                      +"\n\n?admfakemul: te saca la lista de dinero de caza en grupo de los usuarios registrados"
        }});
        message.author.send({embed: {
          color: 0xff8000,
          description: "?admguildcash: modifica el dinero que hay en total en guild sumando o restando la cantidad que pongamos"
          +"\nintroduccion: tienes que introducir el dinero que quieres sumar o restar dos veces seguidas"
          +"\n              [cantidad de dinero que se quiere sumar o restar][[repetir la cantidad]"
          +"\nEjemplo: ?admguildcash -1000000 (resta 1000000) // ?admguildcash 250000 (añade 250000)"
          +"\n\n?admsetstart: fija con que fichas y dinero empieza la guild o lo cambia a los valores que quieras"
          +"\nintroduccion: tienes que poner los numeros de items que quieres (7 items) y despues el dinero total que tiene la guild"
          +"\n              [item1][item2][item3][item4][item5][item6][item7][item8][dinero que queremos meter]"
          +"\nEjemplo: ?admsetstart 34 23 234 45 1 23 182 600030004003"
          +"\n\n?admsetguildcash: cambia el dinero que hay en la guild por la cantidad que tu desees"
          +"\nintroducion: [cantidad por la quieres cambiar el dinero] (recuerda el dinero lo cambia por la cantidad que pones, no suma ni resta)"
          +"\nEjemplo: ?admsetguildcash 6450000"
          +"\n\n?admlist: te saca la lista de piratas con el dinero residual que se queda (dinero residual:lo que sobra despues de completar todos los tier)"
          +"\nEjemplo: ?admlist (no tienes que poner nada mas, ya te sale la lista con los datos sola)"
          +"\n\n?admunregister: elimina a una persona de la lista de piratas dejando su posicion libre para que otra se registre"
          +"\nintroduccion: [numero de la casilla de la persona que se quiere eliminar][repetir el numero]"
          +"\nEjemplo: ?admunregister 1 1 (elimina la persona de la casilla 1 cuidado con no equivocarse)"
          +"\n\n?admdeletefake: elimina el dinero preaceptado de la persona que indiques"
          +"\nintroduccion: [casilla del jugador][repetir la casilla]"
          +"\n\n?admdeletemul: elimina el dinero de la casilla grupal"
          +"\nintroduccion: [casilla del jugador][repetir casilla]"
        }});

      }else{
        message.channel.send({embed: {
          color: 0xff8000,
          description: "Error: no tienes permisos de administrador para realizar esta acción"
          }});
      }
    }

    //comando registro de usuarios [100%]
      if (command === 'register'){
        var control = 0;
        for (var i = 0 ; i<config.alto ; i++){
          if (almacen[i][0] == message.author.id){
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Esto no es Suiza, aqui no puedes tener dos cuentas con dinero"
            }});
            control = -1;
          }
        }
        for (var i  =0; i<config.alto && control == 0 ; i++){
          if (almacen[i][0] == undefined && almacen[i][1] == undefined){
            almacen[i][0] = message.author.id;
            almacen[i][1] = message.author.username;
            almacen[i][2] = new Array (config.items);
            almacen[i][3] = new Array (config.items);
            almacen[i][6] = new Array (config.items);
            for (var z = 0; z<config.items ; z++){
              almacen[i][2][z] = parseInt(0, 10);
              almacen[i][3][z] = parseInt(0, 10);
              almacen[i][6][z] = parseInt(0, 10);
            }
            almacen[i][4] = parseInt(0, 10);
            almacen[i][5] = parseInt(0, 10);
            almacen[i][7] = parseInt(0, 10);
            control = -1;
            message.channel.send({embed: {
              color: 0xff8000,
              description: "¡Hola "+almacen [i][1]+"! eres el usuario nº: "+i+" disfruta de nuestro almacen"
            }});
          }
          if (i == config.alto - 1){
            message.channel.send({embed: {
              color: 0xff8000,
              description: "¡AVISO IMPORTANTE!: Se ha llegado al número máximo de usuarios"
            }});
            control = -1;
          }
        }
      }

    //comando para insertar el drop de los monstruos marinos [100%]
      if (command === 'add'){
        var total = 0;
        var control = 0;
        var item = new Array(config.items);

        for (var i = 0; i < args.length && control == 0 ; i++){
          if (i >= config.items){
            control = -1;
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: Tienes que introducir "+config.items+" items, con números válidos"
            }});
          }
        }
        for (var i = 0; i< config.items && control == 0 ; i++){
          if (args[i] >= 0 && args[i] <= 1000000^1000000){
            item[i] = parseInt(args[i],10);
          }else{
            control = -1;
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: Tienes que introducir "+config.items+" items, con números válidos"
            }});
          }
        }
        if (control == 0){
        for (var i = 0 ; i<config.alto ; i++){
          if (almacen[i][0] == message.author.id){
            for (var j = 0 ; j<config.items ; j++){
              almacen[i][2][j] += item[j];
              almacen[i][4] += item[j]*precios[j];
              total += item[j]*precios[j];
            }
          }
        }
        message.channel.send({embed: {
          color: 0xff8000,
          description: "Items añadidos por "+message.author.username+
          " a su arca de dinero pre-aceptado:\n<:m100:590527631162605578>: "+item[0]+
          "\n<:k409:590527672472436738>: "+item[1]+
          "\n<:k100:590527684589781022>: "+item[2]+
          "\n<:k82:590527698305286146>: "+item[3]+
          "\n<:k53:590527709801611285>: "+item[4]+
          "\n<:k52:590527721084420096>: "+item[5]+
          "\n<:k42:590527731649740804>: "+item[6]+"\nDinero virtual añadido: "+formatNumber.new(total)
        }});
      }
      }

    //comando para ver el dinero virtual que tienes [100%]
      if (command === 'fakecash'){

        for (var i = 0 ; i<config.alto ; i++){
          if (almacen[i][0] == message.author.id){
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Items añadidos por "+message.author.username+
              " a su arca de dinero pre-aceptado:\n<:m100:590527631162605578>: "+almacen[i][2][0]+
              "\n<:k409:590527672472436738>: "+almacen[i][2][1]+
              "\n<:k100:590527684589781022>: "+almacen[i][2][2]+
              "\n<:k82:590527698305286146>: "+almacen[i][2][3]+
              "\n<:k53:590527709801611285>: "+almacen[i][2][4]+
              "\n<:k52:590527721084420096>: "+almacen[i][2][5]+
              "\n<:k42:590527731649740804>: "+almacen[i][2][6]+"\nDinero virtual: "+formatNumber.new(almacen[i][4])
            }});
          }
        }
      }

    //comando para meter dinero de caza marina de varias personas [100%]
      if (command === 'addmul'){
        var total = 0;
        var control = 0;
        var item = new Array(config.items);

        for (var i = 0; i < args.length && control == 0 ; i++){
          if (i >= config.items){
            control = -1;
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: Tienes que introducir "+config.items+" items, con números válidos"
            }});
          }
        }
        for (var i = 0; i< config.items && control == 0 ; i++){
          if (args[i] >= 0 && args[i] <= 1000000^1000000){
            item[i] = parseInt(args[i],10);
          }else{
            control = -1;
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: Tienes que introducir "+config.items+" items, con números válidos"
            }});
          }
        }
        if (control == 0){
        for (var i = 0 ; i<config.alto ; i++){
          if (almacen[i][0] == message.author.id){
            for (var j = 0 ; j<config.items ; j++){
              almacen[i][6][j] += item[j];
              almacen[i][7] += item[j]*precios[j];
              total += item[j]*precios[j];
            }
          }
        }
        message.channel.send({embed: {
          color: 0xff8000,
          description: "Items añadidos por "+message.author.username+
          " a su arca de dinero grupal:\n<:m100:590527631162605578>: "+item[0]+
          "\n<:k409:590527672472436738>: "+item[1]+
          "\n<:k100:590527684589781022>: "+item[2]+
          "\n<:k82:590527698305286146>: "+item[3]+
          "\n<:k53:590527709801611285>: "+item[4]+
          "\n<:k52:590527721084420096>: "+item[5]+
          "\n<:k42:590527731649740804>: "+item[6]+"\nDinero virtual añadido: "+formatNumber.new(total)
        }});
      }
      }

    //comando para ver el dinero que tienes en el arca de grupo [100%]
    if (command === 'fakemul'){

      for (var i = 0 ; i<config.alto ; i++){
        if (almacen[i][0] == message.author.id){
          message.channel.send({embed: {
            color: 0xff8000,
            description: "Items añadidos por "+message.author.username+
            " a su arca de dinero grupal:\n<:m100:590527631162605578>: "+almacen[i][6][0]+
            "\n<:k409:590527672472436738>: "+almacen[i][6][1]+
            "\n<:k100:590527684589781022>: "+almacen[i][6][2]+
            "\n<:k82:590527698305286146>: "+almacen[i][6][3]+
            "\n<:k53:590527709801611285>: "+almacen[i][6][4]+
            "\n<:k52:590527721084420096>: "+almacen[i][6][5]+
            "\n<:k42:590527731649740804>: "+almacen[i][6][6]+"\nDinero virtual: "+formatNumber.new(almacen[i][7])
          }});
        }
      }
    }

    //comando para borrar la cartera virtual de Dinero [100%]
      if (command === 'deletefake'){
        for (var i = 0 ; i<config.alto ; i++){
          if (almacen[i][0] == message.author.id){
            for (var j = 0 ; j<config.items ; j++){
              almacen[i][2][j] = almacen[i][2][j] * 0 ;
            }
            almacen[i][4] = almacen[i][4] * 0;
          }
        }
        message.channel.send({embed: {
          color: 0xff8000,
          description: "Se ha restablacido el arca de dinero pre-aceptado, todos los contadores a 0"
        }});
      }

    //comando para borrar la cartera grupal de Dinero [100%]
      if (command === 'deletemul'){
        for (var i = 0 ; i<config.alto ; i++){
          if (almacen[i][0] == message.author.id){
            for (var j = 0 ; j<config.items ; j++){
              almacen[i][6][j] = almacen[i][6][j] * 0 ;
            }
            almacen[i][7] = almacen[i][7] * 0;
          }
        }
        message.channel.send({embed: {
          color: 0xff8000,
          description: "Se ha restablacido el arca de dinero grupal, todos los contadores a 0"
        }});
      }

    //comando para sacar la lista de todos los registrados [100%]
      if (command === 'list'){
        var control = 0;
        message.channel.send({embed: {
          color: 0xff8000,
          description: "<:registro:590562326785294336> LISTA DE PIRATAS MAS BUSCADOS <:registro:590562326785294336>\n"
        }});
        for (var i = 0; i<config.alto && control == 0 ; i++){
          if (almacen[i][0] != undefined){
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Registro "+i+": "+almacen[i][1]+ " (TIER "+tier(almacen[i][5])+")\n"+
              "<:cofre:590562981985779723> Dinero total obtenido: "+formatNumber.new(almacen[i][5])
            }});
          }
        }
        message.channel.send({embed: {
          color: 0xff8000,
          description: "Dinero total de la guild actualizado\n"+
          "<:m100:590527631162605578>: "+guild[1][0]+
          "\n<:k409:590527672472436738>: "+guild[1][1]+
          "\n<:k100:590527684589781022>: "+guild[1][2]+
          "\n<:k82:590527698305286146>: "+guild[1][3]+
          "\n<:k53:590527709801611285>: "+guild[1][4]+
          "\n<:k52:590527721084420096>: "+guild[1][5]+
          "\n<:k42:590527731649740804>: "+guild[1][6]+
          "\n<:cofre:590562981985779723> Dinero total de guild: "+formatNumber.new(guild[0])
        }});
      }

    // comando ADMIN para ingresar dinero a guild [100%]
      if (command === 'admadd'){
        var control = 0;
        var gente = 0;
        var stop = 0;

        if (check(message.author.id) == 0){
        for (var i = 0 ; i < config.alto && stop == 0  ; i++){
        if (almacen[i][0] != undefined){
            gente++;
          }else{
            stop = -1;
          }
        }
        if (args.length == 1){

            if (parseInt(args[0],10) >= 0 && parseInt(args[0],10)<gente){
              for (var i = 0 ; i < config.items && control == 0 ; i++){
                guild [1][i] += almacen[args[0]][2][i];
                almacen[args[0]][3][i] += almacen[args[0]][2][i];
                almacen[args[0]][2][i] = almacen[args[0]][2][i] * 0 ;
              }
              guild[0] += almacen[args[0]][4];
              almacen[args[0]][5] += almacen[args[0]][4];
              almacen[args[0]][4] = almacen[args[0]][4] * 0;

              message.channel.send({embed: {
                color: 0xff8000,
                description: "Dinero total de la guild actualizado, arcas de la guild:\n"+
                "<:m100:590527631162605578>: "+guild[1][0]+
                "\n<:k409:590527672472436738>: "+guild[1][1]+
                "\n<:k100:590527684589781022>: "+guild[1][2]+
                "\n<:k82:590527698305286146>: "+guild[1][3]+
                "\n<:k53:590527709801611285>: "+guild[1][4]+
                "\n<:k52:590527721084420096>: "+guild[1][5]+
                "\n<:k42:590527731649740804>: "+guild[1][6]+
                "\n<:cofre:590562981985779723> Dinero total de guild: "+formatNumber.new(guild[0])
              }});
            }else{
              message.channel.send({embed: {
                color: 0xff8000,
                description: "Error: Introduce una persona de la lista válida revisa a quien le introduces el dinero"
              }});
            }
        }else{
          message.channel.send({embed: {
            color: 0xff8000,
            description: "Error: tienes que introducir 1 casilla para introducirle el dinero"
          }});
        }
      }else{
        message.channel.send({embed: {
          color: 0xff8000,
          description: "Error: no tienes permisos de administrador para realizar esta acción"
        }});
      }
    }

    // comando ADMIN para cambiar dinero de un jugador a otro [100%]
      if (command === 'admchange'){
        var stop = 0;
        var gente = 0;

        if (check(message.author.id) == 0){

            for (var i = 0 ; i < config.alto && stop == 0  ; i++){
            if (almacen[i][0] != undefined){
                gente++;
              }else{
                stop = -1;
              }
            }
          if (args.length == 4){
            if (parseInt(args[0],10) >= 0 && parseInt(args[1],10) >= 0 && parseInt(args[0],10)<gente && parseInt(args[1],10)<gente){
              if(parseInt(args[2],10)>0 && parseInt(args[3],10)>0 && parseInt(args[2],10)==parseInt(args[3],10)){
                  almacen[args[0]][5] = almacen[args[0]][5] - parseInt(args[2],10);
                  almacen[args[1]][5] += parseInt(args[2],10);
                  message.channel.send({embed: {
                    color: 0xff8000,
                    description: almacen[args[0]][1]+" le ha dado "+formatNumber.new(args[2])+" de plata a "+almacen[args[1]][1]+
                    "\nDInero actual de "+almacen[args[0]][1]+": "+formatNumber.new(almacen[args[0]][5])+
                    "\nDInero actual de "+almacen[args[1]][1]+": "+formatNumber.new(almacen[args[1]][5])
                  }});
              }else{
                message.channel.send({embed: {
                  color: 0xff8000,
                  description: "Error: Tienes que introducir una cantidad de dinero valida 2 veces seguidas"
                }});
              }
            }else{
              message.channel.send({embed: {
                color: 0xff8000,
                description: "Error: Introduce una persona de la lista válida revisa a quien se lo mandas y quien lo da"
              }});
            }
          } else {
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: tienes que introducir 4 casillas"
            }});
          }
          }else{
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: no tienes permisos de administrador para realizar esta acción"
            }});
          }
      }

    // comando ADMIN para añadir el dinero de la casilla grupal a la guild [100%]
      if (command === 'admmul'){
        var stop = 0;
        var gente = 0;

        if (check(message.author.id) == 0){
            for (var i = 0 ; i < config.alto && stop == 0  ; i++){
            if (almacen[i][0] != undefined){
                gente++;
              }else{
                stop = -1;
              }
            }
          if (args.length == 4 || args.length == 6 || args.length == 8){
            if (args.length == 4){
              if (parseInt(args[0],10) == parseInt(args[1],10) && parseInt(args[2],10) == parseInt(args[3],10)){
                if (parseInt(args[0],10) >= 0 && parseInt(args[1],10) >= 0 && parseInt(args[2],10) >= 0 && parseInt(args[3],10) >= 0 &&
                    parseInt(args[0],10) < gente && parseInt(args[1],10) < gente && parseInt(args[2],10) < gente && parseInt(args[3],10) < gente){
                      var fakemul = parseInt(almacen[args[0]][7],10);
                      almacen[args[0]][5] += parseInt(almacen[args[0]][7] * 0.5,10);
                      almacen[args[2]][5] += parseInt(almacen[args[0]][7] * 0.5,10);
                      guild[0] += almacen[args[0]][7];
                      almacen[args[0]][7] = almacen[args[0]][7]*0;
                      for (var i = 0; i<config.items ; i++){
                        guild[1][i] += almacen [args[0]][6][i];
                        almacen [args[0]][6][i] = parseInt(0,10);
                      }
                      message.channel.send({embed: {
                        color: 0xff8000,
                        description: almacen[args[0]][1]+" ha añadido dinero para los siguientes piratas :"
                        +"\n1: "+almacen[args[2]][1]
                        +"\nSe ha añadido: "+formatNumber.new(fakemul * 0.5)+" de dinero a cada uno"
                        +"\nDinero total de la guild: "+formatNumber.new(guild[0] + almacen[args[0]][7])
                      }});
                    }else{
                      message.channel.send({embed: {
                        color: 0xff8000,
                        description: "Error: selecciona una persona correcta de la lista"
                      }});
                    }
              }else{
                message.channel.send({embed: {
                  color: 0xff8000,
                  description: "Error: las casillas 1 y 2 ó las casillas 3 y 4 no coinciden"
                }});
              }
            }if (args.length == 6){
              if (parseInt(args[0],10) == parseInt(args[1],10) && parseInt(args[2],10) == parseInt(args[3],10) && parseInt(args[4],10) == parseInt(args[5],10)){
                if (parseInt(args[0],10) >= 0 && parseInt(args[1],10) >= 0 && parseInt(args[2],10) >= 0 && parseInt(args[3],10) >= 0 && parseInt(args[4],10) >= 0 && parseInt(args[5],10) &&
                    parseInt(args[0],10) < gente && parseInt(args[1],10) < gente && parseInt(args[2],10) < gente && parseInt(args[3],10) < gente && parseInt(args[4],10) < gente && parseInt(args[5],10) < gente){
                      var fakemul = parseInt(almacen[args[0]][7],10);
                      almacen[args[0]][5] += parseInt(almacen[args[0]][7] * 0.333,10);
                      almacen[args[2]][5] += parseInt(almacen[args[0]][7] * 0.333,10);
                      almacen[args[4]][5] += parseInt(almacen[args[0]][7] * 0.333,10);
                      guild[0] += almacen[args[0]][7];
                      almacen[args[0]][7] = almacen[args[0]][7]*0;
                      for (var i = 0; i<config.items ; i++){
                        guild[1][i] += almacen [args[0]][6][i];
                        almacen [args[0]][6][i] = parseInt(0,10);
                      }
                      message.channel.send({embed: {
                        color: 0xff8000,
                        description: almacen[args[0]][1]+" ha añadido dinero para los siguientes piratas :"
                        +"\n1: "+almacen[args[2]][1]
                        +"\n2: "+almacen[args[4]][1]
                        +"\nSe ha añadido: "+formatNumber.new(fakemul * 0.333)+" de dinero a cada uno"
                        +"\nDinero total de la guild: "+formatNumber.new(guild[0])
                      }});
                    }else{
                      message.channel.send({embed: {
                        color: 0xff8000,
                        description: "Error: selecciona una persona correcta de la lista"
                      }});
                    }
              }else{
                message.channel.send({embed: {
                  color: 0xff8000,
                  description: "Error: las casillas 1 y 2 ó las casillas 3 y 4 ó las casillas 5 y 6 no coinciden"
                }});
              }
            }if (args.length == 8){
              if (parseInt(args[0],10) == parseInt(args[1],10) && parseInt(args[2],10) == parseInt(args[3],10) && parseInt(args[4],10) == parseInt(args[5],10) && parseInt(args[6],10) == parseInt(args[7],10)){
                if (parseInt(args[0],10) >= 0 && parseInt(args[1],10) >= 0 && parseInt(args[2],10) >= 0 && parseInt(args[3],10) >= 0 && parseInt(args[4],10) >= 0 && parseInt(args[5],10) && parseInt(args[6],10) >= 0 && parseInt(args[7],10) &&
                    parseInt(args[0],10) < gente && parseInt(args[1],10) < gente && parseInt(args[2],10) < gente && parseInt(args[3],10) < gente && parseInt(args[4],10) < gente && parseInt(args[5],10) < gente && parseInt(args[6],10) < gente && parseInt(args[7],10) < gente){
                      var fakemul = parseInt(almacen[args[0]][7],10);
                      almacen[args[0]][5] += parseInt(almacen[args[0]][7] * 0.25,10);
                      almacen[args[2]][5] += parseInt(almacen[args[0]][7] * 0.25,10);
                      almacen[args[4]][5] += parseInt(almacen[args[0]][7] * 0.25,10);
                      almacen[args[6]][5] += parseInt(almacen[args[0]][7] * 0.25,10);
                      guild[0] += almacen[args[0]][7];
                      almacen[args[0]][7] = almacen[args[0]][7]*0;
                      for (var i = 0; i<config.items ; i++){
                        guild[1][i] += almacen [args[0]][6][i];
                        almacen [args[0]][6][i] = parseInt(0,10);
                      }
                      message.channel.send({embed: {
                        color: 0xff8000,
                        description: almacen[args[0]][1]+" ha añadido dinero para los siguientes piratas :"
                        +"\n1: "+almacen[args[2]][1]
                        +"\n2: "+almacen[args[4]][1]
                        +"\n2: "+almacen[args[6]][1]
                        +"\nSe ha añadido: "+formatNumber.new(fakemul * 0.25)+" de dinero a cada uno"
                        +"\nDinero total de la guild: "+formatNumber.new(guild[0] + almacen[args[0]][7])
                      }});
                    }else{
                      message.channel.send({embed: {
                        color: 0xff8000,
                        description: "Error: selecciona una persona correcta de la lista"
                      }});
                    }
              }else{
                message.channel.send({embed: {
                  color: 0xff8000,
                  description: "Error: las casillas 1 y 2 ó las casillas 3 y 4 ó las casillas 5 y 6 ó las casillas 7 y 8 no coinciden"
                }});
              }
            }
          }else{
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: tienes que introducir 2, 4 o 6 casillas para poder hacer la operación"
            }});
          }
      }else{
        message.channel.send({embed: {
          color: 0xff8000,
          description: "Error: no tienes permisos de administrador para realizar esta acción"
        }});
      }
    }

    // comando ADMIN para modificar el dinero de la guild [100%]
      if (command === 'admguildcash'){

        if (check(message.author.id) == 0){
            if (args.length == 2 && args[0] == args[1]){
              if(args[0]>= -1 * 1000000^1000000 && args[0]<= 1000000^1000000){
                if( Number.isInteger(parseInt(args[0],10)) && Number.isInteger(parseInt(args[1],10)) ){
                guild[0] += parseInt(args[0],10);
                message.channel.send({embed: {
                  color: 0xff8000,
                  description: "Se ha modificado el dinero de la guild en: "+formatNumber.new(args[0])
                              +"\n<:cofre:590562981985779723> Dinero de la guild : "+formatNumber.new(guild[0])
                }});
              }else{
                message.channel.send({embed: {
                  color: 0xff8000,
                  description: "Error: No pongas letras, solo khlav kalash"
                }});
              }
              }else{
                message.channel.send({embed: {
                  color: 0xff8000,
                  description: "Error: introduce una cantidad de dinero válida"
                }});
              }
            }else{
              message.channel.send({embed: {
                color: 0xff8000,
                description: "Error: tienes que introducir el dinero dos veces iguales"
              }});
            }
          }else{
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: no tienes permisos de administrador para realizar esta acción"
            }});
          }
      }

    // comando ADMIN para indicar con cuanto dinero empieza la guild [100%]
      if (command === 'admsetstart'){
        var stop = 0;
        var gente = 0;
        var checkit = 0;

        if (check(message.author.id) == 0){
          for (var i = 0 ; i < config.alto && stop == 0  ; i++){
          if (almacen[i][0] != undefined){
              gente++;
            }else{
              stop = -1;
            }
          }
          if (args.length == 8){
            for ( var i = 0; i<args.length && checkit == 0;i++){
              if(parseInt(args[i],10) < 0 || !Number.isInteger(parseInt(args[i],10))){
                checkit = -1;
              }
            }
            if ( checkit == 0){
              for ( var i = 0; i < config.items ; i++){
                guild[1][i] = parseInt(args[i],10);
              }
              guild [0] = parseInt(args[7],10);

              message.channel.send({embed: {
                color: 0xff8000,
                description: "Dinero total de la guild actualizado\n"+
                "<:m100:590527631162605578>: "+guild[1][0]+
                "\n<:k409:590527672472436738>: "+guild[1][1]+
                "\n<:k100:590527684589781022>: "+guild[1][2]+
                "\n<:k82:590527698305286146>: "+guild[1][3]+
                "\n<:k53:590527709801611285>: "+guild[1][4]+
                "\n<:k52:590527721084420096>: "+guild[1][5]+
                "\n<:k42:590527731649740804>: "+guild[1][6]+
                "\n<:cofre:590562981985779723> Dinero total de guild: "+formatNumber.new(guild[0])
              }});

            }else{
              message.channel.send({embed: {
                color: 0xff8000,
                description: "Error: Introduce números correctos (positivos) en las casillas"
              }});
            }
          }else{
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: tienes que introducir un total de 8 casillas (7 de items + 1 Dinero total)"
            }});
          }
          }else{
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: no tienes permisos de administrador para realizar esta acción"
            }});
          }
      }

    // comando para hacer set de dinero de la guild [100%]
      if (command === 'admsetguildcash'){

        if (check(message.author.id) == 0){
          if (args.length == 1){
            if(Number.isInteger(parseInt(args[0],10)) && parseInt(args[0],10) >= 0){
              guild[0] = parseInt(args[0],10);

              message.channel.send({embed: {
                color: 0xff8000,
                description: "Dinero total de la guild actualizado\n"+
                "<:m100:590527631162605578>: "+guild[1][0]+
                "\n<:k409:590527672472436738>: "+guild[1][1]+
                "\n<:k100:590527684589781022>: "+guild[1][2]+
                "\n<:k82:590527698305286146>: "+guild[1][3]+
                "\n<:k53:590527709801611285>: "+guild[1][4]+
                "\n<:k52:590527721084420096>: "+guild[1][5]+
                "\n<:k42:590527731649740804>: "+guild[1][6]+
                "\n<:cofre:590562981985779723> Dinero total de guild: "+formatNumber.new(guild[0])
              }});

            }else{
              message.channel.send({embed: {
                color: 0xff8000,
                description: "Error: introduce una cantidad de dinero válida"
              }});
            }
          }else{
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: introduce 1 casilla con el dinero que quieres poner en la guild"
            }});
          }
        }else{
          message.channel.send({embed: {
            color: 0xff8000,
            description: "Error: no tienes permisos de administrador para realizar esta acción"
          }});
        }
      }

    // comando para hacer recuento de tiers [100%]
      if (command === 'admlist'){
        var control = 0;
        var residuos = 0;

          if (check(message.author.id) == 0){
            message.channel.send({embed: {
              color: 0xff8000,
              description: "<:registro:590562326785294336> LISTA DE PIRATAS MAS BUSCADOS <:registro:590562326785294336>\n"
            }});
            for (var i = 0; i<config.alto && control == 0 ; i++){
              if (almacen[i][0] != undefined){
                if(tier(almacen[i][5]) == 1){
                  residuos += 0;
                }else{
                residuos += parseInt(almacen[i][5],10) - parseInt(tier(almacen[i][5])*65000000,10);
                }
                message.channel.send({embed: {
                  color: 0xff8000,
                  description: "Registro "+i+": "+almacen[i][1]+ " (TIER "+tier(almacen[i][5])+")\n"+
                  "<:cofre:590562981985779723> Dinero total obtenido: "+formatNumber.new(almacen[i][5])
                }});
              }
            }
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Dinero total de la guild actualizado\n"+
              "<:m100:590527631162605578>: "+guild[1][0]+
              "\n<:k409:590527672472436738>: "+guild[1][1]+
              "\n<:k100:590527684589781022>: "+guild[1][2]+
              "\n<:k82:590527698305286146>: "+guild[1][3]+
              "\n<:k53:590527709801611285>: "+guild[1][4]+
              "\n<:k52:590527721084420096>: "+guild[1][5]+
              "\n<:k42:590527731649740804>: "+guild[1][6]+
              "\n<:cofre:590562981985779723> Dinero residual: "+formatNumber.new(residuos)+
              "\n<:cofre:590562981985779723> Dinero total de guild: "+formatNumber.new(guild[0])
            }});

            }else{
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: no tienes permisos de administrador para realizar esta acción"
            }});

        }
      }

    // comando ADMIN para eliminar siguientes [100%]
      if (command === 'admunregister'){
        var stop=0;
        var gente=0;
        if (check(message.author.id) == 0){
          for (var i = 0 ; i < config.alto && stop == 0  ; i++){
          if (almacen[i][0] != undefined){
              gente++;
            }else{
              stop = -1;
            }
          }
          if(args.length == 2 && args[0] == args[1]){
            if(Number.isInteger(parseInt(args[0],10)) && Number.isInteger(parseInt(args[1]))
            && args[0] >= 0 && args[1] >= 0
            && args[0]<gente && args[1] <gente){
              almacen[args[0]][0]=undefined;
              almacen[args[0]][1]=undefined;
              message.channel.send({embed: {
                color: 0xff8000,
                description: "Se ha restablacido el arca de dinero pre-aceptado de: "+almacen[args[0]][1]+" todos l0s contadores a 0"
                            +"\n¡La casilla está disponible para un nuevo registro!"
              }});
            }else{
              message.channel.send({embed: {
                color: 0xff8000,
                description: "Error: la persona que has indicado no esta en la lista"
              }});
            }
          }else{
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: introduce el numero de persona a borrar 2 veces siguidas"
            }});
          }
        }else{
          message.channel.send({embed: {
            color: 0xff8000,
            description: "Error: no tienes permisos de administrador para realizar esta acción"
          }});
        }
      }

    // comando ADMIN para borrar el dinero pre-aceptado de una persona
      if (command === 'admdeletefake'){
        var gente = 0;
        var stop = 0;
        if (check(message.author.id) == 0){
          for (var i = 0 ; i < config.alto && stop == 0  ; i++){
          if (almacen[i][0] != undefined){
              gente++;
            }else{
              stop = -1;
            }
          }
          if(args.length == 2 && args[0] == args[1]){
            if(Number.isInteger(parseInt(args[0],10)) && Number.isInteger(parseInt(args[1]))
            && args[0] >= 0 && args[1] >= 0
            && args[0]<gente && args[1] <gente){
              for (var j = 0 ; j<config.items ; j++){
                almacen[args[0]][2][j] = almacen[args[0]][2][j] * 0 ;
              }
              almacen[args[0]][4] = almacen[args[0]][4] * 0;
              message.channel.send({embed: {
                color: 0xff8000,
                description: "Se ha eliminado el dinero de: "+almacen[args[0]][1]+" de la casilla de preaceptado"
                            +"\n¡Todos los contadores a 0!"
              }});
            }else{
              message.channel.send({embed: {
                color: 0xff8000,
                description: "Error: la persona que has indicado no esta en la lista"
              }});
            }
          }else{
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: introduce el numero de persona a borrar su dinero 2 veces siguidas"
            }});
          }
        }else{
          message.channel.send({embed: {
            color: 0xff8000,
            description: "Error: no tienes permisos de administrador para realizar esta acción"
          }});
        }
      }

    // comando ADMIN para borrar el dinero grupal
      if (command === 'admdeletemul'){
        var gente = 0;
        var stop = 0;
        if (check(message.author.id) == 0){
          for (var i = 0 ; i < config.alto && stop == 0  ; i++){
          if (almacen[i][0] != undefined){
              gente++;
            }else{
              stop = -1;
            }
          }
          if(args.length == 2 && args[0] == args[1]){
            if(Number.isInteger(parseInt(args[0],10)) && Number.isInteger(parseInt(args[1]))
            && args[0] >= 0 && args[1] >= 0
            && args[0]<gente && args[1] <gente){
              for (var j = 0 ; j<config.items ; j++){
                almacen[args[0]][6][j] = almacen[args[0]][6][j] * 0 ;
              }
              almacen[args[0]][7] = almacen[args[0]][7] * 0;
              message.channel.send({embed: {
                color: 0xff8000,
                description: "Se ha eliminado el dinero de: "+almacen[args[0]][1]+" de la casilla grupal"
                            +"\n¡Todos los contadores a 0!"
              }});
            }else{
              message.channel.send({embed: {
                color: 0xff8000,
                description: "Error: la persona que has indicado no esta en la lista"
              }});
            }
          }else{
            message.channel.send({embed: {
              color: 0xff8000,
              description: "Error: introduce el numero de persona a borrar su dinero 2 veces siguidas"
            }});
          }
        }else{
          message.channel.send({embed: {
            color: 0xff8000,
            description: "Error: no tienes permisos de administrador para realizar esta acción"
          }});
        }
      }

    // comando ADMIN para ver fake list total
      if (command === 'admfakelist'){
        var gente = 0;
        var stop = 0;
        if (check(message.author.id) == 0){
          message.author.send({embed: {
            color: 0xff8000,
            description: "<:registro:590562326785294336> LISTA DE PIRATAS MAS BUSCADOS <:registro:590562326785294336>\n"
          }});

          for (var i = 0 ; i < config.alto && stop == 0  ; i++){
          if (almacen[i][0] != undefined){
            if (almacen[i][4] == 0){
              message.author.send({embed: {
                color: 0xff8000,
                description: "El usuario <:registro:590562326785294336> "+almacen[i][1]+" <:registro:590562326785294336> de la casilla "+i+" no ha registrado dinero"
              }});
            }else{
            message.author.send({embed: {
              color: 0xff8000,
              description: "Items añadidos por <:registro:590562326785294336> "+almacen[i][1]+
              " <:registro:590562326785294336> situado en la casilla "+i+":\n<:m100:590527631162605578>: "+almacen[i][2][0]+
              "\n<:k409:590527672472436738>: "+almacen[i][2][1]+
              "\n<:k100:590527684589781022>: "+almacen[i][2][2]+
              "\n<:k82:590527698305286146>: "+almacen[i][2][3]+
              "\n<:k53:590527709801611285>: "+almacen[i][2][4]+
              "\n<:k52:590527721084420096>: "+almacen[i][2][5]+
              "\n<:k42:590527731649740804>: "+almacen[i][2][6]+"\nDinero virtual: "+formatNumber.new(almacen[i][4])
            }});
            }
            }else{
              stop = -1;
            }
          }

        }else{
          message.channel.send({embed: {
            color: 0xff8000,
            description: "Error: no tienes permisos de administrador para realizar esta acción"
          }});
        }
      }

    // comando ADMIN para ver la lista de dinero de grupo
      if (command === 'admfakemul'){
        var gente = 0;
        var stop = 0;
        if (check(message.author.id) == 0){
          message.author.send({embed: {
            color: 0xff8000,
            description: "<:registro:590562326785294336> LISTA DE PIRATAS MAS BUSCADOS <:registro:590562326785294336>\n"
          }});

          for (var i = 0 ; i < config.alto && stop == 0  ; i++){
          if (almacen[i][0] != undefined){
            if (almacen[i][7] == 0){
              message.author.send({embed: {
                color: 0xff8000,
                description: "El usuario <:registro:590562326785294336> "+almacen[i][1]+" <:registro:590562326785294336> de la casilla "+i+" no ha registrado dinero"
              }});
            }else{
            message.author.send({embed: {
              color: 0xff8000,
              description: "Items añadidos por <:registro:590562326785294336> "+almacen[i][1]+
              " <:registro:590562326785294336> situado en la casilla "+i+":\n<:m100:590527631162605578>: "+almacen[i][6][0]+
              "\n<:k409:590527672472436738>: "+almacen[i][6][1]+
              "\n<:k100:590527684589781022>: "+almacen[i][6][2]+
              "\n<:k82:590527698305286146>: "+almacen[i][6][3]+
              "\n<:k53:590527709801611285>: "+almacen[i][6][4]+
              "\n<:k52:590527721084420096>: "+almacen[i][6][5]+
              "\n<:k42:590527731649740804>: "+almacen[i][6][6]+"\nDinero virtual: "+formatNumber.new(almacen[i][7])
            }});
            }
            }else{
              stop = -1;
            }
          }

        }else{
          message.channel.send({embed: {
            color: 0xff8000,
            description: "Error: no tienes permisos de administrador para realizar esta acción"
          }});
        }
      }

});


client.login(config.token);
