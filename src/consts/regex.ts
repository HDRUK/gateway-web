const REGEX_ALPHA_ONLY = /^[aA-zZ\s]+$/;
const REGEX_NUMERIC_ONLY = /^[0-9]*$/;
const REGEX_ORCID =
    /^https:\/\/orcid.org\/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]{1}$/;
const REGEX_ALPHA_NUMERIC_ONLY = /^[A-Za-z0-9]*$/;
const REGEX_PHONE =
    /^(\+?\d{1,4}?[\s.-]?)?(\(?\d{1,4}?\)?[\s.-]?)?[\d\s.-]{5,15}$/;
const REGEX_NAME =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

export {
    REGEX_ALPHA_ONLY,
    REGEX_NUMERIC_ONLY,
    REGEX_ALPHA_NUMERIC_ONLY,
    REGEX_ORCID,
    REGEX_PHONE,
    REGEX_NAME,
};
