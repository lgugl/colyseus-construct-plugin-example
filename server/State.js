var Player = require('./Player')

class State {
  constructor () {
    this.players = []
  }

  /**
   * Add player in room
   * @param data (all properties required to create a player)
   * @returns Player | false
   */
  addPlayer(data) {
      let player = new Player(data)
      if (this.players.push(player)) {
          return player
      } else {
          return false
      }
  }

  /**
   * Remove player from players list
   * @param clientId
   * @returns {boolean}
   */
  removePlayer(clientId) {
      this.players.forEach((player, index)=> {
          if (player.clientId == clientId) {
              this.players.splice(index, 1)
              return true
          }
      })
      return false
  }

  /**
   * Get player from Colyseus clientId
   * @param clientId
   * @returns Player | false
   */
  getPlayerByClientId(clientId) {
      let player = false
      this.players.forEach((e, index)=> {
          if (clientId == e.clientId) {
              player = e
              return true
          } else {
              return false
          }
      })
      return player
  }
}

module.exports = State
