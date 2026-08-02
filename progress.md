Original prompt: quiero que a darle start en la primera pantalla te pida elegir primero, jugar solo o contra amigos? dos botones "Jugar en solitario" y "Jugar con amigos", si picas en solitario, te dice "cronometraje" o "entrenamiento". SIpicas entrenamento, te lleva directo al mapa despues de una pantalla negra de espera de 4 segundos como si estuviera cargando, sin cuenta atras de salida, sin cronometro, sin vueltas, sin clasificacion. Cronometraje, que sea una carrera normal, pero te lleve directo al mapa con la cuenta atras, el cronometro etc. Jugar con amigos, te que diga "Crear una sala" o "Unirse a una sala", crear una sala, que te diga antes: mapa predeterminado o mapa personalizado, si elijes mapa personalizado, tienes que pegar una serie de numeros (si te fijas el repo tiene una funcion para dibujar eu mapa y luego exportarlo y para utilizarlo era control+I (o command+I), y quiero hacer lo mismo pero ahi asi es mas facil compartir mapas, y al poner el mapa, te de un codigo de 5 caracteres, no de 4, asi el juego distingue que salas son de mapa predeterminado, y cuales otras son de mapa personalizado, y de esta manera, antes los jugadres sin era un mapa personalizado, tenian que hacer control+i o command+i para poner el mapa, por lo que quiero que el juego detecte los 5 caracteres, para que sepa que es un mapa personalizado, y empareje a los jugadores sin necesidad de que todos tenagn que poner el codigo del mapa. Para cualquier sala, que en vez de esperar al anfitrion de darle a start, que bajo el codigo del mapa aparezcan todos los miembros de la sala actuales, y que todos tengan que darle a listo, que la lista aparezcan emojis de check a la gente que le dio a listo. tambien quiero que el juego este en español, y que actualices el readme, para que ponga que le hice fotk a jchabin/cars, que el juego es completamente suyo, y yo solamente me apeticio, hacerle un rediseño

## 2026-08-02

- Limpiado `script.js`: se retiraron bloques duplicados heredados que dejaban código viejo fuera de contexto.
- Añadido flujo principal: `Jugar en solitario` / `Jugar con amigos`.
- Añadido solitario con `Cronometraje` y `Entrenamiento`; entrenamiento carga 4 segundos sin cuenta atrás, cronómetro, vueltas ni clasificación.
- Añadida creación de salas con mapa predeterminado o personalizado; las salas personalizadas generan código de 5 caracteres.
- Añadido lobby con lista de jugadores y estado `Estoy listo`; el anfitrión arranca automáticamente cuando todos están listos.
- Españolizados textos visibles principales y actualizado `README.md` con atribución al fork de `jchabin/cars`.

## 2026-08-02 (fixes de bugs)

- Botones de menú encimados: las clases `menu-top`/`menu-bottom`/`menu-back` no existían en CSS y todos los botones `.button` (position:absolute sin `top`) caían en la misma posición. Añadidas sus posiciones y quitados los `top` de `#host`/`#join` que entraban en conflicto en el menú de amigos.
- Botón "Volver" que a veces no funcionaba: `menu2()` crasheaba al leer `document.getElementById("name").value` cuando el input inicial ya no existe (se navegaba desde submenús). Ahora hay guard de null.
- Modo Cronometraje no conducía: `startSoloGame()` nunca asignaba `me.data`, y el bucle de render hacía `players["me"].data = me.data` (objeto vacío `{}`) → física con NaN. Ahora `me.data` apunta a los datos del jugador. Además el display de vueltas usa `Math.max(1, me.data.lap)` para mostrar 1/3 al arrancar (se mantuvo `lap: 0` internamente, consistente con multijugador).
- `join()` ahora es idempotente (flag `joined`) para no duplicar mapas/cámaras/bucles de render al navegar entre menús; `deleteMap()` tiene guard si el mapa no existe.
- Pantalla de mapa personalizado: el textarea no tenía animación de entrada (quedaba fuera de pantalla) y el botón Continuar no tenía posición. Se añadieron `id` y clase de posición.
- Guards de null en timers de animación de `menu2()` y `friendsMenu()`.

## TODO

- Validar en navegador con Firebase real que dos pestañas sincronizan `ready` y arranque.
- Revisar visualmente en móvil si los menús largos caben bien en pantalla pequeña.
