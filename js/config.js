export const config = {
photos: {
  provisional: true,
  skipCode: 'SINFOTO',            // respaldo de Stiven si la cámara falla
  received: '¡Ya la tengo!',       // botón tras «Stiven tiene tu sorpresa» (regalos 1–3); el 4 conserva «Ya lo tengo en mis manos»
  title: 'La llave del siguiente nivel es una foto 📸',
  titleLast: 'La llave de tu carta es una foto 📸',
  prompts: [
    'Una foto tuya con tu nuevo cerdito, el invitado especial de esta aventura 🐷',
    'Una foto armando juntos las rosas de Lego aquí en Piedra Parada 🌹',
    'Una foto del osito de rosas aquí en la laguna 🧸',
    'Una foto de los dos con el cuadro 🖼️',
  ],
  take: 'Tomar la foto',
  retake: 'Repetir',
  choose: 'Esta es la foto 💗',
  fromLibrary: 'Elegir de mi galería',
  saveToPhone: 'Guardar también en mi celular',
  saved: '¡Foto guardada! Ya puedes seguir el camino.',
  savedLast: '¡Foto guardada! Tu carta te espera.',
  needPhoto: 'Primero guarda la foto de tu regalo anterior 📸',
  skipLabel: '¿Problemas con la cámara? Pídele a Stiven una clave',
  albumTitle: 'Nuestro día',
},
  "welcome": {
    "text": "Sweet, hay algo bonito en el camino",
    "provisional": true
  },
  "map": {
    "firstMs": 5000,
    "extraMs": 3000,
    "provisional": true
  },
  "memoriesAfterEnd": true,
  "approval": {
    "memoriesAfterEnd": {
      "provisional": true
    }
  },
  "keys": [
    "AGUA21",
    "PIEDRA21",
    "LAGUNA21",
    "BERLIN21"
  ],
  "casa": {
    "key": "CASA21",
    "text": "Sweet, aquí empieza el camino hacia tu siguiente sorpresa.\n\nTodavía no es momento de abrirla: te espera en la laguna. Cuando lleguemos, vuelve a este capítulo. ❤️",
    "provisional": true
  },
  "lifeCodes": [
    "CARRITO",
    "PARAMO",
    "FRAILEJON",
    "ESTRELLA",
    "NUBE"
  ],
  "pin": "STIVEN2111",
  "location": {
    "lat": 7.1310525,
    "lng": -73.1116399,
    "radiusM": 300,
    "accuracyAllowanceM": 150
  },
  "references": [
    [
      7.1481469,
      -72.9054681
    ],
    [
      7.0692,
      -72.8185
    ],
    [
      7.042045,
      -72.807228
    ],
    [
      7.1868458,
      -72.8775601
    ]
  ],
  "guest": "Sweet, a esta aventura se nos une un invitado muy especial… 🤍\n\nViene a acompañarnos en el camino y a guardar un pedacito de este día tan bonito contigo.\n\nDesde hoy entra a tu bonita familia, donde espero que encuentre muchos abrazos y un lugar cerquita de ti. Lo escogí pensando en tu sonrisa y en lo feliz que me hace poder consentirte.\n\nVen, que quiero presentártelo. ✨",
  "final": "Sweet:\n\nEntre conversaciones en el carro, risas y todo el apoyo que me has dado, te has ido haciendo un lugar muy bonito en mi corazón.\n\nPreparar este día fue mi manera de mostrarte cuánto disfruto estar contigo. Me ilusiona seguir conociéndote, encontrar más razones para hacerte sonreír y ver lo que podemos ir construyendo juntos.\n\nEste cuadro guarda un pedacito de nosotros. Yo quiero seguir sumándole recuerdos.\n\nTe deseo un viaje muy bonito, Sweet. Disfruta mucho cada lugar y cada experiencia. Te voy a extrañar muchísimo: nuestras conversaciones, tus risas y esos ratitos juntos que tanto me alegran los días.\n\nEspero verte pronto para abrazarte y escuchar todo lo que tendrás por contarme. Mientras tanto, recuerda que te llevo en mi corazón, estés donde estés.\n\nTe amo. ❤️",
  "song": "https://open.spotify.com/track/7rLgzR0ZUqc0uJwvWDGuYP?si=BpmrbiAjTSKOPsVsYIa_oQ&utm_source=copy-link",
  "gifts": [
    {
      "place": "Parque del Agua",
      "a": {
        "text": "Aquella noche, en el carro, pasamos horas hablando y molestándonos. De pronto, la distancia entre nosotros se hizo muy pequeña. Antes de aquel beso que dio inicio a todo lo bonito que hemos vivido durante este último mes, me hiciste una pregunta que todavía guardo en el corazón… ¿Recuerdas cuál fue?",
        "button": "Recuerdo la pregunta",
        "alts": [
          "que quieres hacer"
        ],
        "contains": [
          [
            "quieres hacer"
          ]
        ]
      },
      "b": {
        "text": "Hay noches que se quedan guardadas para siempre. La nuestra también tiene un lugar en mi calendario. Busca en mi celular el día en que nos dimos ese primer beso; allí te espera una pista. ❤️",
        "button": "Quiero otra pista",
        "alts": [
          "ESEBESO",
          "ese beso"
        ]
      }
    },
    {
      "place": "Refugio Piedra Parada",
      "a": {
        "text": "Hoy quiero que hagamos florecer algo con nuestras propias manos.\n\nNo necesita tierra ni agua: solo paciencia, pequeñas piezas y un ratito juntos.\n\nEs una flor que suele decir «te quiero» sin hablar.\n\n¿Qué flor vamos a construir?",
        "button": "Responder el acertijo",
        "alts": [
          "rosa",
          "rosas",
          "una rosa",
          "unas rosas",
          "la rosa",
          "las rosas"
        ]
      },
      "b": {
        "text": "Antes de estas flores, hubo otras con las que quise hacerte sonreír.\n\nBusca en mi celular la foto del primer ramo que te regalé. Hay un pequeño detalle que lo abrazaba antes de llegar a tus manos…\n\n¿De qué color es el moño que acompaña las flores?",
        "button": "Prefiero otro reto",
        "alts": [
          "fucsia",
          "fuchsia",
          "fucsia",
          "rosado fuerte",
          "rosa fuerte",
          "rosa intenso",
          "rosado intenso",
          "color fucsia"
        ],
        "acceptPlainPink": true
      }
    },
    {
      "place": "Laguna",
      "a": {
        "text": "Cuando no pueda estar cerquita de ti, me gustaría dejarte algo que te haga sentir acompañada.\n\nNo necesita palabras y empieza cuando abrimos los brazos.\n\n¿Qué me gustaría darte, incluso desde lejos?",
        "button": "Responder el acertijo",
        "alts": [
          "un abrazo",
          "abrazo",
          "abrazos",
          "unos abrazos"
        ],
        "provisional": true
      },
      "b": {
        "text": "Para descubrir cómo quiero sentirte, busca el comienzo de cada frase:\n\nCada rato contigo me alegra los días.\n\nEntre conversaciones y risas, te has ido quedando en mi corazón.\n\nRecuerdo aquella noche y todavía sonrío.\n\nCuando estemos lejos, quiero que recuerdes cuánto te amo.\n\nAunque haya kilómetros, te llevo conmigo.",
        "button": "Prefiero otro reto",
        "alts": [
          "cerca"
        ]
      }
    },
    {
      "place": "Berlín",
      "a": {
        "text": "No soy una ventana, aunque tengo un marco.\n\nNo tengo voz, pero llevo una canción.\n\nDentro de mí hay dos pequeñas versiones de nosotros y unas palabras que nacieron del corazón.\n\n¿Qué soy?",
        "button": "Responder el acertijo",
        "alts": [
          "un cuadro",
          "cuadro",
          "cuadro personalizado",
          "un cuadro personalizado"
        ],
        "provisional": true
      },
      "b": {
        "text": "Hay una canción que elegí para guardar un pedacito de nosotros.\n\nSu nombre se ha desordenado. ¿Puedes devolverle su lugar a estas palabras?\n\nLINDA · LA · NOTA · MÁS",
        "button": "Prefiero otro reto",
        "alts": [
          "la nota mas linda"
        ]
      }
    }
  ]
};

