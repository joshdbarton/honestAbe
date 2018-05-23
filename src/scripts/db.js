const $ = require("jquery")

 const DBManage = Object.create({}, {
    getAllPols: { //gets all the politicians
        value: () => {
            return $.ajax("http://127.0.0.1:8088/politicians")
        }
    },
    getPolSpons: { //gets all the sponsorships for a particular politician
        value: (id) => {
          return  $.ajax(`http://127.0.0.1:8088/sponsorships?polId=${id}`)
        }
    },
    getPacInts: { //gets the interests that a pac represents
        value: (id) => {
            return $.ajax(`http://127.0.0.1:8088/pacInterests?pacId=${id}`)
        }
    },
    getBills: { //gets all the bills
        value: () => {
            return $.ajax("http://127.0.0.1:8088/bills")
        }
    },
    getPacs: { //gets all the pacs
        value: () => {
            return $.ajax("http://127.0.0.1:8088/bills")
        }
    },
    getCorps: { //gets all the corporations
        value: () => {
           return $.ajax("http://127.0.0.1:8088/corporations")
        }
    },
    getpacCorps: {    //gets all the corporate donations to a pac
        value: (id) => {
            return $.ajax(`http://127.0.0.1:8088/corpPacDonations?pacId=${id}`)
        }
    }

})

module.exports = DBManage