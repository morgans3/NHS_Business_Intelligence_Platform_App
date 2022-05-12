const { faker } = require("@faker-js/faker");
class TeamFactory {
    static create() {
        return {
            "name": `${faker.music.genre()} test team`,
            "code": faker.random.alpha(3, { upcase: true }),
            "description": faker.lorem.sentence(),
            "organisation": "Collaborative Partners",
            "organisationcode": "CPNI",
            "responsible_people": [{
                "username": "luke.tinnion@nhs.net",
                "organisation": "Collaborative Partners"
            }]
        };
    }
}

module.exports = TeamFactory;