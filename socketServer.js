let users = []

const EditData = (data, id, call) => {
    const newData = data.map(item => 
        item.id === id ? {...item, call} : item
    )

    return newData;
}






const SocketServer = (socket) => {
    //Connect-disconnect
    socket.on('joinUser', (user) => {
        //console.log(user);
        users.push({id: user._id, socketId: socket.id, followers: user.followers})
        //console.log(users);
    })

    socket.on('disconnect', () => {
        const data = users.find((user) => user.socketId === socket.id)
        //console.log(data);
        if(data){
            const clients = users.filter((user) => 
                data.followers.find((item) => item._id === user.id)
            )
            //console.log(clients);
            if(clients.length > 0){
                clients.forEach((client) => {
                    socket.to(`${client.socketId}`).emit('checkUserOffline', data.id)
                })
            }

            if(data.call){
                const callUser = users.find(user => user.id === data.call)
                if(callUser){
                    users = EditData(users, callUser.id, null)
                    socket.to(`${callUser.socketId}`).emit('callerDisconnect')
                }
            }
        }
        users = users.filter((user) => user.socketId !== socket.id)
    })

    //likes

    socket.on('likePost', (newPost) => {
        const ids = [...newPost.user.followers, newPost.user._id]
        //console.log(newPost);
        const clients = users.filter((user) => ids.includes(user.id))
        //console.log(clients);

        if(clients.length > 0){
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit('likeToClient', newPost)
            })
        }
    })


    socket.on('unLikePost', (newPost) => {
        const ids = [...newPost.user.followers, newPost.user._id]
        //console.log(newPost);
        const clients = users.filter((user) => ids.includes(user.id))
        //console.log(clients);

        if(clients.length > 0){
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
            })
        }
    })

    //comments

    socket.on('createComment', (newPost) => {
        //console.log(newPost);
        const ids = [...newPost.user.followers, newPost.user._id]
        
        const clients = users.filter((user) => ids.includes(user.id))
        //console.log(clients);

        if(clients.length > 0){
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
            })
        }
    })

    socket.on('deleteComment', (newPost) => {
        //console.log(newPost);
        const ids = [...newPost.user.followers, newPost.user._id]
        
        const clients = users.filter((user) => ids.includes(user.id))
        //console.log(clients);

        if(clients.length > 0){
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
            })
        }
    })

    //follow

    socket.on('follow', (newUser) => {
        //console.log(newUser);
        const user = users.find((user) => user.id === newUser._id)
        //console.log(user);
        user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
    })

    socket.on('unFollow', (newUser) => {
        //console.log(newUser);
        const user = users.find((user) => user.id === newUser._id)
        //console.log(user);
        user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
    })

    //Notify

    socket.on('createNotify', (msg) => {
        //console.log(msg);
        
        const client = users.find((user) => msg.recipients.includes(user.id))
        //console.log(clients);
        client && socket.to(`${client.socketId}`).emit('createNotifyToClient', msg)
    })

    socket.on('removeNotify', (msg) => {
        //console.log(msg);
        
        const client = users.find((user) => msg.recipients.includes(user.id))
        //console.log(clients);
        client && socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)
    })


    //message
    socket.on('addMessage', (msg) =>{
        //console.log(msg);
        const user = users.find((user) => user.id === msg.recipient)

        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
    })

    //check user online/offline

    socket.on('checkUserOnline', (data) => {
        //console.log(user.following);
        const following = users.filter((user) => 
            data.following.find(item => item._id === user.id)
        )

        //console.log(following);
        socket.emit('checkUserOnlineToMe', following)


        const clients = users.filter((user) => 
            data.followers.find((item) => item._id === user.id)
        )
        if(clients.length > 0){
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
            })
        }
        
    })

    //call


    socket.on('callUser', data => {
        //console.log(data);
        //console.log({oldUsers: users});

        users = EditData(users, data.sender, data.recipient)

        const client = users.find(user => user.id === data.recipient)

        if(client){
            if(client.call){
                socket.emit('userBusy', data)
                users = EditData(users, data.sender, null)
            }else{
                users = EditData(users, data.recipient, data.sender)
                socket.to(`${client.socketId}`).emit('callUserToClient', data)
            }
        }

        //console.log({newUsers: users});
    })

    socket.on('endCall', data => {
        //console.log({oldUsers: users});
        //console.log(data);
        const client = users.find(user => user.id === data.sender)
        //console.log(client);
        if(client){
            socket.to(`${client.socketId}`).emit('endCallToClient', data)
            users = EditData(users, client.id, null)

            if(client.call){
                const clientCall = users.find(user => user.id === client.call)
                //console.log(clientCall);
                clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data)
                users = EditData(users, client.call, null)
            }
        }

        

        //console.log({newUsers: users});
    })
}

module.exports = SocketServer