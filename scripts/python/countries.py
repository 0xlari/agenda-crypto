import unicodedata


COUNTRY_RULES = [
    {
        "name": "Brazil",
        "aliases": ["brasil", "brazil", "br"],
        "cities": [
            "sao paulo",
            "rio de janeiro",
            "florianopolis",
            "sao jose do rio preto",
            "belo horizonte",
            "brasilia",
            "curitiba",
            "porto alegre",
            "recife",
            "salvador",
        ],
    },
    {
        "name": "Argentina",
        "aliases": ["argentina", "ar"],
        "cities": ["buenos aires", "cordoba", "mendoza", "rosario"],
    },
    {
        "name": "Colombia",
        "aliases": ["colombia", "co"],
        "cities": ["bogota", "medellin", "cali", "cartagena"],
    },
    {
        "name": "Mexico",
        "aliases": ["mexico", "mx"],
        "cities": ["ciudad de mexico", "mexico city", "guadalajara", "monterrey"],
    },
    {
        "name": "Chile",
        "aliases": ["chile", "cl"],
        "cities": ["santiago", "valparaiso", "concepcion"],
    },
    {
        "name": "Uruguay",
        "aliases": ["uruguai", "uruguay", "uy"],
        "cities": ["montevideu", "montevideo", "punta del este"],
    },
    {
        "name": "Peru",
        "aliases": ["peru", "pe"],
        "cities": ["lima", "cusco", "arequipa"],
    },
    {
        "name": "Ecuador",
        "aliases": ["equador", "ecuador", "ec"],
        "cities": ["quito", "guayaquil"],
    },
    {
        "name": "Paraguay",
        "aliases": ["paraguai", "paraguay", "py"],
        "cities": ["assuncao", "asuncion", "ciudad del este"],
    },
    {
        "name": "Bolivia",
        "aliases": ["bolivia", "bo"],
        "cities": ["la paz", "santa cruz de la sierra", "cochabamba"],
    },
    {
        "name": "Venezuela",
        "aliases": ["venezuela", "ve"],
        "cities": ["caracas", "maracaibo"],
    },
    {
        "name": "Panama",
        "aliases": ["panama", "pa"],
        "cities": ["cidade do panama", "panama city", "ciudad de panama"],
    },
    {
        "name": "Costa Rica",
        "aliases": ["costa rica", "cr"],
        "cities": ["san jose"],
    },
]


def normalize(value: str | None) -> str:
    text = str(value or "").strip().lower()
    return "".join(
        character
        for character in unicodedata.normalize("NFD", text)
        if unicodedata.category(character) != "Mn"
    )


def country_by_value(value: str | None) -> str | None:
    normalized_value = normalize(value)
    if not normalized_value:
        return None

    for rule in COUNTRY_RULES:
        candidates = [rule["name"], *rule["aliases"]]
        if any(normalize(candidate) == normalized_value for candidate in candidates):
            return rule["name"]

    return str(value).strip()


def country_by_city(city: str | None) -> str | None:
    normalized_city = normalize(city)
    if not normalized_city:
        return None

    for rule in COUNTRY_RULES:
        if any(normalize(known_city) in normalized_city for known_city in rule["cities"]):
            return rule["name"]

    return None


def resolve_country(
    city: str | None, country: str | None, is_online: bool = False
) -> str | None:
    # A recognized city overrides country values corrupted by the old Brazil default.
    inferred_country = country_by_city(city)
    if inferred_country:
        return inferred_country

    provided_country = country_by_value(country)
    if provided_country:
        return provided_country

    if is_online:
        return None

    return None
