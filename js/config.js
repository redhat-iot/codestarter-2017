var config =
{
    // hostname/port/name/password/topic for Kapua broker
    BROKER_HOSTNAME: process.env.BROKER_HOSTNAME || "broker_hostname",
    BROKER_PORT: process.env.BROKER_PORT || 80,
    API_HOSTNAME: process.env.API_HOSTNAME || "api_hostname",
    API_PORT: process.env.API_PORT || 80,
    BROKER_USERNAME: process.env.BROKER_USERNAME || "broker_username",
    BROKER_PASSWORD: process.env.BROKER_PASSWORD || "broker_password",
    BROKER_TOPIC_PREFIX: process.env.BROKER_TOPIC_PREFIX || "Some-Project/Some-Topic-Prefix"
};

module.exports = config;
