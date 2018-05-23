const $ = require("jquery")

//flattens a 2d array
const flatten = (aoa) => {
    return aoa.reduce(
        function (accumulator, currentValue) {
            return accumulator.concat(currentValue);
        },
        []
    )
}

const unique = function* (arr, prop) {
    const map = new Map()
    let i = 0

    while (i < arr.length) {
        const key = arr[i][prop]
        if (!map.has(key) && map.set(key, 1)) yield arr[i]
        i++
    }
}

const profileBuilder = (repId) => {
    const repProfile = {}
    return $.ajax(`http://localhost:8088/politicians?repId=${repId}`)
    .then(politician => {
        repProfile.name = `${politician[0].name}`
        repProfile.id = `${politician[0].repId}`
        return $.ajax(`http://localhost:8088/sponsorships?polId=${politician[0].repId}`)
    })
    .then(sponsorships => {
        const promises = []
        sponsorships.forEach(sponsorship => {
            promises.push($.ajax(`http://localhost:8088/bills?id=${sponsorship.billId}`))
        })
        return Promise.all(promises)
    })
    .then(bills => {
        repProfile.bills = flatten(bills)
        const promises = []
        bills.forEach(bill => {
            promises.push($.ajax(`http://localhost:8088/interests?id=${bill[0].intId}`))
        })
        return Promise.all(promises)
    })
    .then(interests => {
        repProfile.interests = flatten(interests)
        const promises = []
        interests.forEach(interest => {
            promises.push($.ajax(`http://localhost:8088/pacInterests?intId=${interest[0].id}`))
        })
        return Promise.all(promises)
    })
    .then(pacInterests => {
        const promises = []
        const flattenedInterests = flatten(pacInterests)
        flattenedInterests.forEach(pacInterest => {
            promises.push($.ajax(`http://localhost:8088/pacs?pacId=${pacInterest.pacId}`))
        })
        return Promise.all(promises)
    })
    .then(pacs => {
        repProfile.pacs = []
        const flattenedPacs = flatten(pacs)
        const duplicateRemover = unique(flattenedPacs, "pacId")
        flattenedPacs.forEach(pac => {
            const nextItem = duplicateRemover.next().value
            if (nextItem !== undefined) {
                repProfile.pacs.push(nextItem)
            }
        })
    })
    .then(() => {
        $("#output-div").append(
            `
            <section class="profileCard" id="${repProfile.id}">
            <h3>${repProfile.name}</h3>
            <h5>Bills:</h5>
            <ul id="bills__${repProfile.id}"></ul>
            <h5>Interests:</h5>
            <ul id="interests__${repProfile.id}"></ul>
            <h5>Related Pacs:</h5>
            <ul id="pacs__${repProfile.id}"></ul>
            </section>
            `
        )
        repProfile.bills.forEach(bill => {
            $(`#bills__${repProfile.id}`).append(`<li>${bill.name}</li>`)
        })
        repProfile.interests.forEach(interest => {
            $(`#interests__${repProfile.id}`).append(`<li>${interest.name}</li>`)
        })
        repProfile.pacs.forEach(pac => {
            $(`#pacs__${repProfile.id}`).append(`<li>${pac.name}</li>`)
        })
    })
}

const buildProfiles = () => {
    $.ajax("http://localhost:8088/politicians")
    .then(politicians => {
        politicians.forEach(politician => {
            profileBuilder(politician.repId)
        })
    })
}

buildProfiles()