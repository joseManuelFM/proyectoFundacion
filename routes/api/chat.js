const MESSAGE = require('../../database/collections/message');

module.exports=(socket) => {
    console.log('user connected');
    socket.on('join', function(userNickname) {
        console.log(userNickname +" : has joined the chat "  );
        socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ");
    });
    socket.on('messagedetection', async(senderNickname,messageContent,idseller, idbuyer, idsend) => {
        console.log(senderNickname+" :" +messageContent);
        var result = await MESSAGE.find({});
        var add = 1;
        var datos = {};
        if (result.length == 0) {
            let a = [];
            a.push({
                id : idsend,
                nickname : senderNickname,
                idreceiver: idseller,
                message : messageContent,
                create_at : new Date(),
            });
            datos["messages"] = a;
            datos["idseller"] = idseller;
            datos["idbuyer"] = idbuyer;
            datos["registerDate"] = new Date();
            add = datos;
            var msn = new MESSAGE(datos);
            result = await msn.save();
        } else {
            for (var i = 0; i < result.length; i++ ){
                if ((result[i].idseller == idseller && result[i].idbuyer == idbuyer) || (result[i].idseller == idbuyer && result[i].idbuyer == idseller) ) {
                    result[i].messages.push({
                        id : idsend,
                        idreceiver: idseller,
                        nickname : senderNickname,
                        message : messageContent,
                        create_at : new Date(),
                    });
                    add = result[i];
                    break;
                }
            }
            if (add == 1) {
                let a = [];
                a.push({
                    id : idsend,
                    idreceiver: idseller,
                    nickname : senderNickname,
                    message : messageContent,
                    create_at : new Date(),
                });
                datos["messages"] = a;
                datos["idseller"] = idseller;
                datos["idbuyer"] = idbuyer;
                datos["registerDate"] = new Date();
                add = datos;
                var msn = new MESSAGE(datos);
                result = await msn.save();
            } else {
                result = await MESSAGE.findOneAndUpdate({_id:add._id}, add);
            }
        }
        socket.emit('message', add.messages[add.messages.length - 1] );
        socket.broadcast.emit('message', add.messages[add.messages.length - 1] );
        //socket.broadcast.emit('message', add);


    });
    socket.on('disconnect', function() {
        console.log( ' user has left ')
        socket.broadcast.emit("userdisconnect"," user has left ")
    });
};
