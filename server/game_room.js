var Room = require('colyseus').Room
  , log = require('debug-logger')('game-room')

class GameRoom extends Room {

  constructor (options) {
    super( options )

    // Broadcast patched state to all connected clients at 20fps (50ms)
    this.setPatchRate(50)//why does it not trigger onUpdate event?

    // Call game simulation at 60fps (16.6ms)
    this.setSimulationInterval( this.tick.bind(this), 1000 / 60 )

    let State = require('./State')
    this.setState(new State())
  }

  requestJoin(options) {
    // if this client id exist in this room, he will be reconnected onJoin method
    /*for (let client of this.clients) {
        if (client.id == options.uid) {
            return true;
        }
    }*/
    // only allow a max number of clients per room
    return this.clients.length < this.options.maxClients;
  }

  onJoin (client, data) {
    /*// get user from uid
    let player = this.state.getPlayerByClientId(data.uid);
    // check reconnection, player exist with last uid
    if (data.uid && player) {
        player = this.state.reconnectPlayer(data.uid, client.id);
    } else {
        // create player
        player = this.state.addPlayer({
          clientId: client.id,
          number: this.clients.length,
          name: data.name
        });
    }*/
    let player = this.state.addPlayer({
      clientId: client.id,
      id: this.clients.length,
      name: data.name
    });


    log.info(player.name, "(" + client.id + ")", "joined room", this.options.roomId, "(" + this.clients.length + " client(s) in this room)")

    // send data to client
    this.sendAction(client, "setUid", player.clientId)
    this.sendAction(client, "setPid", player.id)

    if (this.state.players.length == this.options.maxClients) {
      this.broadcast(JSON.stringify({"action": "start", "params": null}))
    }

    // this.broadcastOthers(client, JSON.stringify(""))
  }

  onMessage (client, data) {
    log.trace(client.id, data)
    data = JSON.parse(data)
    let player = this.state.getPlayerByClientId(client.id)
    if (data.x && data.y) {
      player.setPosition(data.x, data.y)
      // resend the state to update on client side
      
    }

  }

  tick () {

  }

  onLeave (client) {
    log.info("Client",client.id,"left the room",this.options.roomId)
    this.state.removePlayer(client.id);
  }

  onDispose () {
    log.info("Room",this.options.roomId,"is empty");
  }

  broadcastOthers (client, data) {
    for(let clt of this.clients) {
      if (clt.id != client.id) {
        this.send(clt, data)
      }
    }
  }

  sendAction (client, action, params) {
    this.send(client, JSON.stringify({action: action, params: params}))
  }

}

module.exports = GameRoom
