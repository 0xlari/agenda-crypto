export type Locale = "pt" | "es";

export const defaultLocale: Locale = "pt";

export function localeFromPathname(pathname?: string | null): Locale {
  return pathname === "/es" || pathname?.startsWith("/es/") ? "es" : "pt";
}

export function agendaHref(locale: Locale) {
  return locale === "es" ? "/es" : "/agenda";
}

export function languageSwitchHref(locale: Locale) {
  return locale === "es" ? "/agenda" : "/es";
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

const countryNamesEs: Record<string, string> = {
  brasil: "Brasil",
  argentina: "Argentina",
  colombia: "Colombia",
  mexico: "México",
  chile: "Chile",
  uruguai: "Uruguay",
  peru: "Perú",
  equador: "Ecuador",
  paraguai: "Paraguay",
  bolivia: "Bolivia",
  venezuela: "Venezuela",
  panama: "Panamá",
  "costa-rica": "Costa Rica",
  online: "Online",
  "outros-locais": "Otros lugares",
};

export function localizeCountryName(
  country: { key: string; name: string },
  locale: Locale
) {
  if (locale === "es") return countryNamesEs[country.key] || country.name;
  return country.name;
}

export const dictionaries = {
  pt: {
    nav: {
      menuAria: "Menu",
      agenda: "Agenda",
      promotion: "Divulgação",
      production: "Produção de Eventos",
      myAgenda: "Minha Agenda",
      loading: "Carregando...",
      account: "Minha conta",
      logout: "Sair",
      loginGoogle: "Entrar com Google",
      languageLabel: "Ver em espanhol",
      languageShort: "ES",
    },
    footer: {
      description:
        "Curadoria viva dos eventos que realmente importam no ecossistema cripto.",
      tagline: "Se tem data, tá na agenda.",
      navigation: "Navegação",
      events: "Para eventos",
      community: "Comunidade",
      submitEvent: "Cadastrar evento",
      rights: "Todos os direitos reservados.",
    },
    agenda: {
      seoTitle: "Agenda de eventos cripto no Brasil e America Latina",
      seoDescription:
        "Explore eventos cripto, web3 e blockchain por pais, cidade e data. Encontre conferencias, meetups, side events e encontros da comunidade na Agenda Crypto.",
      keywords: [
        "agenda cripto",
        "eventos cripto",
        "eventos web3",
        "eventos blockchain",
        "eventos bitcoin",
        "eventos crypto Brasil",
        "eventos crypto America Latina",
        "meetups cripto",
        "conferencias blockchain",
      ],
      badge: "Se tem data, tá na agenda",
      title: "Agenda Crypto",
      description:
        "Explore os eventos mais relevantes do mercado cripto por país e monte uma rota clara pelo ecossistema latino-americano.",
      promoteTitle: "Quer divulgar um evento?",
      promoteDescription:
        "Cadastre sua data na Agenda Crypto e aumente a visibilidade do seu evento dentro do ecossistema.",
      promoteCta: "+ Cadastre seu evento",
      tourSteps: [
        {
          icon: "🔍",
          title: "Escolha seu país no radar",
          description:
            "Use o mapa ou a lista de países para encontrar rapidamente onde estão os próximos eventos.",
        },
        {
          icon: "🏷️",
          title: "Refine sua rota",
          description:
            "Combine o país com cidade, tema, formato ou nome do evento para chegar ao resultado certo.",
        },
        {
          icon: "📌",
          title: "Monte sua rota pela Agenda",
          description:
            "Salve eventos, marque onde você pretende ir e acompanhe tudo depois na sua Minha Agenda.",
        },
      ],
      tourLabels: {
        openTip: "Abrir dica",
        tour: "Tour rápido",
        minimize: "Minimizar",
        close: "Fechar",
        skip: "Pular tour",
        finish: "Concluir ✓",
        next: "Próximo →",
      },
    },
    agendaBrowser: {
      card: {
        viewEventsIn: "Ver eventos em",
        fallbackDescription: "Confira os detalhes deste evento.",
        until: "até",
        viewEvent: "Ver evento",
      },
      eventTypes: {
        sideEvent: "Side Event",
        conference: "Conference",
        mainEvent: "Evento Principal",
        meetup: "Meetup",
        networking: "Networking",
        institutional: "Institucional",
        technical: "Técnico",
        community: "Comunidade",
        business: "Negócios",
      },
      suggestions: {
        city: "cidade",
        category: "categoria",
        tag: "tag",
        event: "evento",
        type: "tipo",
        country: "país",
      },
      filters: {
        refineTitle: "Refine sua rota",
        refineDescription: "Busque por cidade, tema, formato ou evento.",
        placeholder: "Ex.: Brasil, Bogotá, Bitcoin ou meetup",
        clear: "Limpar",
        activeFilters: "Filtros ativos:",
        removeFilter: "Remover filtro",
        removeSearch: "Remover busca",
        clearAll: "Limpar tudo",
      },
      results: {
        upcoming: "Próximos eventos",
        resultsFor: "Resultados para",
        eventsIn: "Eventos em",
        chronological: "Agenda em ordem cronológica",
        selectionIn: "Uma seleção dos próximos encontros em",
        defaultDescription:
          "Descubra os próximos encontros da comunidade pela América Latina.",
        eventSingular: "evento",
        eventPlural: "eventos",
        emptyTitle: "Nenhum evento nessa rota",
        emptyDescription:
          "Tente outro país ou remova a busca para voltar a explorar todos os próximos eventos.",
        showAll: "Ver todos os eventos",
      },
    },
    countryExplorer: {
      eyebrow: "Explore por país",
      title: "Onde o ecossistema se encontra?",
      description:
        "Escolha um país para ver só os eventos daquela região. O mapa e a lista ficam sincronizados com a busca.",
      ariaLabel: "Filtros por país",
      allCountries: "Todos os países",
      filterBy: "Filtrar por",
      filterMapBy: "Filtrar mapa por",
      eventSingular: "evento",
      eventPlural: "eventos",
      radar: "Radar LATAM",
      footnote: "Cada ponto reúne os próximos eventos daquele país.",
    },
    eventResponse: {
      calendarDetails: "Evento salvo pela Agenda Crypto.",
      saving: "Salvando...",
      marking: "Marcando...",
      goingSelected: "Indo",
      going: "Vou",
      savedSelected: "Salvo",
      save: "Salvar",
      personGoing: "pessoa vai",
      peopleGoing: "pessoas vão",
      firstPresence: "Seja a primeira pessoa a marcar presença",
      removedFromAgenda: "Evento removido da Minha Agenda.",
      savedToAgenda: "Evento salvo na área Minha Agenda.",
      saveError: "Não foi possível salvar o evento.",
      removedPresence: "Você removeu sua presença neste evento.",
      responseError: "Erro ao salvar resposta",
      connectionError: "Erro ao conectar com o servidor",
      markedGoing:
        "Você marcou que vai neste evento. Ele apareceu na área Minha Agenda.",
      loginTitle: "Faça login para montar sua agenda",
      loginDescription:
        "Entre com Google para salvar eventos, marcar presença e acompanhar sua rota pelo ecossistema cripto.",
      accountBenefits: "Com sua conta, você pode:",
      benefits: [
        "salvar eventos para ver depois",
        "marcar os eventos em que pretende ir",
        "confirmar presença e desbloquear Agenda Pass",
        "evoluir seu mascote com sua participação",
      ],
      loginGoogle: "Entrar com Google",
      notNow: "Agora não",
      calendarTitle: "Você marcou que vai.",
      calendarDescription:
        "Quer adicionar este evento ao seu Google Calendar agora?",
      addCalendar: "Adicionar ao Google Calendar",
      later: "Depois",
    },
    newsletter: {
      title: "Receba a curadoria da semana",
      description:
        "Entre na lista da Agenda Crypto para acompanhar eventos, oportunidades e movimentos relevantes do ecossistema.",
      eyebrow: "Newsletter",
      placeholder: "Seu melhor email",
      loading: "Entrando...",
      cta: "Entrar na lista",
      duplicate: "Esse email já está inscrito.",
      error: "Erro ao realizar inscrição.",
      success: "Inscrição realizada com sucesso.",
      connectionError: "Erro ao conectar com o servidor.",
      visualTagline: "Se tem data, tá na agenda.",
      visualTitle:
        "Curadoria viva para quem quer estar onde o mercado acontece.",
    },
  },
  es: {
    nav: {
      menuAria: "Menú",
      agenda: "Agenda",
      promotion: "Divulgación",
      production: "Producción de Eventos",
      myAgenda: "Mi Agenda",
      loading: "Cargando...",
      account: "Mi cuenta",
      logout: "Salir",
      loginGoogle: "Entrar con Google",
      languageLabel: "Ver en portugués",
      languageShort: "PT",
    },
    footer: {
      description:
        "Curaduría viva de los eventos que realmente importan en el ecosistema cripto.",
      tagline: "Si tiene fecha, está en la agenda.",
      navigation: "Navegación",
      events: "Para eventos",
      community: "Comunidad",
      submitEvent: "Registrar evento",
      rights: "Todos los derechos reservados.",
    },
    agenda: {
      seoTitle: "Agenda de eventos cripto en Brasil y América Latina",
      seoDescription:
        "Explora eventos cripto, web3 y blockchain por país, ciudad y fecha. Encuentra conferencias, meetups, side events y encuentros de la comunidad en Agenda Crypto.",
      keywords: [
        "agenda cripto",
        "eventos cripto",
        "eventos web3",
        "eventos blockchain",
        "eventos bitcoin",
        "eventos crypto Brasil",
        "eventos crypto América Latina",
        "meetups cripto",
        "conferencias blockchain",
      ],
      badge: "Si tiene fecha, está en la agenda",
      title: "Agenda Crypto",
      description:
        "Explora los eventos más relevantes del mercado cripto por país y arma una ruta clara por el ecosistema latinoamericano.",
      promoteTitle: "¿Quieres divulgar un evento?",
      promoteDescription:
        "Registra tu fecha en Agenda Crypto y aumenta la visibilidad de tu evento dentro del ecosistema.",
      promoteCta: "+ Registra tu evento",
      tourSteps: [
        {
          icon: "🔍",
          title: "Elige tu país en el radar",
          description:
            "Usa el mapa o la lista de países para encontrar rápidamente dónde están los próximos eventos.",
        },
        {
          icon: "🏷️",
          title: "Refina tu ruta",
          description:
            "Combina país con ciudad, tema, formato o nombre del evento para llegar al resultado correcto.",
        },
        {
          icon: "📌",
          title: "Arma tu ruta en la Agenda",
          description:
            "Guarda eventos, marca dónde quieres ir y acompaña todo después en Mi Agenda.",
        },
      ],
      tourLabels: {
        openTip: "Abrir consejo",
        tour: "Tour rápido",
        minimize: "Minimizar",
        close: "Cerrar",
        skip: "Saltar tour",
        finish: "Finalizar ✓",
        next: "Siguiente →",
      },
    },
    agendaBrowser: {
      card: {
        viewEventsIn: "Ver eventos en",
        fallbackDescription: "Consulta los detalles de este evento.",
        until: "hasta",
        viewEvent: "Ver evento",
      },
      eventTypes: {
        sideEvent: "Side event",
        conference: "Conferencia",
        mainEvent: "Evento principal",
        meetup: "Meetup",
        networking: "Networking",
        institutional: "Institucional",
        technical: "Técnico",
        community: "Comunidad",
        business: "Negocios",
      },
      suggestions: {
        city: "ciudad",
        category: "categoría",
        tag: "tag",
        event: "evento",
        type: "tipo",
        country: "país",
      },
      filters: {
        refineTitle: "Refina tu ruta",
        refineDescription: "Busca por ciudad, tema, formato o evento.",
        placeholder: "Ej.: Brasil, Bogotá, Bitcoin o meetup",
        clear: "Limpiar",
        activeFilters: "Filtros activos:",
        removeFilter: "Quitar filtro",
        removeSearch: "Quitar búsqueda",
        clearAll: "Limpiar todo",
      },
      results: {
        upcoming: "Próximos eventos",
        resultsFor: "Resultados para",
        eventsIn: "Eventos en",
        chronological: "Agenda en orden cronológico",
        selectionIn: "Una selección de los próximos encuentros en",
        defaultDescription:
          "Descubre los próximos encuentros de la comunidad en América Latina.",
        eventSingular: "evento",
        eventPlural: "eventos",
        emptyTitle: "No hay eventos en esta ruta",
        emptyDescription:
          "Prueba otro país o quita la búsqueda para volver a explorar todos los próximos eventos.",
        showAll: "Ver todos los eventos",
      },
    },
    countryExplorer: {
      eyebrow: "Explora por país",
      title: "¿Dónde se encuentra el ecosistema?",
      description:
        "Elige un país para ver solo los eventos de esa región. El mapa y la lista se sincronizan con la búsqueda.",
      ariaLabel: "Filtros por país",
      allCountries: "Todos los países",
      filterBy: "Filtrar por",
      filterMapBy: "Filtrar mapa por",
      eventSingular: "evento",
      eventPlural: "eventos",
      radar: "Radar LATAM",
      footnote: "Cada punto reúne los próximos eventos de ese país.",
    },
    eventResponse: {
      calendarDetails: "Evento guardado por Agenda Crypto.",
      saving: "Guardando...",
      marking: "Marcando...",
      goingSelected: "Voy",
      going: "Voy",
      savedSelected: "Guardado",
      save: "Guardar",
      personGoing: "persona va",
      peopleGoing: "personas van",
      firstPresence: "Sé la primera persona en marcar presencia",
      removedFromAgenda: "Evento eliminado de Mi Agenda.",
      savedToAgenda: "Evento guardado en Mi Agenda.",
      saveError: "No fue posible guardar el evento.",
      removedPresence: "Quitaste tu presencia en este evento.",
      responseError: "Error al guardar la respuesta",
      connectionError: "Error al conectar con el servidor",
      markedGoing: "Marcaste que vas a este evento. Ya aparece en Mi Agenda.",
      loginTitle: "Inicia sesión para armar tu agenda",
      loginDescription:
        "Entra con Google para guardar eventos, marcar presencia y acompañar tu ruta por el ecosistema cripto.",
      accountBenefits: "Con tu cuenta, puedes:",
      benefits: [
        "guardar eventos para ver después",
        "marcar los eventos a los que quieres ir",
        "confirmar presencia y desbloquear Agenda Pass",
        "evolucionar tu mascota con tu participación",
      ],
      loginGoogle: "Entrar con Google",
      notNow: "Ahora no",
      calendarTitle: "Marcaste que vas.",
      calendarDescription:
        "¿Quieres agregar este evento a tu Google Calendar ahora?",
      addCalendar: "Agregar a Google Calendar",
      later: "Después",
    },
    newsletter: {
      title: "Recibe la curaduría de la semana",
      description:
        "Entra en la lista de Agenda Crypto para acompañar eventos, oportunidades y movimientos relevantes del ecosistema.",
      eyebrow: "Newsletter",
      placeholder: "Tu mejor email",
      loading: "Entrando...",
      cta: "Entrar en la lista",
      duplicate: "Este email ya está inscrito.",
      error: "Error al realizar la inscripción.",
      success: "Inscripción realizada con éxito.",
      connectionError: "Error al conectar con el servidor.",
      visualTagline: "Si tiene fecha, está en la agenda.",
      visualTitle:
        "Curaduría viva para quienes quieren estar donde el mercado sucede.",
    },
  },
} as const;
