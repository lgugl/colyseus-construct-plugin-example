class Player {
  constructor (data) {
    if (typeof(data.clientId) === "undefined") throw new Error("player clientId missing")
    if (typeof(data.id) === "undefined") throw new Error("player id missing")
    if (typeof(data.name) === "undefined") data.name = "unnamed"
    if (typeof(data.position) === "undefined") data.position = [0, 0]

    this.clientId = data.clientId
    this.id = data.id
    this.name = data.name
    this.position = data.position
  }

  setPosition (x, y) {
    this.position = [x, y]
  }
}

module.exports = Player