// Textos de interfaz editables; el guion literal está arriba.
config.ui = {
  "noPudeCompletarEstePasoIntentalo": "No pude completar este paso. Inténtalo de nuevo.",
  "lindaLaNotaMas": "LINDA · LA · NOTA · MÁS",
  "noPudeGuardarTuAvanceIntentalo": "No pude guardar tu avance. Inténtalo de nuevo.",
  "noPudeAbrirElMapaIntentalo": "No pude abrir el mapa. Inténtalo de nuevo.",
  "volverALaAventura": "Volver a la aventura",
  "paraTiConCarino": "Para ti, con cariño",
  "paraStiven": "Para Stiven",
  "esePinNoFunciona": "Ese PIN no funciona",
  "antesDeComenzar": "Antes de comenzar",
  "elMapaApareceSoloUnosSegundos": "El mapa aparece solo unos segundos. Mira con calma y guarda el camino en tu memoria.\n\nTienes una vida extra para volver a verlo.\n\nEn cada parada, pide tu sorpresa con «Aquí hay algo para mí».\n\nStiven tiene las claves para acompañarte.",
  "estoyLista": "Estoy lista",
  "sweetEsteDiaGuardaPequenosMomentos": "Sweet, este día guarda pequeños momentos para ti. Vamos a descubrirlos juntos.",
  "comenzarAventura": "Comenzar aventura",
  "prepararParaJugarSinSenal": "Preparar para jugar sin señal",
  "text": "✓",
  "paraTiSweet": "Para ti, Sweet",
  "escucharNuestraCancion": "Escuchar nuestra canción",
  "unPoquitoMasDeCamino": "Un poquito más de camino",
  "loLograste": "¡Lo lograste! 💝",
  "stivenTieneTuSorpresa": "Stiven tiene tu sorpresa 💝",
  "stivenTieneTuUltimaSorpresa": "Stiven tiene tu última sorpresa.",
  "stivenTieneTuSorpresa2": "Stiven tiene tu sorpresa.",
  "yaLoTengoEnMisManos": "Ya lo tengo en mis manos",
  "aquiHayAlgoParaTi": "Aquí hay algo para ti",
  "tuRespuesta": "Tu respuesta",
  "siQuieresPideleUnaAyuditaA": "Si quieres, pídele una ayudita a Stiven, o prueba el otro reto 💛",
  "comprobarDondeEstoy": "Comprobar dónde estoy",
  "tengoUnaClaveDeStiven": "Tengo una clave de Stiven",
  "claveDeStiven": "Clave de Stiven",
  "sigamosElCaminoSweet": "Sigamos el camino, Sweet",
  "aquiHayAlgoParaMi": "Aquí hay algo para mí",
  "tuUltimaSorpresa": "Tu última sorpresa",
  "casaAbierto": "Casa · Abierto",
  "volverAVerElMapa": "Volver a ver el mapa",
  "usarTuVida": "¿Usar tu vida?",
  "pideleAStivenUnaNuevaOportunidad": "Pídele a Stiven una nueva oportunidad",
  "codigoDeStiven": "Código de Stiven",
  "hayUnaVersionNuevaEsperando": "Hay una versión nueva esperando.",
  "noHayUnaVersionNuevaEsperando": "No hay una versión nueva esperando.",
  "guardarRespaldo": "Guardar respaldo",
  "respaldoDeLaPartida": "Respaldo de la partida",
  "respaldoCopiado": "Respaldo copiado.",
  "seleccionaYCopiaElTextoDel": "Selecciona y copia el texto del respaldo.",
  "restaurarRespaldo": "Restaurar respaldo",
  "oEligeUnArchivo": "O elige un archivo",
  "eseRespaldoNoEsValido": "Ese respaldo no es válido.",
  "revisarRespaldo": "Revisar respaldo",
  "reemplazarElAvanceActual": "Reemplazar el avance actual",
  "reemplazarElAvanceActual2": "¿Reemplazar el avance actual?",
  "activarVersionNueva": "Activar versión nueva",
  "reiniciarPartida": "Reiniciar partida",
  "reiniciarPartida2": "¿Reiniciar partida?",
  "seBorraraElAvanceActualConfirmas": "Se borrará el avance actual. ¿Confirmas el reinicio?",
  "noPudeLeerTuAvanceCon": "No pude leer tu avance con seguridad. Conserva el respaldo y vuelve a intentarlo.",
  "laPreparacionSeComproboAnteriormentePuedes": "La preparación se comprobó anteriormente. Puedes verificarla de nuevo antes de salir.",
  "noPudeComprobarLaDescargaReintenta": "No pude comprobar la descarga. Reintenta con conexión.",
  "cierraYVuelveAAbrirLa": "Cierra y vuelve a abrir la aventura para completar la preparación.",
  "esteNavegadorNoPermitePrepararLa": "Este navegador no permite preparar la aventura. Abre el enlace seguro en Safari.",
  "activacion": "Activación",
  "noPudeDescargarLaAventuraReintenta": "No pude descargar la aventura. Reintenta con conexión.",
  "laDescargaNoTerminoReintentaCon": "La descarga no terminó. Reintenta con conexión.",
  "contenidoSinSenal": "Contenido sin señal",
  "faltanArchivosPorDescargarReintentaCon": "Faltan archivos por descargar. Reintenta con conexión.",
  "faltaUnaImagenPorDescargar": "Falta una imagen por descargar.",
  "noPudeComprobarUnaImagen": "No pude comprobar una imagen.",
  "guardadoDelAvance": "Guardado del avance",
  "almacenamientoPersistenteConcedido": "Almacenamiento persistente concedido",
  "elSistemaAdministraElAlmacenamientoConserva": "El sistema administra el almacenamiento; conserva un respaldo",
  "abiertoDesdeElIcono": "Abierto desde el icono",
  "abreloDesdeElIconoDeTu": "Ábrelo desde el icono de tu pantalla de inicio y prepara desde ahí",
  "confirmacion": "Confirmación",
  "preparadoParaJugarSinSenal": "Preparado para jugar sin señal ✓",
  "abreloDesdeElIconoDeTu2": " · Ábrelo desde el icono de tu pantalla de inicio y prepara desde ahí",
  "noPudeCompletarLaPreparacionReintenta": "No pude completar la preparación. Reintenta.",
  "laAventuraYaComenzo": "La aventura ya comenzó.",
  "ahoraNoSePuedeAbrirEl": "Ahora no se puede abrir el mapa.",
  "primeroComienzaLaAventura": "Primero comienza la aventura.",
  "eseCodigoYaSeUso": "Ese código ya se usó",
  "eseCodigoNoFunciona": "Ese código no funciona",
  "esaClaveNoEsParaEste": "Esa clave no es para este momento",
  "ahoraNoHaceFaltaComprobarLa": "Ahora no hace falta comprobar la ubicación.",
  "laUbicacionEsImprecisaPideleA": "La ubicación es imprecisa. Pídele a Stiven la clave.",
  "todaviaNoEstamosEnElLugar": "Todavía no estamos en el lugar indicado. Si ya llegamos, pídele a Stiven la clave",
  "esteMomentoAunNoEstaDisponible": "Este momento aún no está disponible.",
  "casiIntentaloOtraVez": "Casi… inténtalo otra vez",
  "noPudeRealizarEsaAccion": "No pude realizar esa acción.",
  "noPudeAbrirElAlmacenamiento": "No pude abrir el almacenamiento.",
  "cierraLasOtrasVentanasDeLa": "Cierra las otras ventanas de la aventura y reintenta.",
  "noPudeLeerElAvanceGuardado": "No pude leer el avance guardado.",
  "noPudeComprobarElGuardado": "No pude comprobar el guardado.",
  "noPudeConsultarTuUbicacionPidele": "No pude consultar tu ubicación. Pídele a Stiven la clave.",
  "noTengoPermisoParaConsultarTu": "No tengo permiso para consultar tu ubicación.",
  "noPudeEncontrarTuUbicacion": "No pude encontrar tu ubicación.",
  "laUbicacionTardoDemasiado": "La ubicación tardó demasiado.",
  "noPudeConsultarTuUbicacion": "No pude consultar tu ubicación.",
  "pideleAStivenLaClave": " Pídele a Stiven la clave."
};
export const ui = config.ui;
